package com.workforce.controller;

import com.workforce.dto.ApiResponse;
import com.workforce.dto.LeaveApplicationRequest;
import com.workforce.entity.LeaveRequest;
import com.workforce.entity.User;
import com.workforce.security.UserPrincipal;
import com.workforce.service.LeaveService;
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
@RequestMapping("/api/leaves")
@Tag(name = "Leave Management", description = "Time-off requests, balances, and HR approvals")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @PostMapping("/apply")
    @Operation(summary = "Apply for Leave", description = "Submit a vacation, sick, or casual leave application")
    public ResponseEntity<ApiResponse<LeaveRequest>> applyLeave(@Valid @RequestBody LeaveApplicationRequest request) {
        LeaveRequest created = leaveService.applyLeave(request);
        return ResponseEntity.ok(ApiResponse.ok("Leave application submitted successfully", created));
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Company Leave Requests", description = "View all leave requests within a company for review")
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getCompanyLeaves(@PathVariable Long companyId) {
        List<LeaveRequest> list = leaveService.getCompanyLeaves(companyId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Employee Leave History", description = "Retrieve personal leave history for an employee")
    public ResponseEntity<ApiResponse<List<LeaveRequest>>> getEmployeeLeaves(@PathVariable Long employeeId) {
        List<LeaveRequest> list = leaveService.getEmployeeLeaves(employeeId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/{leaveId}/review")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Approve / Reject Leave", description = "HR or Admin approval action on a pending leave request")
    public ResponseEntity<ApiResponse<LeaveRequest>> reviewLeave(
            @PathVariable Long leaveId,
            @RequestParam boolean approve,
            @RequestParam(required = false) String rejectionReason,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        User reviewer = new User();
        reviewer.setId(currentUser.getId());
        LeaveRequest reviewed = leaveService.reviewLeave(leaveId, approve, rejectionReason, reviewer);
        return ResponseEntity.ok(ApiResponse.ok(approve ? "Leave approved" : "Leave rejected", reviewed));
    }
}
