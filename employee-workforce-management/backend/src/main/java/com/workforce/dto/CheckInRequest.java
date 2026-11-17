package com.workforce.dto;

import jakarta.validation.constraints.NotNull;

public class CheckInRequest {

    @NotNull(message = "Employee ID is required")
    private Long employeeId;

    @NotNull(message = "Latitude is required for GPS verification")
    private Double latitude;

    @NotNull(message = "Longitude is required for GPS verification")
    private Double longitude;

    private String selfieBase64;
    private String dressColorName;
    private String dressColorHex;
    private String notes;

    public CheckInRequest() {}

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getSelfieBase64() { return selfieBase64; }
    public void setSelfieBase64(String selfieBase64) { this.selfieBase64 = selfieBase64; }

    public String getDressColorName() { return dressColorName; }
    public void setDressColorName(String dressColorName) { this.dressColorName = dressColorName; }

    public String getDressColorHex() { return dressColorHex; }
    public void setDressColorHex(String dressColorHex) { this.dressColorHex = dressColorHex; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
