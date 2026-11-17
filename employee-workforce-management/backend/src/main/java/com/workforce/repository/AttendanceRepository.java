package com.workforce.repository;

import com.workforce.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByCompanyId(Long companyId);
    List<Attendance> findByCompanyIdAndAttendanceDate(Long companyId, LocalDate date);
    List<Attendance> findByEmployeeIdOrderByAttendanceDateDesc(Long employeeId);
    Optional<Attendance> findByEmployeeIdAndAttendanceDate(Long employeeId, LocalDate date);
    
    @Query("SELECT a FROM Attendance a WHERE a.company.id = :companyId AND a.attendanceDate BETWEEN :startDate AND :endDate ORDER BY a.attendanceDate DESC, a.checkInTime DESC")
    List<Attendance> findByCompanyIdAndDateRange(@Param("companyId") Long companyId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    long countByCompanyIdAndAttendanceDate(Long companyId, LocalDate date);
    long countByCompanyIdAndAttendanceDateAndIsLateTrue(Long companyId, LocalDate date);
    long countByCompanyIdAndAttendanceDateAndStatus(Long companyId, LocalDate date, String status);
}
