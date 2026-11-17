package com.workforce.repository;

import com.workforce.entity.ShiftChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShiftChangeRequestRepository extends JpaRepository<ShiftChangeRequest, Long> {
    List<ShiftChangeRequest> findByCompanyIdOrderByCreatedAtDesc(Long companyId);
    List<ShiftChangeRequest> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    List<ShiftChangeRequest> findByCompanyIdAndStatus(Long companyId, String status);
}
