package com.workforce.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_photos")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class AttendancePhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attendance_id", nullable = false)
    private Attendance attendance;

    @Column(name = "photo_type", nullable = false, length = 20)
    private String photoType = "CHECK_IN"; // CHECK_IN, CHECK_OUT

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "photo_data_base64", columnDefinition = "LONGTEXT")
    private String photoDataBase64;

    @Column(name = "captured_at", nullable = false)
    private LocalDateTime capturedAt = LocalDateTime.now();

    @Column(name = "verified_by_hr")
    private Boolean verifiedByHr = true;

    @Column(name = "review_notes", length = 255)
    private String reviewNotes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public AttendancePhoto() {}

    public AttendancePhoto(Attendance attendance, String photoType, String photoUrl, String photoDataBase64, LocalDateTime capturedAt) {
        this.attendance = attendance;
        this.photoType = photoType;
        this.photoUrl = photoUrl;
        this.photoDataBase64 = photoDataBase64;
        this.capturedAt = capturedAt != null ? capturedAt : LocalDateTime.now();
        this.verifiedByHr = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Attendance getAttendance() { return attendance; }
    public void setAttendance(Attendance attendance) { this.attendance = attendance; }

    public String getPhotoType() { return photoType; }
    public void setPhotoType(String photoType) { this.photoType = photoType; }

    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    public String getPhotoDataBase64() { return photoDataBase64; }
    public void setPhotoDataBase64(String photoDataBase64) { this.photoDataBase64 = photoDataBase64; }

    public LocalDateTime getCapturedAt() { return capturedAt; }
    public void setCapturedAt(LocalDateTime capturedAt) { this.capturedAt = capturedAt; }

    public Boolean getVerifiedByHr() { return verifiedByHr; }
    public void setVerifiedByHr(Boolean verifiedByHr) { this.verifiedByHr = verifiedByHr; }

    public String getReviewNotes() { return reviewNotes; }
    public void setReviewNotes(String reviewNotes) { this.reviewNotes = reviewNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
