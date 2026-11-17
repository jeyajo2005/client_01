package com.workforce.service;

import com.workforce.dto.DashboardSummaryResponse;
import com.workforce.entity.Attendance;
import com.workforce.entity.Department;
import com.workforce.entity.DressCode;
import com.workforce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private ShiftRepository shiftRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DressCodeService dressCodeService;

    public DashboardSummaryResponse getDashboardSummary(Long companyId) {
        LocalDate today = LocalDate.now();

        long totalEmployees = employeeRepository.countByCompanyId(companyId);
        long presentToday = attendanceRepository.countByCompanyIdAndAttendanceDate(companyId, today);
        long lateToday = attendanceRepository.countByCompanyIdAndAttendanceDateAndIsLateTrue(companyId, today);
        long onBreakToday = employeeRepository.countByCompanyIdAndWorkStatus(companyId, "ON_BREAK");
        long absentToday = Math.max(0, totalEmployees - presentToday);
        long activeShifts = shiftRepository.findByCompanyIdAndIsActiveTrue(companyId).size();

        double attendancePercentage = totalEmployees > 0
                ? Math.round(((double) presentToday / totalEmployees) * 1000.0) / 10.0
                : 0.0;

        List<Attendance> todayAttendance = attendanceRepository.findByCompanyIdAndAttendanceDate(companyId, today);
        List<Map<String, Object>> recentCheckIns = todayAttendance.stream()
                .sorted(Comparator.comparing(Attendance::getCheckInTime).reversed())
                .limit(10)
                .map(att -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", att.getId());
                    map.put("employeeName", att.getEmployee().getUser().getFullName());
                    map.put("employeeCode", att.getEmployee().getUser().getEmployeeCode());
                    map.put("department", att.getEmployee().getDepartment() != null ? att.getEmployee().getDepartment().getName() : "N/A");
                    map.put("checkInTime", att.getCheckInTime().toString());
                    map.put("status", att.getStatus());
                    map.put("isLate", att.getIsLate());
                    map.put("lateMinutes", att.getLateMinutes());
                    map.put("locationVerified", att.getCheckInLocationVerified());
                    map.put("distanceMeters", att.getCheckInDistanceMeters());
                    return map;
                })
                .collect(Collectors.toList());

        List<Department> departments = departmentRepository.findByCompanyId(companyId);
        List<Map<String, Object>> deptStats = departments.stream().map(dept -> {
            Map<String, Object> map = new HashMap<>();
            map.put("departmentId", dept.getId());
            map.put("name", dept.getName());
            map.put("code", dept.getCode());
            return map;
        }).collect(Collectors.toList());

        Optional<DressCode> dressOpt = dressCodeService.getTodayDressCode(companyId);
        Map<String, Object> dressMap = new HashMap<>();
        if (dressOpt.isPresent()) {
            DressCode dc = dressOpt.get();
            dressMap.put("colorName", dc.getColorName());
            dressMap.put("colorHex", dc.getColorHex());
            dressMap.put("description", dc.getDescription());
            dressMap.put("isMandatory", dc.getIsMandatory());
        }

        DashboardSummaryResponse response = new DashboardSummaryResponse();
        response.setTotalEmployees(totalEmployees);
        response.setPresentToday(presentToday);
        response.setAbsentToday(absentToday);
        response.setLateEmployees(lateToday);
        response.setEmployeesOnBreak(onBreakToday);
        response.setActiveShifts(activeShifts);
        response.setAttendancePercentage(attendancePercentage);
        response.setRecentCheckIns(recentCheckIns);
        response.setDepartmentStats(deptStats);
        response.setTodayDressCode(dressMap);

        return response;
    }
}
