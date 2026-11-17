package com.workforce.dto;

import java.util.List;

public class JwtAuthResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private Long userId;
    private Long employeeId;
    private Long companyId;
    private String companyName;
    private String employeeCode;
    private String email;
    private String fullName;
    private String avatarUrl;
    private List<String> roles;
    private String workStatus;

    public JwtAuthResponse() {}

    public JwtAuthResponse(String accessToken, Long userId, Long employeeId, Long companyId, String companyName,
                           String employeeCode, String email, String fullName, String avatarUrl,
                           List<String> roles, String workStatus) {
        this.accessToken = accessToken;
        this.tokenType = "Bearer";
        this.userId = userId;
        this.employeeId = employeeId;
        this.companyId = companyId;
        this.companyName = companyName;
        this.employeeCode = employeeCode;
        this.email = email;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.roles = roles;
        this.workStatus = workStatus;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String employeeCode) { this.employeeCode = employeeCode; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }

    public String getWorkStatus() { return workStatus; }
    public void setWorkStatus(String workStatus) { this.workStatus = workStatus; }
}
