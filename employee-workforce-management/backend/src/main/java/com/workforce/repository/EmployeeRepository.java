package com.workforce.repository;

import com.workforce.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByCompanyId(Long companyId);
    Optional<Employee> findByUserId(Long userId);
    Optional<Employee> findByCompanyIdAndId(Long companyId, Long id);
    
    @Query("SELECT e FROM Employee e WHERE e.company.id = :companyId AND (:deptId IS NULL OR e.department.id = :deptId) AND (:status IS NULL OR e.workStatus = :status)")
    List<Employee> searchEmployees(@Param("companyId") Long companyId, @Param("deptId") Long deptId, @Param("status") String status);

    long countByCompanyId(Long companyId);
    long countByCompanyIdAndWorkStatus(Long companyId, String workStatus);
}
