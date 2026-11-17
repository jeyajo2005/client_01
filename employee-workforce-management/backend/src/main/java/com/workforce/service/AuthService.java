package com.workforce.service;

import com.workforce.dto.JwtAuthResponse;
import com.workforce.dto.LoginRequest;
import com.workforce.entity.Employee;
import com.workforce.entity.User;
import com.workforce.exception.BadRequestException;
import com.workforce.repository.EmployeeRepository;
import com.workforce.repository.UserRepository;
import com.workforce.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public JwtAuthResponse authenticateUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmailOrEmployeeCode(loginRequest.getUsername(), loginRequest.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid username/email or password"));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        List<String> roles = user.getRoles().stream()
                .map(r -> r.getName())
                .collect(Collectors.toList());

        Long companyId = user.getCompany() != null ? user.getCompany().getId() : null;
        String companyName = user.getCompany() != null ? user.getCompany().getName() : "Global Platform";

        Optional<Employee> empOpt = employeeRepository.findByUserId(user.getId());
        Long employeeId = empOpt.map(Employee::getId).orElse(null);
        String workStatus = empOpt.map(Employee::getWorkStatus).orElse("OFFLINE");

        return new JwtAuthResponse(
                jwt,
                user.getId(),
                employeeId,
                companyId,
                companyName,
                user.getEmployeeCode(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                roles,
                workStatus
        );
    }
}
