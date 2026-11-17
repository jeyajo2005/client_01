package com.workforce.service;

import com.workforce.dto.ShiftChangeCreateRequest;
import com.workforce.entity.*;
import com.workforce.exception.BadRequestException;
import com.workforce.exception.ResourceNotFoundException;
import com.workforce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ShiftService {

    @Autowired
    private ShiftRepository shiftRepository;

    @Autowired
    private ShiftChangeRequestRepository shiftChangeRequestRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeeShiftRepository employeeShiftRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public List<Shift> getCompanyShifts(Long companyId) {
        return shiftRepository.findByCompanyId(companyId);
    }

    public Shift getShiftById(Long id) {
        return shiftRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shift not found with id: " + id));
    }

    @Transactional
    public Shift createShift(Long companyId, Shift shift) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + companyId));
        shift.setCompany(company);
        return shiftRepository.save(shift);
    }

    @Transactional
    public ShiftChangeRequest requestShiftChange(ShiftChangeCreateRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        Shift targetShift = shiftRepository.findById(request.getRequestedShiftId())
                .orElseThrow(() -> new ResourceNotFoundException("Target shift not found"));

        ShiftChangeRequest changeRequest = new ShiftChangeRequest(
                employee.getCompany(),
                employee,
                employee.getCurrentShift(),
                targetShift,
                request.getEffectiveDate(),
                request.getReason()
        );

        return shiftChangeRequestRepository.save(changeRequest);
    }

    public List<ShiftChangeRequest> getCompanyShiftChangeRequests(Long companyId) {
        return shiftChangeRequestRepository.findByCompanyIdOrderByCreatedAtDesc(companyId);
    }

    public List<ShiftChangeRequest> getEmployeeShiftChangeRequests(Long employeeId) {
        return shiftChangeRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(employeeId);
    }

    @Transactional
    public ShiftChangeRequest reviewShiftChangeRequest(Long requestId, boolean approve, User reviewer) {
        ShiftChangeRequest changeRequest = shiftChangeRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Shift change request not found"));

        if (!"PENDING".equals(changeRequest.getStatus())) {
            throw new BadRequestException("Request has already been processed: " + changeRequest.getStatus());
        }

        changeRequest.setStatus(approve ? "APPROVED" : "REJECTED");
        changeRequest.setReviewedBy(reviewer);

        if (approve) {
            Employee employee = changeRequest.getEmployee();
            employee.setCurrentShift(changeRequest.getRequestedShift());
            employeeRepository.save(employee);

            // Record in employee_shifts history
            employeeShiftRepository.save(new EmployeeShift(
                    employee,
                    changeRequest.getRequestedShift(),
                    changeRequest.getEffectiveDate(),
                    null
            ));
        }

        return shiftChangeRequestRepository.save(changeRequest);
    }
}
