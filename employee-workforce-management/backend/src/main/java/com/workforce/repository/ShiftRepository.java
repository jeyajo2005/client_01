package com.workforce.repository;

import com.workforce.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {
    List<Shift> findByCompanyId(Long companyId);
    List<Shift> findByCompanyIdAndIsActiveTrue(Long companyId);
}
