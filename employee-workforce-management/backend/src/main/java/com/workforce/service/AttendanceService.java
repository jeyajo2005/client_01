package com.workforce.service;

import com.workforce.dto.BreakRequest;
import com.workforce.dto.CheckInRequest;
import com.workforce.dto.CheckOutRequest;
import com.workforce.entity.*;
import com.workforce.exception.BadRequestException;
import com.workforce.exception.ResourceNotFoundException;
import com.workforce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private AttendancePhotoRepository attendancePhotoRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private BreakRepository breakRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Value("${app.upload.dir:uploads/selfies}")
    private String uploadDir;

    // Haversine formula to compute great-circle distance between two GPS coordinates in meters
    public static double calculateDistanceMeters(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000; // Earth radius in meters
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 10.0) / 10.0; // Round to 1 decimal place
    }

    @Transactional
    public Attendance checkIn(CheckInRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + request.getEmployeeId()));

        LocalDate today = LocalDate.now();
        if (attendanceRepository.findByEmployeeIdAndAttendanceDate(employee.getId(), today).isPresent()) {
            throw new BadRequestException("Employee has already checked in for today");
        }

        Shift shift = employee.getCurrentShift();
        if (shift == null) {
            throw new BadRequestException("Employee does not have an assigned shift");
        }

        Location officeLocation = employee.getPrimaryLocation();
        double distanceMeters = 0.0;
        boolean locationVerified = false;

        if (officeLocation != null) {
            distanceMeters = calculateDistanceMeters(
                    request.getLatitude(),
                    request.getLongitude(),
                    officeLocation.getLatitude(),
                    officeLocation.getLongitude()
            );
            locationVerified = distanceMeters <= officeLocation.getRadiusMeters();
        } else {
            // Default verified if no geofence configured
            locationVerified = true;
        }

        LocalDateTime now = LocalDateTime.now();
        LocalTime currentTime = now.toLocalTime();

        // Late arrival detection
        LocalTime shiftStart = shift.getStartTime();
        LocalTime graceLimit = shiftStart.plusMinutes(shift.getGracePeriodMinutes());
        boolean isLate = currentTime.isAfter(graceLimit);
        int lateMinutes = 0;
        if (isLate) {
            lateMinutes = (int) Duration.between(shiftStart, currentTime).toMinutes();
        }

        Attendance attendance = new Attendance();
        attendance.setCompany(employee.getCompany());
        attendance.setEmployee(employee);
        attendance.setShift(shift);
        attendance.setAttendanceDate(today);
        attendance.setCheckInTime(now);
        attendance.setCheckInLatitude(request.getLatitude());
        attendance.setCheckInLongitude(request.getLongitude());
        attendance.setCheckInLocationVerified(locationVerified);
        attendance.setCheckInDistanceMeters(distanceMeters);
        attendance.setStatus(isLate ? "LATE" : "PRESENT");
        attendance.setIsLate(isLate);
        attendance.setLateMinutes(lateMinutes);
        attendance.setNotes(request.getNotes());

        attendance = attendanceRepository.save(attendance);

        // Save Selfie if provided
        if (request.getSelfieBase64() != null && !request.getSelfieBase64().isBlank()) {
            String photoUrl = saveSelfieToFileSystem(request.getSelfieBase64(), employee.getId(), "CHECK_IN");
            AttendancePhoto photo = new AttendancePhoto(attendance, "CHECK_IN", photoUrl, request.getSelfieBase64(), now);
            attendancePhotoRepository.save(photo);
        }

        // Update employee status
        employee.setWorkStatus("WORKING");
        employeeRepository.save(employee);

        // Audit Log
        auditLogRepository.save(new AuditLog(
                employee.getCompany().getId(),
                employee.getUser().getId(),
                "CHECK_IN",
                "ATTENDANCE",
                attendance.getId(),
                String.format("Checked in at %s. GPS Verified: %s (Dist: %.1fm). Late: %s",
                        now.toLocalTime(), locationVerified, distanceMeters, isLate),
                "0.0.0.0"
        ));

        return attendance;
    }

    @Transactional
    public Attendance checkOut(CheckOutRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + request.getEmployeeId()));

        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndAttendanceDate(employee.getId(), today)
                .orElseThrow(() -> new BadRequestException("No check-in record found for today"));

        if (attendance.getCheckOutTime() != null) {
            throw new BadRequestException("Employee has already checked out for today");
        }

        // Close any ongoing break
        Optional<BreakSession> openBreakOpt = breakRepository.findByEmployeeIdAndEndTimeIsNull(employee.getId());
        if (openBreakOpt.isPresent()) {
            BreakSession openBreak = openBreakOpt.get();
            openBreak.setEndTime(LocalDateTime.now());
            int duration = (int) Duration.between(openBreak.getStartTime(), openBreak.getEndTime()).toMinutes();
            openBreak.setDurationMinutes(duration);
            breakRepository.save(openBreak);
            int currentBreaks = attendance.getTotalBreakMinutes() != null ? attendance.getTotalBreakMinutes() : 0;
            attendance.setTotalBreakMinutes(currentBreaks + duration);
        }

        Location officeLocation = employee.getPrimaryLocation();
        double distanceMeters = 0.0;
        boolean locationVerified = false;

        if (officeLocation != null) {
            distanceMeters = calculateDistanceMeters(
                    request.getLatitude(),
                    request.getLongitude(),
                    officeLocation.getLatitude(),
                    officeLocation.getLongitude()
            );
            locationVerified = distanceMeters <= officeLocation.getRadiusMeters();
        } else {
            locationVerified = true;
        }

        LocalDateTime now = LocalDateTime.now();
        LocalTime currentTime = now.toLocalTime();

        // Early logout detection
        Shift shift = attendance.getShift();
        boolean isEarly = currentTime.isBefore(shift.getEndTime());
        int earlyMinutes = 0;
        if (isEarly) {
            earlyMinutes = (int) Duration.between(currentTime, shift.getEndTime()).toMinutes();
        }

        // Total working minutes calculation
        int totalElapsedMinutes = (int) Duration.between(attendance.getCheckInTime(), now).toMinutes();
        int netWorkMinutes = Math.max(0, totalElapsedMinutes - (attendance.getTotalBreakMinutes() != null ? attendance.getTotalBreakMinutes() : 0));

        attendance.setCheckOutTime(now);
        attendance.setCheckOutLatitude(request.getLatitude());
        attendance.setCheckOutLongitude(request.getLongitude());
        attendance.setCheckOutLocationVerified(locationVerified);
        attendance.setCheckOutDistanceMeters(distanceMeters);
        attendance.setIsEarlyLogout(isEarly);
        attendance.setEarlyLogoutMinutes(earlyMinutes);
        attendance.setTotalWorkMinutes(netWorkMinutes);

        if (request.getNotes() != null && !request.getNotes().isBlank()) {
            attendance.setNotes((attendance.getNotes() != null ? attendance.getNotes() + "; " : "") + request.getNotes());
        }

        attendance = attendanceRepository.save(attendance);

        // Save Selfie if provided
        if (request.getSelfieBase64() != null && !request.getSelfieBase64().isBlank()) {
            String photoUrl = saveSelfieToFileSystem(request.getSelfieBase64(), employee.getId(), "CHECK_OUT");
            AttendancePhoto photo = new AttendancePhoto(attendance, "CHECK_OUT", photoUrl, request.getSelfieBase64(), now);
            attendancePhotoRepository.save(photo);
        }

        // Update employee status
        employee.setWorkStatus("COMPLETED");
        employeeRepository.save(employee);

        auditLogRepository.save(new AuditLog(
                employee.getCompany().getId(),
                employee.getUser().getId(),
                "CHECK_OUT",
                "ATTENDANCE",
                attendance.getId(),
                String.format("Checked out at %s. Net Work Time: %d mins. Early logout: %s",
                        now.toLocalTime(), netWorkMinutes, isEarly),
                "0.0.0.0"
        ));

        return attendance;
    }

    @Transactional
    public BreakSession startBreak(BreakRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (breakRepository.findByEmployeeIdAndEndTimeIsNull(employee.getId()).isPresent()) {
            throw new BadRequestException("Employee is already on an active break");
        }

        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByEmployeeIdAndAttendanceDate(employee.getId(), today)
                .orElseThrow(() -> new BadRequestException("Employee must be checked in before starting a break"));

        BreakSession breakSession = new BreakSession(attendance, employee, request.getBreakType(), LocalDateTime.now());
        breakSession.setNotes(request.getNotes());
        breakSession = breakRepository.save(breakSession);

        employee.setWorkStatus("ON_BREAK");
        employeeRepository.save(employee);

        return breakSession;
    }

    @Transactional
    public BreakSession endBreak(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        BreakSession openBreak = breakRepository.findByEmployeeIdAndEndTimeIsNull(employee.getId())
                .orElseThrow(() -> new BadRequestException("No active break found for this employee"));

        LocalDateTime now = LocalDateTime.now();
        openBreak.setEndTime(now);
        int duration = (int) Duration.between(openBreak.getStartTime(), now).toMinutes();
        openBreak.setDurationMinutes(duration);
        breakRepository.save(openBreak);

        // Update attendance total break time
        Attendance attendance = openBreak.getAttendance();
        attendance.setTotalBreakMinutes((attendance.getTotalBreakMinutes() != null ? attendance.getTotalBreakMinutes() : 0) + duration);
        attendanceRepository.save(attendance);

        employee.setWorkStatus("WORKING");
        employeeRepository.save(employee);

        return openBreak;
    }

    public List<Attendance> getCompanyAttendance(Long companyId, LocalDate startDate, LocalDate endDate) {
        if (startDate == null) startDate = LocalDate.now().minusDays(30);
        if (endDate == null) endDate = LocalDate.now();
        return attendanceRepository.findByCompanyIdAndDateRange(companyId, startDate, endDate);
    }

    public List<Attendance> getEmployeeAttendance(Long employeeId) {
        return attendanceRepository.findByEmployeeIdOrderByAttendanceDateDesc(employeeId);
    }

    public List<AttendancePhoto> getAttendancePhotos(Long attendanceId) {
        return attendancePhotoRepository.findByAttendanceId(attendanceId);
    }

    // Helper to persist base64 selfie to local directory
    private String saveSelfieToFileSystem(String base64Data, Long employeeId, String type) {
        try {
            Path directory = Paths.get(uploadDir);
            if (!Files.exists(directory)) {
                Files.createDirectories(directory);
            }

            String cleanBase64 = base64Data;
            if (base64Data.contains(",")) {
                cleanBase64 = base64Data.split(",")[1];
            }

            byte[] decodedBytes = Base64.getDecoder().decode(cleanBase64);
            String filename = String.format("selfie_%d_%s_%d.jpg", employeeId, type.toLowerCase(), System.currentTimeMillis());
            File file = new File(directory.toFile(), filename);

            try (OutputStream stream = new FileOutputStream(file)) {
                stream.write(decodedBytes);
            }

            return "/uploads/selfies/" + filename;
        } catch (Exception e) {
            System.err.println("Could not save selfie to filesystem: " + e.getMessage());
            return null;
        }
    }
}
