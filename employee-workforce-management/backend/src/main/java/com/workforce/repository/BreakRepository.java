package com.workforce.repository;

import com.workforce.entity.BreakSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BreakRepository extends JpaRepository<BreakSession, Long> {
    List<BreakSession> findByAttendanceId(Long attendanceId);
    Optional<BreakSession> findByEmployeeIdAndEndTimeIsNull(Long employeeId);
}
