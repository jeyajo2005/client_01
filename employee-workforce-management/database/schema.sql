-- ====================================================================
-- EMPLOYEE WORKFORCE MANAGEMENT SYSTEM - DATABASE SCHEMA
-- Target Database: MySQL 8.0+
-- Multi-Tenant: Tenant isolation using `company_id`
-- ====================================================================

CREATE DATABASE IF NOT EXISTS workforce_management_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE workforce_management_db;

-- 1. COMPANIES TABLE (Multi-Tenancy Root)
CREATE TABLE IF NOT EXISTS companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    address VARCHAR(255),
    logo_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_company_code (code),
    INDEX idx_company_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. ROLES TABLE
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. USERS TABLE (Authentication & Base Profile)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NULL,
    employee_code VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    avatar_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_user_company (company_id),
    INDEX idx_user_email (email),
    INDEX idx_user_emp_code (employee_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. USER_ROLES JUNCTION TABLE
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(30) NOT NULL,
    description VARCHAR(255),
    manager_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY uq_dept_company_code (company_id, code),
    INDEX idx_dept_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. LOCATIONS (Office Geofences for GPS Verification)
CREATE TABLE IF NOT EXISTS locations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    radius_meters DOUBLE NOT NULL DEFAULT 200.0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_location_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. SHIFTS TABLE
CREATE TABLE IF NOT EXISTS shifts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    shift_type VARCHAR(30) NOT NULL DEFAULT 'MORNING', -- MORNING, AFTERNOON, NIGHT, CUSTOM
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    grace_period_minutes INT NOT NULL DEFAULT 15,
    color_code VARCHAR(20) DEFAULT '#3b82f6',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_shift_company (company_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. EMPLOYEES TABLE (Detailed workforce profile)
CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    company_id BIGINT NOT NULL,
    department_id BIGINT NULL,
    primary_location_id BIGINT NULL,
    current_shift_id BIGINT NULL,
    designation VARCHAR(100) NOT NULL,
    joining_date DATE NOT NULL,
    employment_type VARCHAR(30) NOT NULL DEFAULT 'FULL_TIME', -- FULL_TIME, PART_TIME, CONTRACT
    work_status VARCHAR(30) NOT NULL DEFAULT 'OFFLINE', -- WORKING, ON_BREAK, COMPLETED, ON_LEAVE, OFFLINE
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY (primary_location_id) REFERENCES locations(id) ON DELETE SET NULL,
    FOREIGN KEY (current_shift_id) REFERENCES shifts(id) ON DELETE SET NULL,
    INDEX idx_emp_company (company_id),
    INDEX idx_emp_dept (department_id),
    INDEX idx_emp_status (work_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. EMPLOYEE_SHIFTS (Shift history & assignments)
CREATE TABLE IF NOT EXISTS employee_shifts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    shift_id BIGINT NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
    INDEX idx_emp_shift (employee_id, shift_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. ATTENDANCE TABLE (Daily Check-in & Check-out records)
CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    shift_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    check_in_time DATETIME NOT NULL,
    check_out_time DATETIME NULL,
    check_in_latitude DECIMAL(10, 8),
    check_in_longitude DECIMAL(11, 8),
    check_in_location_verified BOOLEAN DEFAULT FALSE,
    check_in_distance_meters DOUBLE DEFAULT 0.0,
    check_out_latitude DECIMAL(10, 8),
    check_out_longitude DECIMAL(11, 8),
    check_out_location_verified BOOLEAN DEFAULT FALSE,
    check_out_distance_meters DOUBLE DEFAULT 0.0,
    total_work_minutes INT DEFAULT 0,
    total_break_minutes INT DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'PRESENT', -- PRESENT, LATE, HALF_DAY, ABSENT
    is_late BOOLEAN DEFAULT FALSE,
    late_minutes INT DEFAULT 0,
    is_early_logout BOOLEAN DEFAULT FALSE,
    early_logout_minutes INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
    UNIQUE KEY uq_emp_attendance_date (employee_id, attendance_date),
    INDEX idx_att_company_date (company_id, attendance_date),
    INDEX idx_att_emp_date (employee_id, attendance_date),
    INDEX idx_att_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. ATTENDANCE_PHOTOS (Selfies for live verification)
CREATE TABLE IF NOT EXISTS attendance_photos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    attendance_id BIGINT NOT NULL,
    photo_type VARCHAR(20) NOT NULL, -- CHECK_IN, CHECK_OUT
    photo_url VARCHAR(500),
    photo_data_base64 LONGTEXT,
    captured_at DATETIME NOT NULL,
    verified_by_hr BOOLEAN DEFAULT TRUE,
    review_notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attendance_id) REFERENCES attendance(id) ON DELETE CASCADE,
    INDEX idx_photo_att (attendance_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. DRESS_CODES (Company weekly dress code policy)
CREATE TABLE IF NOT EXISTS dress_codes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    day_of_week VARCHAR(20) NOT NULL, -- MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
    color_name VARCHAR(50) NOT NULL,
    color_hex VARCHAR(20) NOT NULL,
    description VARCHAR(255),
    is_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY uq_company_day_dress (company_id, day_of_week)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. EMPLOYEE_DRESS (Daily employee dress selection & verification)
CREATE TABLE IF NOT EXISTS employee_dress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    dress_date DATE NOT NULL,
    selected_color_name VARCHAR(50) NOT NULL,
    selected_color_hex VARCHAR(20) NOT NULL,
    is_compliant BOOLEAN DEFAULT TRUE,
    ai_verified BOOLEAN DEFAULT FALSE,
    ai_confidence_score DOUBLE DEFAULT 0.95,
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY uq_emp_dress_date (employee_id, dress_date),
    INDEX idx_emp_dress (employee_id, dress_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. BREAKS (Employee break sessions)
CREATE TABLE IF NOT EXISTS breaks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    attendance_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    break_type VARCHAR(30) NOT NULL, -- TEA_BREAK, LUNCH_BREAK, MEETING, PERSONAL
    start_time DATETIME NOT NULL,
    end_time DATETIME NULL,
    duration_minutes INT DEFAULT 0,
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attendance_id) REFERENCES attendance(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    INDEX idx_break_attendance (attendance_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. LEAVE_REQUESTS (Leave workflow)
CREATE TABLE IF NOT EXISTS leave_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    leave_type VARCHAR(30) NOT NULL, -- SICK, CASUAL, ANNUAL, UNPAID, MATERNITY
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL DEFAULT 1,
    reason TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    approved_by BIGINT NULL,
    reviewed_at DATETIME NULL,
    rejection_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_leave_company_status (company_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. SHIFT_CHANGE_REQUESTS
CREATE TABLE IF NOT EXISTS shift_change_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    current_shift_id BIGINT NOT NULL,
    requested_shift_id BIGINT NOT NULL,
    effective_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    reviewed_by BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (current_shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. AUDIT_LOGS (Security & Audit Trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NULL,
    user_id BIGINT NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id BIGINT,
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_company (company_id),
    INDEX idx_audit_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
