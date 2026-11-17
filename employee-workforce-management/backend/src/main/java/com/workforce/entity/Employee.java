package com.workforce.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnoreProperties({"company", "roles", "password", "hibernateLazyInitializer", "handler"})
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "primary_location_id")
    private Location primaryLocation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "current_shift_id")
    private Shift currentShift;

    @Column(nullable = false, length = 100)
    private String designation;

    @Column(name = "joining_date", nullable = false)
    private LocalDate joiningDate;

    @Column(name = "employment_type", nullable = false, length = 30)
    private String employmentType = "FULL_TIME"; // FULL_TIME, PART_TIME, CONTRACT

    @Column(name = "work_status", nullable = false, length = 30)
    private String workStatus = "OFFLINE"; // WORKING, ON_BREAK, COMPLETED, ON_LEAVE, OFFLINE

    @Column(name = "emergency_contact_name", length = 100)
    private String emergencyContactName;

    @Column(name = "emergency_contact_phone", length = 30)
    private String emergencyContactPhone;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Employee() {}

    public Employee(User user, Company company, Department department, Location primaryLocation, Shift currentShift, String designation, LocalDate joiningDate) {
        this.user = user;
        this.company = company;
        this.department = department;
        this.primaryLocation = primaryLocation;
        this.currentShift = currentShift;
        this.designation = designation;
        this.joiningDate = joiningDate;
        this.employmentType = "FULL_TIME";
        this.workStatus = "OFFLINE";
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public Location getPrimaryLocation() { return primaryLocation; }
    public void setPrimaryLocation(Location primaryLocation) { this.primaryLocation = primaryLocation; }

    public Shift getCurrentShift() { return currentShift; }
    public void setCurrentShift(Shift currentShift) { this.currentShift = currentShift; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }

    public String getEmploymentType() { return employmentType; }
    public void setEmploymentType(String employmentType) { this.employmentType = employmentType; }

    public String getWorkStatus() { return workStatus; }
    public void setWorkStatus(String workStatus) { this.workStatus = workStatus; }

    public String getEmergencyContactName() { return emergencyContactName; }
    public void setEmergencyContactName(String emergencyContactName) { this.emergencyContactName = emergencyContactName; }

    public String getEmergencyContactPhone() { return emergencyContactPhone; }
    public void setEmergencyContactPhone(String emergencyContactPhone) { this.emergencyContactPhone = emergencyContactPhone; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
