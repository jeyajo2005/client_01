package com.workforce.controller;

import com.workforce.dto.ApiResponse;
import com.workforce.dto.ShiftChangeCreateRequest;
import com.workforce.entity.Shift;
import com.workforce.entity.ShiftChangeRequest;
import com.workforce.entity.User;
import com.workforce.security.UserPrincipal;
import com.workforce.service.ShiftService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shifts")
@Tag(name = "Shift Management", description = "Shift definitions, schedules, and shift change workflows")
public class ShiftController {

    @Autowired
    private ShiftService shiftService;

    @GetMapping("/company/{companyId}")
    @Operation(summary = "Get Company Shifts", description = "Retrieve list of all active shifts configured for a company")
    public ResponseEntity<ApiResponse<List<Shift>>> getCompanyShifts(@PathVariable Long companyId) {
        List<Shift> shifts = shiftService.getCompanyShifts(companyId);
        return ResponseEntity.ok(ApiResponse.ok(shifts));
    }

    @PostMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Create Shift", description = "Define a new shift with work hours, grace periods, and color tags")
    public ResponseEntity<ApiResponse<Shift>> createShift(@PathVariable Long companyId, @Valid @RequestBody Shift shift) {
        Shift created = shiftService.createShift(companyId, shift);
        return ResponseEntity.ok(ApiResponse.ok("Shift created successfully", created));
    }

    @PostMapping("/requests")
    @Operation(summary = "Request Shift Change", description = "Submit a request by employee to transition to another shift")
    public ResponseEntity<ApiResponse<ShiftChangeRequest>> requestShiftChange(@Valid @RequestBody ShiftChangeCreateRequest request) {
        ShiftChangeRequest created = shiftService.requestShiftChange(request);
        return ResponseEntity.ok(ApiResponse.ok("Shift change request submitted", created));
    }

    @GetMapping("/requests/company/{companyId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Company Shift Requests", description = "View all pending and past shift change requests for HR review")
    public ResponseEntity<ApiResponse<List<ShiftChangeRequest>>> getCompanyShiftRequests(@PathVariable Long companyId) {
        List<ShiftChangeRequest> list = shiftService.getCompanyShiftChangeRequests(companyId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/requests/employee/{employeeId}")
    @Operation(summary = "Employee Shift Requests", description = "View shift change requests submitted by an employee")
    public ResponseEntity<ApiResponse<List<ShiftChangeRequest>>> getEmployeeShiftRequests(@PathVariable Long employeeId) {
        List<ShiftChangeRequest> list = shiftService.getEmployeeShiftChangeRequests(employeeId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/requests/{requestId}/review")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Approve / Reject Shift Request", description = "HR or Admin approval of an employee shift change request")
    public ResponseEntity<ApiResponse<ShiftChangeRequest>> reviewShiftRequest(
            @PathVariable Long requestId,
            @RequestParam boolean approve,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        User reviewer = new User();
        reviewer.setId(currentUser.getId());
        ShiftChangeRequest reviewed = shiftService.reviewShiftChangeRequest(requestId, approve, reviewer);
        return ResponseEntity.ok(ApiResponse.ok(approve ? "Shift change approved" : "Shift change rejected", reviewed));
    }
}
