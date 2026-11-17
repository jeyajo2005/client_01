package com.workforce.controller;

import com.workforce.dto.ApiResponse;
import com.workforce.dto.DashboardSummaryResponse;
import com.workforce.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports & Analytics", description = "Workforce analytics, attendance percentages, and executive KPIs")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/dashboard/{companyId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Analytics Dashboard Summary", description = "Calculate KPIs, attendance rates, break counts, and real-time punch feeds")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getDashboardSummary(@PathVariable Long companyId) {
        DashboardSummaryResponse summary = reportService.getDashboardSummary(companyId);
        return ResponseEntity.ok(ApiResponse.ok(summary));
    }
}
