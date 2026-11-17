package com.workforce.repository;

import com.workforce.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByCompanyId(Long companyId);
    Optional<Department> findByCompanyIdAndCode(Long companyId, String code);
    boolean existsByCompanyIdAndCode(Long companyId, String code);
}
