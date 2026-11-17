package com.workforce.controller;

import com.workforce.dto.ApiResponse;
import com.workforce.dto.EmployeeCreateRequest;
import com.workforce.entity.Employee;
import com.workforce.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@Tag(name = "Employee Management", description = "Employee profiles, onboarding, assignments, and updates")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "List Company Employees", description = "Retrieve all employees belonging to a specific company")
    public ResponseEntity<ApiResponse<List<Employee>>> getCompanyEmployees(@PathVariable Long companyId) {
        List<Employee> employees = employeeService.getCompanyEmployees(companyId);
        return ResponseEntity.ok(ApiResponse.ok(employees));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Employee Profile", description = "Get detailed employee profile by ID")
    public ResponseEntity<ApiResponse<Employee>> getEmployeeById(@PathVariable Long id) {
        Employee employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(ApiResponse.ok(employee));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get Employee Profile by User ID", description = "Retrieve employee record by associated User account ID")
    public ResponseEntity<ApiResponse<Employee>> getEmployeeByUserId(@PathVariable Long userId) {
        Employee employee = employeeService.getEmployeeByUserId(userId);
        return ResponseEntity.ok(ApiResponse.ok(employee));
    }

    @PostMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Create New Employee", description = "Add an employee with automatic ID generation, credentials, and shift/dept assignment")
    public ResponseEntity<ApiResponse<Employee>> createEmployee(
            @PathVariable Long companyId,
            @Valid @RequestBody EmployeeCreateRequest request) {
        Employee created = employeeService.createEmployee(companyId, request);
        return ResponseEntity.ok(ApiResponse.ok("Employee created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Update Employee", description = "Update employee details, designation, department, and shifts")
    public ResponseEntity<ApiResponse<Employee>> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeCreateRequest request) {
        Employee updated = employeeService.updateEmployee(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Employee updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN')")
    @Operation(summary = "Delete Employee", description = "Remove an employee record from the system")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.ok("Employee deleted successfully", null));
    }
}
