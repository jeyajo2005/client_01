package com.workforce.controller;

import com.workforce.dto.ApiResponse;
import com.workforce.dto.DressCodeSelectionRequest;
import com.workforce.entity.DressCode;
import com.workforce.entity.EmployeeDress;
import com.workforce.service.DressCodeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dress-codes")
@Tag(name = "Dress Code Management", description = "Company dress policies, daily employee dress selection, and AI compliance verification")
public class DressCodeController {

    @Autowired
    private DressCodeService dressCodeService;

    @GetMapping("/company/{companyId}")
    @Operation(summary = "Get Weekly Dress Schedule", description = "Retrieve weekly dress code rules for the company")
    public ResponseEntity<ApiResponse<List<DressCode>>> getCompanyDressCodes(@PathVariable Long companyId) {
        List<DressCode> codes = dressCodeService.getCompanyDressCodes(companyId);
        return ResponseEntity.ok(ApiResponse.ok(codes));
    }

    @GetMapping("/today/{companyId}")
    @Operation(summary = "Get Today's Dress Code", description = "Get today's designated dress color and theme for the company")
    public ResponseEntity<ApiResponse<DressCode>> getTodayDressCode(@PathVariable Long companyId) {
        return dressCodeService.getTodayDressCode(companyId)
                .map(code -> ResponseEntity.ok(ApiResponse.ok(code)))
                .orElse(ResponseEntity.ok(ApiResponse.ok("No dress code specified for today", null)));
    }

    @PostMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Save Dress Code Policy", description = "Admin sets or updates dress code policy for a specific weekday")
    public ResponseEntity<ApiResponse<DressCode>> saveDressCodePolicy(
            @PathVariable Long companyId,
            @Valid @RequestBody DressCode dressCode) {
        DressCode saved = dressCodeService.saveDressCodePolicy(companyId, dressCode);
        return ResponseEntity.ok(ApiResponse.ok("Dress code policy updated", saved));
    }

    @PostMapping("/select")
    @Operation(summary = "Select Daily Dress Color", description = "Employee submits today's selected dress color and triggers AI compliance check")
    public ResponseEntity<ApiResponse<EmployeeDress>> selectDailyDress(@Valid @RequestBody DressCodeSelectionRequest request) {
        EmployeeDress record = dressCodeService.selectDailyDress(request);
        return ResponseEntity.ok(ApiResponse.ok("Dress selection recorded", record));
    }

    @GetMapping("/history/{employeeId}")
    @Operation(summary = "Employee Dress History", description = "View history of daily dress choices and compliance")
    public ResponseEntity<ApiResponse<List<EmployeeDress>>> getEmployeeDressHistory(@PathVariable Long employeeId) {
        List<EmployeeDress> history = dressCodeService.getEmployeeDressHistory(employeeId);
        return ResponseEntity.ok(ApiResponse.ok(history));
    }

    @GetMapping("/today-selections/{companyId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Company Today Dress Selections", description = "View all employee dress selections for today with compliance flags")
    public ResponseEntity<ApiResponse<List<EmployeeDress>>> getCompanyTodayDressSelections(@PathVariable Long companyId) {
        List<EmployeeDress> list = dressCodeService.getCompanyTodayDressSelections(companyId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
