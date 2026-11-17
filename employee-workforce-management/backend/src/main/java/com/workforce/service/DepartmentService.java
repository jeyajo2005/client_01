package com.workforce.service;

import com.workforce.entity.Company;
import com.workforce.entity.Department;
import com.workforce.exception.ResourceNotFoundException;
import com.workforce.repository.CompanyRepository;
import com.workforce.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public List<Department> getCompanyDepartments(Long companyId) {
        return departmentRepository.findByCompanyId(companyId);
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    }

    @Transactional
    public Department createDepartment(Long companyId, Department department) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        department.setCompany(company);
        return departmentRepository.save(department);
    }
}
