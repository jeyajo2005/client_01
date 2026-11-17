package com.workforce.controller;

import com.workforce.dto.ApiResponse;
import com.workforce.entity.Location;
import com.workforce.service.LocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@Tag(name = "Location Management", description = "Office geofences and GPS verification perimeter configurations")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping("/company/{companyId}")
    @Operation(summary = "List Office Locations", description = "Retrieve list of all geofenced office premises for a company")
    public ResponseEntity<ApiResponse<List<Location>>> getCompanyLocations(@PathVariable Long companyId) {
        List<Location> locations = locationService.getCompanyLocations(companyId);
        return ResponseEntity.ok(ApiResponse.ok(locations));
    }

    @PostMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN')")
    @Operation(summary = "Add Office Location", description = "Create an office geofence with latitude, longitude, and radius")
    public ResponseEntity<ApiResponse<Location>> createLocation(
            @PathVariable Long companyId,
            @Valid @RequestBody Location location) {
        Location created = locationService.createLocation(companyId, location);
        return ResponseEntity.ok(ApiResponse.ok("Office location added", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN')")
    @Operation(summary = "Update Office Location", description = "Modify coordinates, radius, or status of an office location")
    public ResponseEntity<ApiResponse<Location>> updateLocation(
            @PathVariable Long id,
            @Valid @RequestBody Location location) {
        Location updated = locationService.updateLocation(id, location);
        return ResponseEntity.ok(ApiResponse.ok("Office location updated", updated));
    }
}
