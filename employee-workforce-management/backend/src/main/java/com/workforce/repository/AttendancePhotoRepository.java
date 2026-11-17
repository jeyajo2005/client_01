package com.workforce.repository;

import com.workforce.entity.AttendancePhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendancePhotoRepository extends JpaRepository<AttendancePhoto, Long> {
    List<AttendancePhoto> findByAttendanceId(Long attendanceId);
    Optional<AttendancePhoto> findByAttendanceIdAndPhotoType(Long attendanceId, String photoType);
}
