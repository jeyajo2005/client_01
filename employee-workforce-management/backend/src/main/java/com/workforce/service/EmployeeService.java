package com.workforce.service;

import com.workforce.dto.EmployeeCreateRequest;
import com.workforce.entity.*;
import com.workforce.exception.BadRequestException;
import com.workforce.exception.ResourceNotFoundException;
import com.workforce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private ShiftRepository shiftRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Employee> getCompanyEmployees(Long companyId) {
        return employeeRepository.findByCompanyId(companyId);
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    public Employee getEmployeeByUserId(Long userId) {
        return employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found for user id: " + userId));
    }

    @Transactional
    public Employee createEmployee(Long companyId, EmployeeCreateRequest request) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email already exists: " + request.getEmail());
        }

        // Generate unique employee code if not provided
        String empCode = request.getEmployeeCode();
        if (empCode == null || empCode.isBlank()) {
            long count = employeeRepository.countByCompanyId(companyId) + 1;
            empCode = String.format("EMP-%04d", count);
            while (userRepository.existsByEmployeeCode(empCode)) {
                count++;
                empCode = String.format("EMP-%04d", count);
            }
        } else if (userRepository.existsByEmployeeCode(empCode)) {
            throw new BadRequestException("Employee code already in use: " + empCode);
        }

        // Default password
        String rawPassword = (request.getPassword() != null && !request.getPassword().isBlank())
                ? request.getPassword()
                : "Employee@123";

        Role empRole = roleRepository.findByName("ROLE_EMPLOYEE")
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_EMPLOYEE not found"));

        User user = new User(empCode, request.getEmail(), passwordEncoder.encode(rawPassword),
                request.getFirstName(), request.getLastName());
        user.setCompany(company);
        user.setPhone(request.getPhone());
        user.setRoles(Set.of(empRole));
        user.setAvatarUrl(String.format("https://ui-avatars.com/api/?name=%s+%s&background=1e3a8a&color=fff",
                request.getFirstName(), request.getLastName()));
        user = userRepository.save(user);

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        }

        Location location = null;
        if (request.getLocationId() != null) {
            location = locationRepository.findById(request.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
        }

        Shift shift = null;
        if (request.getShiftId() != null) {
            shift = shiftRepository.findById(request.getShiftId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shift not found"));
        }

        LocalDate joining = request.getJoiningDate() != null ? request.getJoiningDate() : LocalDate.now();

        Employee employee = new Employee(user, company, department, location, shift, request.getDesignation(), joining);
        employee.setEmploymentType(request.getEmploymentType() != null ? request.getEmploymentType() : "FULL_TIME");
        employee.setEmergencyContactName(request.getEmergencyContactName());
        employee.setEmergencyContactPhone(request.getEmergencyContactPhone());
        employee.setWorkStatus("OFFLINE");

        return employeeRepository.save(employee);
    }

    @Transactional
    public Employee updateEmployee(Long id, EmployeeCreateRequest request) {
        Employee employee = getEmployeeById(id);
        User user = employee.getUser();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        userRepository.save(user);

        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
            employee.setDepartment(dept);
        }

        if (request.getLocationId() != null) {
            Location loc = locationRepository.findById(request.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
            employee.setPrimaryLocation(loc);
        }

        if (request.getShiftId() != null) {
            Shift shift = shiftRepository.findById(request.getShiftId())
                    .orElseThrow(() -> new ResourceNotFoundException("Shift not found"));
            employee.setCurrentShift(shift);
        }

        employee.setDesignation(request.getDesignation());
        if (request.getEmploymentType() != null) {
            employee.setEmploymentType(request.getEmploymentType());
        }
        if (request.getEmergencyContactName() != null) {
            employee.setEmergencyContactName(request.getEmergencyContactName());
        }
        if (request.getEmergencyContactPhone() != null) {
            employee.setEmergencyContactPhone(request.getEmergencyContactPhone());
        }

        return employeeRepository.save(employee);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = getEmployeeById(id);
        User user = employee.getUser();
        employeeRepository.delete(employee);
        if (user != null) {
            userRepository.delete(user);
        }
    }
}
