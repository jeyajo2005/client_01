package com.workforce.repository;

import com.workforce.entity.EmployeeDress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeDressRepository extends JpaRepository<EmployeeDress, Long> {
    List<EmployeeDress> findByCompanyIdAndDressDate(Long companyId, LocalDate dressDate);
    List<EmployeeDress> findByEmployeeIdOrderByDressDateDesc(Long employeeId);
    Optional<EmployeeDress> findByEmployeeIdAndDressDate(Long employeeId, LocalDate dressDate);
}
