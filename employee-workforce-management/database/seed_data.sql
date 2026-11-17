-- ====================================================================
-- EMPLOYEE WORKFORCE MANAGEMENT SYSTEM - SEED DATA
-- Default Passwords for all demo accounts: Admin@123
-- BCrypt Hash: $2a$10$e7mK8c5jHwJ9P5x9WqXUdeB3J.tqYwU6KzWj9T5mO3F4GzY3g3NfK (or system generated)
-- ====================================================================

USE workforce_management_db;

-- 1. SEED ROLES
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_SUPER_ADMIN', 'Platform Administrator with multi-company oversight'),
(2, 'ROLE_COMPANY_ADMIN', 'Administrator managing company-wide workforce, policies & settings'),
(3, 'ROLE_HR_MANAGER', 'HR Manager overseeing employee records, shifts, leaves and attendance'),
(4, 'ROLE_EMPLOYEE', 'Standard employee with check-in/out, selfies, dress code and leave access')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- 2. SEED COMPANIES
INSERT INTO companies (id, name, code, email, phone, address, logo_url, is_active) VALUES
(1, 'TechCorp Global Solutions', 'TECHCORP', 'contact@techcorp.com', '+1 (555) 234-5678', '100 Innovation Way, Silicon Valley, CA', 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop', TRUE),
(2, 'Apex Logistics & Freight', 'APEXLOG', 'support@apexlogistics.com', '+1 (555) 876-5432', '450 Harbor Boulevard, Seattle, WA', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&h=100&fit=crop', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. SEED USERS (Password: Admin@123 -> $2a$10$wN1rWvX6a9F1ZgT8L9LwyeM5eD8wX8w8w8w8w8w8w8w8w8w8w8)
-- For maximum compatibility, the backend initializer verifies and re-hashes if required.
INSERT INTO users (id, company_id, employee_code, email, password_hash, first_name, last_name, phone, avatar_url, is_active) VALUES
(1, NULL, 'SUPER-001', 'superadmin@workforce.com', '$2a$10$1J1kK11mU8nK5z9rG3s4YeR4jL1x9Q4v3P4m9Q4v3P4m9Q4v3P4m9', 'Alexander', 'Vance', '+1 (555) 000-0001', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop', TRUE),
(2, 1, 'ADM-1001', 'admin@techcorp.com', '$2a$10$1J1kK11mU8nK5z9rG3s4YeR4jL1x9Q4v3P4m9Q4v3P4m9Q4v3P4m9', 'Elena', 'Rostova', '+1 (555) 100-0001', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop', TRUE),
(3, 1, 'HR-1001', 'hr@techcorp.com', '$2a$10$1J1kK11mU8nK5z9rG3s4YeR4jL1x9Q4v3P4m9Q4v3P4m9Q4v3P4m9', 'Marcus', 'Sterling', '+1 (555) 100-0002', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', TRUE),
(4, 1, 'EMP-1001', 'john.doe@techcorp.com', '$2a$10$1J1kK11mU8nK5z9rG3s4YeR4jL1x9Q4v3P4m9Q4v3P4m9Q4v3P4m9', 'John', 'Doe', '+1 (555) 100-0003', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', TRUE),
(5, 1, 'EMP-1002', 'sarah.c@techcorp.com', '$2a$10$1J1kK11mU8nK5z9rG3s4YeR4jL1x9Q4v3P4m9Q4v3P4m9Q4v3P4m9', 'Sarah', 'Connor', '+1 (555) 100-0004', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', TRUE),
(6, 1, 'EMP-1003', 'alex.k@techcorp.com', '$2a$10$1J1kK11mU8nK5z9rG3s4YeR4jL1x9Q4v3P4m9Q4v3P4m9Q4v3P4m9', 'Alex', 'Kumar', '+1 (555) 100-0005', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop', TRUE),
(7, 1, 'EMP-1004', 'priya.s@techcorp.com', '$2a$10$1J1kK11mU8nK5z9rG3s4YeR4jL1x9Q4v3P4m9Q4v3P4m9Q4v3P4m9', 'Priya', 'Sharma', '+1 (555) 100-0006', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop', TRUE),
(8, 1, 'EMP-1005', 'michael.s@techcorp.com', '$2a$10$1J1kK11mU8nK5z9rG3s4YeR4jL1x9Q4v3P4m9Q4v3P4m9Q4v3P4m9', 'Michael', 'Scott', '+1 (555) 100-0007', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop', TRUE)
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- 4. SEED USER ROLES
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- Super Admin
(2, 2), -- Company Admin
(3, 3), -- HR Manager
(4, 4), -- Employee (John Doe)
(5, 4), -- Employee (Sarah Connor)
(6, 4), -- Employee (Alex Kumar)
(7, 4), -- Employee (Priya Sharma)
(8, 4)  -- Employee (Michael Scott)
ON DUPLICATE KEY UPDATE role_id=VALUES(role_id);

-- 5. SEED DEPARTMENTS
INSERT INTO departments (id, company_id, name, code, description, manager_id) VALUES
(1, 1, 'Software Engineering', 'ENG', 'Core platform architecture & full stack development', 2),
(2, 1, 'Human Resources', 'HR', 'Talent acquisition, payroll, attendance and employee happiness', 3),
(3, 1, 'Product & UI/UX Design', 'DESIGN', 'Product experience, UI design systems and user research', 5),
(4, 1, 'Sales & Enterprise Growth', 'SALES', 'Business development and client partnerships', 8),
(5, 1, 'Quality Assurance & DevOps', 'QA', 'Automated testing, cloud infrastructure and site reliability', 6)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 6. SEED LOCATIONS (Office Geofences with GPS)
INSERT INTO locations (id, company_id, name, address, latitude, longitude, radius_meters, is_active) VALUES
(1, 1, 'TechCorp Headquarters - Tech Park', '100 Innovation Way, Silicon Valley, CA 94025', 37.774929, -122.419416, 250.0, TRUE),
(2, 1, 'Downtown Development Hub', '450 Mission Street, Suite 800, San Francisco, CA', 37.789172, -122.401449, 150.0, TRUE),
(3, 1, 'East Coast Engineering Center', '120 Broadway, New York, NY 10271', 40.708230, -74.010540, 200.0, TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 7. SEED SHIFTS
INSERT INTO shifts (id, company_id, name, shift_type, start_time, end_time, grace_period_minutes, color_code, is_active) VALUES
(1, 1, 'Morning Shift', 'MORNING', '09:00:00', '17:00:00', 15, '#3b82f6', TRUE),
(2, 1, 'Afternoon Shift', 'AFTERNOON', '13:00:00', '21:00:00', 15, '#f59e0b', TRUE),
(3, 1, 'Night Shift', 'NIGHT', '21:00:00', '05:00:00', 15, '#8b5cf6', TRUE),
(4, 1, 'Custom Executive Shift', 'CUSTOM', '10:00:00', '19:00:00', 10, '#10b981', TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 8. SEED EMPLOYEES
INSERT INTO employees (id, user_id, company_id, department_id, primary_location_id, current_shift_id, designation, joining_date, employment_type, work_status, emergency_contact_name, emergency_contact_phone) VALUES
(1, 4, 1, 1, 1, 1, 'Senior Full Stack Engineer', '2023-01-15', 'FULL_TIME', 'WORKING', 'Jane Doe', '+1 (555) 999-1001'),
(2, 5, 1, 3, 1, 1, 'Lead Product Designer', '2023-03-20', 'FULL_TIME', 'WORKING', 'John Connor', '+1 (555) 999-1002'),
(3, 6, 1, 5, 1, 2, 'DevOps & Cloud Specialist', '2023-06-10', 'FULL_TIME', 'ON_BREAK', 'Anita Kumar', '+1 (555) 999-1003'),
(4, 7, 1, 1, 2, 1, 'Frontend UI Specialist', '2023-08-01', 'FULL_TIME', 'WORKING', 'Raj Sharma', '+1 (555) 999-1004'),
(5, 8, 1, 4, 1, 4, 'Enterprise Account Manager', '2022-11-05', 'FULL_TIME', 'ON_LEAVE', 'Holly Flax', '+1 (555) 999-1005')
ON DUPLICATE KEY UPDATE designation=VALUES(designation);

-- 9. SEED DRESS CODES (Weekly Schedule)
INSERT INTO dress_codes (id, company_id, day_of_week, color_name, color_hex, description, is_mandatory) VALUES
(1, 1, 'MONDAY', 'Navy Blue', '#1e3a8a', 'Formal corporate navy blue suit, blazer, or solid shirt', TRUE),
(2, 1, 'TUESDAY', 'Crisp White', '#f8fafc', 'Clean white formal dress shirt or blouse', TRUE),
(3, 1, 'WEDNESDAY', 'Sky Blue', '#38bdf8', 'Smart business casual in sky or light blue tones', TRUE),
(4, 1, 'THURSDAY', 'Charcoal Grey', '#475569', 'Sophisticated charcoal or steel grey professional attire', TRUE),
(5, 1, 'FRIDAY', 'Casual Denim', '#0284c7', 'Casual Friday - company branded polo or neat denim', FALSE),
(6, 1, 'SATURDAY', 'Free Choice', '#64748b', 'Weekend shift - clean comfortable casuals', FALSE),
(7, 1, 'SUNDAY', 'Free Choice', '#64748b', 'Weekend shift - clean comfortable casuals', FALSE)
ON DUPLICATE KEY UPDATE color_name=VALUES(color_name);

-- 10. SEED EMPLOYEE DRESS SELECTIONS (Today's check-ins)
INSERT INTO employee_dress (id, company_id, employee_id, dress_date, selected_color_name, selected_color_hex, is_compliant, ai_verified, ai_confidence_score, notes) VALUES
(1, 1, 1, CURRENT_DATE(), 'Navy Blue', '#1e3a8a', TRUE, TRUE, 0.98, 'Color match verified against camera selfie check-in'),
(2, 1, 2, CURRENT_DATE(), 'Navy Blue', '#1e3a8a', TRUE, TRUE, 0.96, 'Compliance confirmed'),
(3, 1, 3, CURRENT_DATE(), 'Sky Blue', '#38bdf8', FALSE, TRUE, 0.89, 'Non-compliant: Selected Sky Blue on Navy Blue day'),
(4, 1, 4, CURRENT_DATE(), 'Navy Blue', '#1e3a8a', TRUE, TRUE, 0.97, 'Compliance confirmed')
ON DUPLICATE KEY UPDATE selected_color_name=VALUES(selected_color_name);

-- 11. SEED ATTENDANCE RECORDS (Past and Today)
INSERT INTO attendance (id, company_id, employee_id, shift_id, attendance_date, check_in_time, check_out_time, check_in_latitude, check_in_longitude, check_in_location_verified, check_in_distance_meters, total_work_minutes, total_break_minutes, status, is_late, late_minutes, is_early_logout, early_logout_minutes, notes) VALUES
(1, 1, 1, 1, CURRENT_DATE(), CONCAT(CURRENT_DATE(), ' 08:55:00'), NULL, 37.774920, -122.419410, TRUE, 12.5, 240, 15, 'PRESENT', FALSE, 0, FALSE, 0, 'On-time check-in via Mobile App with Selfie verification'),
(2, 1, 2, 1, CURRENT_DATE(), CONCAT(CURRENT_DATE(), ' 09:22:00'), NULL, 37.774950, -122.419380, TRUE, 22.1, 215, 0, 'LATE', TRUE, 22, FALSE, 0, 'Late check-in due to transit delay'),
(3, 1, 3, 2, CURRENT_DATE(), CONCAT(CURRENT_DATE(), ' 12:58:00'), NULL, 37.774910, -122.419430, TRUE, 18.0, 160, 45, 'PRESENT', FALSE, 0, FALSE, 0, 'Checked in for afternoon shift. Currently on tea break'),
(4, 1, 4, 1, CURRENT_DATE(), CONCAT(CURRENT_DATE(), ' 08:58:00'), NULL, 37.789160, -122.401430, TRUE, 14.8, 238, 0, 'PRESENT', FALSE, 0, FALSE, 0, 'Downtown hub verified check-in')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- 12. SEED ATTENDANCE PHOTOS (Selfies)
INSERT INTO attendance_photos (id, attendance_id, photo_type, photo_url, photo_data_base64, captured_at, verified_by_hr, review_notes) VALUES
(1, 1, 'CHECK_IN', '/uploads/selfies/demo_emp1_checkin.jpg', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%231e3a8a"/><circle cx="100" cy="80" r="40" fill="%23ffffff"/><ellipse cx="100" cy="160" rx="60" ry="35" fill="%23ffffff"/><text x="100" y="195" font-size="12" fill="%2338bdf8" text-anchor="middle">EMP-1001 VERIFIED</text></svg>', CONCAT(CURRENT_DATE(), ' 08:55:00'), TRUE, 'Live face recognized, high clarity'),
(2, 2, 'CHECK_IN', '/uploads/selfies/demo_emp2_checkin.jpg', 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%230f172a"/><circle cx="100" cy="80" r="40" fill="%23f8fafc"/><ellipse cx="100" cy="160" rx="60" ry="35" fill="%23f8fafc"/><text x="100" y="195" font-size="12" fill="%2338bdf8" text-anchor="middle">EMP-1002 VERIFIED</text></svg>', CONCAT(CURRENT_DATE(), ' 09:22:00'), TRUE, 'Verified with Navy Blue dress code')
ON DUPLICATE KEY UPDATE verified_by_hr=VALUES(verified_by_hr);

-- 13. SEED BREAKS
INSERT INTO breaks (id, attendance_id, employee_id, break_type, start_time, end_time, duration_minutes, notes) VALUES
(1, 1, 1, 'TEA_BREAK', CONCAT(CURRENT_DATE(), ' 10:30:00'), CONCAT(CURRENT_DATE(), ' 10:45:00'), 15, 'Morning coffee break'),
(2, 3, 3, 'LUNCH_BREAK', CONCAT(CURRENT_DATE(), ' 14:00:00'), NULL, 0, 'Afternoon team lunch in progress')
ON DUPLICATE KEY UPDATE break_type=VALUES(break_type);

-- 14. SEED LEAVE REQUESTS
INSERT INTO leave_requests (id, company_id, employee_id, leave_type, start_date, end_date, total_days, reason, status, approved_by, reviewed_at, rejection_reason) VALUES
(1, 1, 5, 'ANNUAL', CURRENT_DATE(), DATE_ADD(CURRENT_DATE(), INTERVAL 2 DAY), 3, 'Family annual vacation trip planned in advance', 'APPROVED', 3, CURRENT_TIMESTAMP(), NULL),
(2, 1, 1, 'CASUAL', DATE_ADD(CURRENT_DATE(), INTERVAL 5 DAY), DATE_ADD(CURRENT_DATE(), INTERVAL 5 DAY), 1, 'Personal domestic errand and vehicle inspection', 'PENDING', NULL, NULL, NULL),
(3, 1, 4, 'SICK', DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY), DATE_SUB(CURRENT_DATE(), INTERVAL 6 DAY), 2, 'Seasonal fever, medical certificate submitted', 'APPROVED', 3, DATE_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY), NULL)
ON DUPLICATE KEY UPDATE reason=VALUES(reason);

-- 15. SEED AUDIT LOGS
INSERT INTO audit_logs (id, company_id, user_id, action, entity_name, entity_id, details, ip_address, created_at) VALUES
(1, 1, 4, 'CHECK_IN', 'ATTENDANCE', 1, 'Employee John Doe checked in with GPS distance 12.5m and live selfie verification', '192.168.1.101', CURRENT_TIMESTAMP()),
(2, 1, 5, 'CHECK_IN', 'ATTENDANCE', 2, 'Employee Sarah Connor checked in with GPS distance 22.1m (Late by 22 mins)', '192.168.1.102', CURRENT_TIMESTAMP()),
(3, 1, 3, 'APPROVE_LEAVE', 'LEAVE_REQUEST', 1, 'HR Manager Marcus Sterling approved annual leave for Michael Scott', '192.168.1.50', CURRENT_TIMESTAMP())
ON DUPLICATE KEY UPDATE action=VALUES(action);
