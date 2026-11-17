package com.workforce.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.workforce.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class UserPrincipal implements UserDetails {

    private Long id;
    private Long companyId;
    private String employeeCode;
    private String email;
    private String fullName;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;
    private Boolean isActive;

    public UserPrincipal(Long id, Long companyId, String employeeCode, String email, String fullName,
                         String password, Collection<? extends GrantedAuthority> authorities, Boolean isActive) {
        this.id = id;
        this.companyId = companyId;
        this.employeeCode = employeeCode;
        this.email = email;
        this.fullName = fullName;
        this.password = password;
        this.authorities = authorities;
        this.isActive = isActive;
    }

    public static UserPrincipal create(User user) {
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());

        Long companyId = user.getCompany() != null ? user.getCompany().getId() : null;

        return new UserPrincipal(
                user.getId(),
                companyId,
                user.getEmployeeCode(),
                user.getEmail(),
                user.getFullName(),
                user.getPassword(),
                authorities,
                user.getIsActive()
        );
    }

    public Long getId() { return id; }
    public Long getCompanyId() { return companyId; }
    public String getEmployeeCode() { return employeeCode; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }

    @Override
    public String getUsername() { return email; }

    @Override
    public String getPassword() { return password; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return Boolean.TRUE.equals(isActive); }
}
