package com.workforce.controller;

import com.workforce.dto.ApiResponse;
import com.workforce.entity.Department;
import com.workforce.service.DepartmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@Tag(name = "Department Management", description = "Organizational departments and business units")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping("/company/{companyId}")
    @Operation(summary = "List Departments", description = "Get all departments within a specific company")
    public ResponseEntity<ApiResponse<List<Department>>> getCompanyDepartments(@PathVariable Long companyId) {
        List<Department> list = departmentService.getCompanyDepartments(companyId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Create Department", description = "Add a new organizational department")
    public ResponseEntity<ApiResponse<Department>> createDepartment(
            @PathVariable Long companyId,
            @Valid @RequestBody Department department) {
        Department created = departmentService.createDepartment(companyId, department);
        return ResponseEntity.ok(ApiResponse.ok("Department created", created));
    }
}
