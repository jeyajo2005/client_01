package com.workforce.controller;

import com.workforce.dto.*;
import com.workforce.entity.Attendance;
import com.workforce.entity.AttendancePhoto;
import com.workforce.entity.BreakSession;
import com.workforce.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@Tag(name = "Attendance Management", description = "GPS geofenced check-in/out, selfie attendance, and break tracking")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/check-in")
    @Operation(summary = "Employee Check-in", description = "Records check-in with GPS radius validation, live selfie photo, and late detection")
    public ResponseEntity<ApiResponse<Attendance>> checkIn(@Valid @RequestBody CheckInRequest request) {
        Attendance attendance = attendanceService.checkIn(request);
        return ResponseEntity.ok(ApiResponse.ok("Checked in successfully", attendance));
    }

    @PostMapping("/check-out")
    @Operation(summary = "Employee Check-out", description = "Records check-out, calculates working hours, and validates location")
    public ResponseEntity<ApiResponse<Attendance>> checkOut(@Valid @RequestBody CheckOutRequest request) {
        Attendance attendance = attendanceService.checkOut(request);
        return ResponseEntity.ok(ApiResponse.ok("Checked out successfully", attendance));
    }

    @PostMapping("/breaks/start")
    @Operation(summary = "Start Break", description = "Begins a break session (Tea, Lunch, Meeting, Personal)")
    public ResponseEntity<ApiResponse<BreakSession>> startBreak(@Valid @RequestBody BreakRequest request) {
        BreakSession breakSession = attendanceService.startBreak(request);
        return ResponseEntity.ok(ApiResponse.ok("Break started", breakSession));
    }

    @PostMapping("/breaks/end")
    @Operation(summary = "End Break", description = "Ends the employee's active break and updates total break time")
    public ResponseEntity<ApiResponse<BreakSession>> endBreak(@RequestParam Long employeeId) {
        BreakSession breakSession = attendanceService.endBreak(employeeId);
        return ResponseEntity.ok(ApiResponse.ok("Break ended successfully", breakSession));
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Company Attendance Records", description = "Retrieve attendance logs for a company filtered by date range")
    public ResponseEntity<ApiResponse<List<Attendance>>> getCompanyAttendance(
            @PathVariable Long companyId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<Attendance> list = attendanceService.getCompanyAttendance(companyId, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Employee Attendance History", description = "Retrieve personal attendance records for an employee")
    public ResponseEntity<ApiResponse<List<Attendance>>> getEmployeeAttendance(@PathVariable Long employeeId) {
        List<Attendance> list = attendanceService.getEmployeeAttendance(employeeId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{attendanceId}/photos")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "View Attendance Selfies", description = "Review live captured check-in/out selfies for audit")
    public ResponseEntity<ApiResponse<List<AttendancePhoto>>> getAttendancePhotos(@PathVariable Long attendanceId) {
        List<AttendancePhoto> photos = attendanceService.getAttendancePhotos(attendanceId);
        return ResponseEntity.ok(ApiResponse.ok(photos));
    }
}
