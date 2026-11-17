package com.workforce.mapper;

import com.workforce.entity.Department;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class DepartmentMapper {

    public Map<String, Object> toDto(Department department) {
        if (department == null) return null;

        Map<String, Object> map = new HashMap<>();
        map.put("id", department.getId());
        map.put("companyId", department.getCompany() != null ? department.getCompany().getId() : null);
        map.put("name", department.getName());
        map.put("code", department.getCode());
        map.put("description", department.getDescription());
        map.put("managerId", department.getManager() != null ? department.getManager().getId() : null);

        return map;
    }
}

