package com.workforce.dto;

import jakarta.validation.constraints.NotNull;

public class BreakRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    private String breakType = "TEA_BREAK"; // TEA_BREAK, LUNCH_BREAK, MEETING, PERSONAL
    private String notes;

    public BreakRequest() {}

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getBreakType() { return breakType; }
    public void setBreakType(String breakType) { this.breakType = breakType; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
