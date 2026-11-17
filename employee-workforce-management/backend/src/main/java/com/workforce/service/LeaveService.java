package com.workforce.service;

import com.workforce.dto.LeaveApplicationRequest;
import com.workforce.entity.Employee;
import com.workforce.entity.LeaveRequest;
import com.workforce.entity.User;
import com.workforce.exception.BadRequestException;
import com.workforce.exception.ResourceNotFoundException;
import com.workforce.repository.EmployeeRepository;
import com.workforce.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Transactional
    public LeaveRequest applyLeave(LeaveApplicationRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Leave end date cannot be before start date");
        }

        int totalDays = (int) ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;

        LeaveRequest leave = new LeaveRequest(
                employee.getCompany(),
                employee,
                request.getLeaveType(),
                request.getStartDate(),
                request.getEndDate(),
                totalDays,
                request.getReason()
        );

        return leaveRequestRepository.save(leave);
    }

    public List<LeaveRequest> getCompanyLeaves(Long companyId) {
        return leaveRequestRepository.findByCompanyIdOrderByCreatedAtDesc(companyId);
    }

    public List<LeaveRequest> getEmployeeLeaves(Long employeeId) {
        return leaveRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId);
    }

    @Transactional
    public LeaveRequest reviewLeave(Long leaveId, boolean approve, String rejectionReason, User reviewer) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        if (!"PENDING".equals(leave.getStatus())) {
            throw new BadRequestException("Leave request is already processed: " + leave.getStatus());
        }

        leave.setStatus(approve ? "APPROVED" : "REJECTED");
        leave.setApprovedBy(reviewer);
        leave.setReviewedAt(LocalDateTime.now());
        if (!approve) {
            leave.setRejectionReason(rejectionReason);
        }

        return leaveRequestRepository.save(leave);
    }
}
