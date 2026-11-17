package com.workforce.mapper;

import com.workforce.dto.EmployeeCreateRequest;
import com.workforce.entity.Employee;
import com.workforce.entity.User;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class EmployeeMapper {

    public Map<String, Object> toDto(Employee employee) {
        if (employee == null) return null;

        Map<String, Object> map = new HashMap<>();
        map.put("id", employee.getId());
        map.put("companyId", employee.getCompany() != null ? employee.getCompany().getId() : null);
        map.put("userId", employee.getUser() != null ? employee.getUser().getId() : null);
        map.put("employeeCode", employee.getUser() != null ? employee.getUser().getEmployeeCode() : null);
        map.put("firstName", employee.getUser() != null ? employee.getUser().getFirstName() : null);
        map.put("lastName", employee.getUser() != null ? employee.getUser().getLastName() : null);
        map.put("fullName", employee.getUser() != null ? employee.getUser().getFullName() : null);
        map.put("email", employee.getUser() != null ? employee.getUser().getEmail() : null);
        map.put("phone", employee.getUser() != null ? employee.getUser().getPhone() : null);
        map.put("avatarUrl", employee.getUser() != null ? employee.getUser().getAvatarUrl() : null);
        map.put("designation", employee.getDesignation());
        map.put("joiningDate", employee.getJoiningDate() != null ? employee.getJoiningDate().toString() : null);
        map.put("employmentType", employee.getEmploymentType());
        map.put("workStatus", employee.getWorkStatus());
        map.put("emergencyContactName", employee.getEmergencyContactName());
        map.put("emergencyContactPhone", employee.getEmergencyContactPhone());

        if (employee.getDepartment() != null) {
            map.put("departmentId", employee.getDepartment().getId());
            map.put("departmentName", employee.getDepartment().getName());
        }

        if (employee.getPrimaryLocation() != null) {
            map.put("locationId", employee.getPrimaryLocation().getId());
            map.put("locationName", employee.getPrimaryLocation().getName());
        }

        if (employee.getCurrentShift() != null) {
            map.put("shiftId", employee.getCurrentShift().getId());
            map.put("shiftName", employee.getCurrentShift().getName());
        }

        return map;
    }
}

