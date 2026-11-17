package com.workforce.repository;

import com.workforce.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByCompanyIdOrderByCreatedAtDesc(Long companyId);
    List<LeaveRequest> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    List<LeaveRequest> findByCompanyIdAndStatus(Long companyId, String status);
    long countByCompanyIdAndStatus(Long companyId, String status);
}
