package com.workforce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class DressCodeSelectionRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotBlank(message = "Color name is required")
    private String selectedColorName;

    @NotBlank(message = "Color hex code is required")
    private String selectedColorHex;

    private String notes;

    public DressCodeSelectionRequest() {}

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getSelectedColorName() { return selectedColorName; }
    public void setSelectedColorName(String selectedColorName) { this.selectedColorName = selectedColorName; }

    public String getSelectedColorHex() { return selectedColorHex; }
    public void setSelectedColorHex(String selectedColorHex) { this.selectedColorHex = selectedColorHex; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
