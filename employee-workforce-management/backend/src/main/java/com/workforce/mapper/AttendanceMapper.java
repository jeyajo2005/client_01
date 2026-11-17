package com.workforce.mapper;

import com.workforce.entity.Attendance;
import com.workforce.entity.AttendancePhoto;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class AttendanceMapper {

    public Map<String, Object> toDto(Attendance attendance) {
        if (attendance == null) return null;

        Map<String, Object> map = new HashMap<>();
        map.put("id", attendance.getId());
        map.put("companyId", attendance.getCompany() != null ? attendance.getCompany().getId() : null);
        map.put("employeeId", attendance.getEmployee() != null ? attendance.getEmployee().getId() : null);
        map.put("employeeName", attendance.getEmployee() != null && attendance.getEmployee().getUser() != null
                ? attendance.getEmployee().getUser().getFullName() : null);
        map.put("employeeCode", attendance.getEmployee() != null && attendance.getEmployee().getUser() != null
                ? attendance.getEmployee().getUser().getEmployeeCode() : null);
        map.put("department", attendance.getEmployee() != null && attendance.getEmployee().getDepartment() != null
                ? attendance.getEmployee().getDepartment().getName() : "General");
        map.put("shiftName", attendance.getShift() != null ? attendance.getShift().getName() : "Standard Shift");
        map.put("attendanceDate", attendance.getAttendanceDate() != null ? attendance.getAttendanceDate().toString() : null);
        map.put("checkInTime", attendance.getCheckInTime() != null ? attendance.getCheckInTime().toString() : null);
        map.put("checkOutTime", attendance.getCheckOutTime() != null ? attendance.getCheckOutTime().toString() : null);
        map.put("checkInLatitude", attendance.getCheckInLatitude());
        map.put("checkInLongitude", attendance.getCheckInLongitude());
        map.put("checkInLocationVerified", attendance.getCheckInLocationVerified());
        map.put("checkInDistanceMeters", attendance.getCheckInDistanceMeters());
        map.put("checkOutLocationVerified", attendance.getCheckOutLocationVerified());
        map.put("totalWorkMinutes", attendance.getTotalWorkMinutes());
        map.put("totalBreakMinutes", attendance.getTotalBreakMinutes());
        map.put("status", attendance.getStatus());
        map.put("isLate", attendance.getIsLate());
        map.put("lateMinutes", attendance.getLateMinutes());
        map.put("isEarlyLogout", attendance.getIsEarlyLogout());
        map.put("earlyLogoutMinutes", attendance.getEarlyLogoutMinutes());
        map.put("notes", attendance.getNotes());

        return map;
    }

    public Map<String, Object> toPhotoDto(AttendancePhoto photo) {
        if (photo == null) return null;

        Map<String, Object> map = new HashMap<>();
        map.put("id", photo.getId());
        map.put("attendanceId", photo.getAttendance() != null ? photo.getAttendance().getId() : null);
        map.put("photoType", photo.getPhotoType());
        map.put("photoUrl", photo.getPhotoUrl());
        map.put("photoDataBase64", photo.getPhotoDataBase64());
        map.put("capturedAt", photo.getCapturedAt() != null ? photo.getCapturedAt().toString() : null);
        map.put("verifiedByHr", photo.getVerifiedByHr());
        map.put("reviewNotes", photo.getReviewNotes());

        return map;
    }
}

