package com.workforce.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employee_dress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"employee_id", "dress_date"})
})
public class EmployeeDress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "dress_date", nullable = false)
    private LocalDate dressDate;

    @Column(name = "selected_color_name", nullable = false, length = 50)
    private String selectedColorName;

    @Column(name = "selected_color_hex", nullable = false, length = 20)
    private String selectedColorHex;

    @Column(name = "is_compliant", nullable = false)
    private Boolean isCompliant = true;

    @Column(name = "ai_verified")
    private Boolean aiVerified = false;

    @Column(name = "ai_confidence_score")
    private Double aiConfidenceScore = 0.95;

    @Column(length = 255)
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public EmployeeDress() {}

    public EmployeeDress(Company company, Employee employee, LocalDate dressDate, String selectedColorName, String selectedColorHex, Boolean isCompliant) {
        this.company = company;
        this.employee = employee;
        this.dressDate = dressDate;
        this.selectedColorName = selectedColorName;
        this.selectedColorHex = selectedColorHex;
        this.isCompliant = isCompliant != null ? isCompliant : true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public LocalDate getDressDate() { return dressDate; }
    public void setDressDate(LocalDate dressDate) { this.dressDate = dressDate; }

    public String getSelectedColorName() { return selectedColorName; }
    public void setSelectedColorName(String selectedColorName) { this.selectedColorName = selectedColorName; }

    public String getSelectedColorHex() { return selectedColorHex; }
    public void setSelectedColorHex(String selectedColorHex) { this.selectedColorHex = selectedColorHex; }

    public Boolean getIsCompliant() { return isCompliant; }
    public void setIsCompliant(Boolean isCompliant) { this.isCompliant = isCompliant; }

    public Boolean getAiVerified() { return aiVerified; }
    public void setAiVerified(Boolean aiVerified) { this.aiVerified = aiVerified; }

    public Double getAiConfidenceScore() { return aiConfidenceScore; }
    public void setAiConfidenceScore(Double aiConfidenceScore) { this.aiConfidenceScore = aiConfidenceScore; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
