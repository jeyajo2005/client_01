package com.workforce.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"employee_id", "attendance_date"})
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "shift_id", nullable = false)
    private Shift shift;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column(name = "check_in_time", nullable = false)
    private LocalDateTime checkInTime;

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    @Column(name = "check_in_latitude")
    private Double checkInLatitude;

    @Column(name = "check_in_longitude")
    private Double checkInLongitude;

    @Column(name = "check_in_location_verified")
    private Boolean checkInLocationVerified = false;

    @Column(name = "check_in_distance_meters")
    private Double checkInDistanceMeters = 0.0;

    @Column(name = "check_out_latitude")
    private Double checkOutLatitude;

    @Column(name = "check_out_longitude")
    private Double checkOutLongitude;

    @Column(name = "check_out_location_verified")
    private Boolean checkOutLocationVerified = false;

    @Column(name = "check_out_distance_meters")
    private Double checkOutDistanceMeters = 0.0;

    @Column(name = "total_work_minutes")
    private Integer totalWorkMinutes = 0;

    @Column(name = "total_break_minutes")
    private Integer totalBreakMinutes = 0;

    @Column(nullable = false, length = 30)
    private String status = "PRESENT"; // PRESENT, LATE, HALF_DAY, ABSENT

    @Column(name = "is_late")
    private Boolean isLate = false;

    @Column(name = "late_minutes")
    private Integer lateMinutes = 0;

    @Column(name = "is_early_logout")
    private Boolean isEarlyLogout = false;

    @Column(name = "early_logout_minutes")
    private Integer earlyLogoutMinutes = 0;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Attendance() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public Shift getShift() { return shift; }
    public void setShift(Shift shift) { this.shift = shift; }

    public LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }

    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }

    public LocalDateTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalDateTime checkOutTime) { this.checkOutTime = checkOutTime; }

    public Double getCheckInLatitude() { return checkInLatitude; }
    public void setCheckInLatitude(Double checkInLatitude) { this.checkInLatitude = checkInLatitude; }

    public Double getCheckInLongitude() { return checkInLongitude; }
    public void setCheckInLongitude(Double checkInLongitude) { this.checkInLongitude = checkInLongitude; }

    public Boolean getCheckInLocationVerified() { return checkInLocationVerified; }
    public void setCheckInLocationVerified(Boolean checkInLocationVerified) { this.checkInLocationVerified = checkInLocationVerified; }

    public Double getCheckInDistanceMeters() { return checkInDistanceMeters; }
    public void setCheckInDistanceMeters(Double checkInDistanceMeters) { this.checkInDistanceMeters = checkInDistanceMeters; }

    public Double getCheckOutLatitude() { return checkOutLatitude; }
    public void setCheckOutLatitude(Double checkOutLatitude) { this.checkOutLatitude = checkOutLatitude; }

    public Double getCheckOutLongitude() { return checkOutLongitude; }
    public void setCheckOutLongitude(Double checkOutLongitude) { this.checkOutLongitude = checkOutLongitude; }

    public Boolean getCheckOutLocationVerified() { return checkOutLocationVerified; }
    public void setCheckOutLocationVerified(Boolean checkOutLocationVerified) { this.checkOutLocationVerified = checkOutLocationVerified; }

    public Double getCheckOutDistanceMeters() { return checkOutDistanceMeters; }
    public void setCheckOutDistanceMeters(Double checkOutDistanceMeters) { this.checkOutDistanceMeters = checkOutDistanceMeters; }

    public Integer getTotalWorkMinutes() { return totalWorkMinutes; }
    public void setTotalWorkMinutes(Integer totalWorkMinutes) { this.totalWorkMinutes = totalWorkMinutes; }

    public Integer getTotalBreakMinutes() { return totalBreakMinutes; }
    public void setTotalBreakMinutes(Integer totalBreakMinutes) { this.totalBreakMinutes = totalBreakMinutes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getIsLate() { return isLate; }
    public void setIsLate(Boolean isLate) { this.isLate = isLate; }

    public Integer getLateMinutes() { return lateMinutes; }
    public void setLateMinutes(Integer lateMinutes) { this.lateMinutes = lateMinutes; }

    public Boolean getIsEarlyLogout() { return isEarlyLogout; }
    public void setIsEarlyLogout(Boolean isEarlyLogout) { this.isEarlyLogout = isEarlyLogout; }

    public Integer getEarlyLogoutMinutes() { return earlyLogoutMinutes; }
    public void setEarlyLogoutMinutes(Integer earlyLogoutMinutes) { this.earlyLogoutMinutes = earlyLogoutMinutes; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
