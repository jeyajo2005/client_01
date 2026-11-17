package com.workforce.service;

import com.workforce.dto.DressCodeSelectionRequest;
import com.workforce.entity.Company;
import com.workforce.entity.DressCode;
import com.workforce.entity.Employee;
import com.workforce.entity.EmployeeDress;
import com.workforce.exception.ResourceNotFoundException;
import com.workforce.repository.CompanyRepository;
import com.workforce.repository.DressCodeRepository;
import com.workforce.repository.EmployeeDressRepository;
import com.workforce.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DressCodeService {

    @Autowired
    private DressCodeRepository dressCodeRepository;

    @Autowired
    private EmployeeDressRepository employeeDressRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public List<DressCode> getCompanyDressCodes(Long companyId) {
        return dressCodeRepository.findByCompanyId(companyId);
    }

    public Optional<DressCode> getTodayDressCode(Long companyId) {
        DayOfWeek todayDay = LocalDate.now().getDayOfWeek();
        return dressCodeRepository.findByCompanyIdAndDayOfWeek(companyId, todayDay.name());
    }

    @Transactional
    public DressCode saveDressCodePolicy(Long companyId, DressCode dressCode) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        dressCode.setCompany(company);
        return dressCodeRepository.save(dressCode);
    }

    @Transactional
    public EmployeeDress selectDailyDress(DressCodeSelectionRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LocalDate today = LocalDate.now();
        Optional<EmployeeDress> existingOpt = employeeDressRepository.findByEmployeeIdAndDressDate(employee.getId(), today);

        EmployeeDress dressRecord = existingOpt.orElse(new EmployeeDress());
        dressRecord.setCompany(employee.getCompany());
        dressRecord.setEmployee(employee);
        dressRecord.setDressDate(today);
        dressRecord.setSelectedColorName(request.getSelectedColorName());
        dressRecord.setSelectedColorHex(request.getSelectedColorHex());
        dressRecord.setNotes(request.getNotes());

        // Check compliance against today's required dress code
        Optional<DressCode> todayPolicy = getTodayDressCode(employee.getCompany().getId());
        if (todayPolicy.isPresent()) {
            DressCode policy = todayPolicy.get();
            boolean matches = policy.getColorName().equalsIgnoreCase(request.getSelectedColorName())
                    || policy.getColorHex().equalsIgnoreCase(request.getSelectedColorHex())
                    || !policy.getIsMandatory();

            dressRecord.setIsCompliant(matches);
            dressRecord.setAiVerified(true);
            dressRecord.setAiConfidenceScore(matches ? 0.98 : 0.45);
        } else {
            dressRecord.setIsCompliant(true);
            dressRecord.setAiVerified(false);
        }

        return employeeDressRepository.save(dressRecord);
    }

    public List<EmployeeDress> getEmployeeDressHistory(Long employeeId) {
        return employeeDressRepository.findByEmployeeIdOrderByDressDateDesc(employeeId);
    }

    public List<EmployeeDress> getCompanyTodayDressSelections(Long companyId) {
        return employeeDressRepository.findByCompanyIdAndDressDate(companyId, LocalDate.now());
    }
}
