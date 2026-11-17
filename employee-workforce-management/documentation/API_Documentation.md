# Employee Workforce Management System – REST API Documentation

**Base URL:** `http://localhost:8080/api`  
**Swagger UI:** `http://localhost:8080/swagger-ui.html`  
**OpenAPI Spec:** `http://localhost:8080/api-docs`  
**Authentication:** JWT Bearer Token in `Authorization: Bearer <TOKEN>` header

---

## 1. Authentication Endpoints

### 1.1 User Login
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public
- **Request Body:**
```json
{
  "username": "admin@techcorp.com",
  "password": "Admin@123"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
    "tokenType": "Bearer",
    "userId": 2,
    "employeeId": 1,
    "companyId": 1,
    "companyName": "TechCorp Global Solutions",
    "employeeCode": "ADM-1001",
    "email": "admin@techcorp.com",
    "fullName": "Elena Rostova",
    "roles": ["ROLE_COMPANY_ADMIN"],
    "workStatus": "WORKING"
  }
}
```

### 1.2 Current User Profile
- **Endpoint:** `GET /api/auth/me`
- **Access:** Authenticated (`Bearer <token>`)

---

## 2. Attendance Management Endpoints

### 2.1 Employee Check-In (GPS & Selfie Verification)
- **Endpoint:** `POST /api/attendance/check-in`
- **Access:** `ROLE_EMPLOYEE`
- **Request Body:**
```json
{
  "employeeId": 1,
  "latitude": 37.774929,
  "longitude": -122.419416,
  "selfieBase64": "data:image/jpeg;base64,...",
  "dressColorName": "Navy Blue",
  "dressColorHex": "#1e3a8a",
  "notes": "Morning check-in from main lobby"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Checked in successfully",
  "data": {
    "id": 14,
    "attendanceDate": "2026-11-13",
    "checkInTime": "2026-11-13T08:55:12",
    "checkInLatitude": 37.774929,
    "checkInLongitude": -122.419416,
    "checkInLocationVerified": true,
    "checkInDistanceMeters": 14.2,
    "status": "PRESENT",
    "isLate": false,
    "lateMinutes": 0
  }
}
```

### 2.2 Employee Check-Out
- **Endpoint:** `POST /api/attendance/check-out`
- **Access:** `ROLE_EMPLOYEE`
- **Request Body:**
```json
{
  "employeeId": 1,
  "latitude": 37.774929,
  "longitude": -122.419416,
  "selfieBase64": "data:image/jpeg;base64,...",
  "notes": "Completed shift work"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "message": "Checked out successfully",
  "data": {
    "id": 14,
    "checkOutTime": "2026-11-13T17:02:44",
    "totalWorkMinutes": 472,
    "totalBreakMinutes": 15,
    "isEarlyLogout": false
  }
}
```

### 2.3 Start Break
- **Endpoint:** `POST /api/attendance/breaks/start`
- **Request Body:**
```json
{
  "employeeId": 1,
  "breakType": "TEA_BREAK",
  "notes": "Coffee break"
}
```

### 2.4 End Break
- **Endpoint:** `POST /api/attendance/breaks/end?employeeId=1`

### 2.5 View Company Attendance Logs
- **Endpoint:** `GET /api/attendance/company/{companyId}?startDate=2026-11-01&endDate=2026-11-13`
- **Access:** `ROLE_SUPER_ADMIN`, `ROLE_COMPANY_ADMIN`, `ROLE_HR_MANAGER`

### 2.6 View Attendance Selfie Audit
- **Endpoint:** `GET /api/attendance/{attendanceId}/photos`
- **Access:** `ROLE_SUPER_ADMIN`, `ROLE_COMPANY_ADMIN`, `ROLE_HR_MANAGER`

---

## 3. Employee Management Endpoints

### 3.1 List Company Employees
- **Endpoint:** `GET /api/employees/company/{companyId}`

### 3.2 Create New Employee
- **Endpoint:** `POST /api/employees/company/{companyId}`
- **Request Body:**
```json
{
  "firstName": "Alex",
  "lastName": "Vance",
  "email": "alex.v@techcorp.com",
  "phone": "+1 (555) 345-6789",
  "employeeCode": "EMP-1006",
  "password": "Employee@123",
  "departmentId": 1,
  "designation": "Backend Engineer",
  "shiftId": 1,
  "locationId": 1,
  "joiningDate": "2026-11-13",
  "employmentType": "FULL_TIME",
  "emergencyContactName": "Gordon Vance",
  "emergencyContactPhone": "+1 (555) 999-0000"
}
```

### 3.3 Update Employee
- **Endpoint:** `PUT /api/employees/{id}`

### 3.4 Delete Employee
- **Endpoint:** `DELETE /api/employees/{id}`

---

## 4. Shift Management Endpoints

### 4.1 List Shifts
- **Endpoint:** `GET /api/shifts/company/{companyId}`

### 4.2 Define Shift
- **Endpoint:** `POST /api/shifts/company/{companyId}`
- **Request Body:**
```json
{
  "name": "European Overlap Shift",
  "shiftType": "CUSTOM",
  "startTime": "11:00:00",
  "endTime": "19:00:00",
  "gracePeriodMinutes": 10,
  "colorCode": "#10b981",
  "isActive": true
}
```

### 4.3 Submit Shift Change Request
- **Endpoint:** `POST /api/shifts/requests`
- **Request Body:**
```json
{
  "employeeId": 1,
  "requestedShiftId": 2,
  "effectiveDate": "2026-11-20",
  "reason": "Family evening commitments"
}
```

### 4.4 Review Shift Change Request
- **Endpoint:** `POST /api/shifts/requests/{requestId}/review?approve=true`
- **Access:** `ROLE_HR_MANAGER`, `ROLE_COMPANY_ADMIN`

---

## 5. Dress Code Management Endpoints

### 5.1 Weekly Dress Schedule
- **Endpoint:** `GET /api/dress-codes/company/{companyId}`

### 5.2 Today's Required Dress Code
- **Endpoint:** `GET /api/dress-codes/today/{companyId}`

### 5.3 Select Daily Dress Color
- **Endpoint:** `POST /api/dress-codes/select`
- **Request Body:**
```json
{
  "employeeId": 1,
  "selectedColorName": "Navy Blue",
  "selectedColorHex": "#1e3a8a",
  "notes": "Wearing dark navy blue blazer"
}
```

---

## 6. Office Geofences (Locations)

### 6.1 List Geofences
- **Endpoint:** `GET /api/locations/company/{companyId}`

### 6.2 Add Geofence
- **Endpoint:** `POST /api/locations/company/{companyId}`
- **Request Body:**
```json
{
  "name": "Seattle Tech Hub",
  "address": "400 Pine Street, Seattle, WA",
  "latitude": 47.6101,
  "longitude": -122.3382,
  "radiusMeters": 250.0,
  "isActive": true
}
```

---

## 7. Leave Management Endpoints

### 7.1 Apply for Leave
- **Endpoint:** `POST /api/leaves/apply`
- **Request Body:**
```json
{
  "employeeId": 1,
  "leaveType": "ANNUAL",
  "startDate": "2026-11-25",
  "endDate": "2026-11-28",
  "reason": "Thanksgiving family gathering"
}
```

### 7.2 Review Leave
- **Endpoint:** `POST /api/leaves/{leaveId}/review?approve=true`
- **Access:** `ROLE_HR_MANAGER`, `ROLE_COMPANY_ADMIN`

---

## 8. Reports & Analytics

### 8.1 Dashboard Summary KPIs
- **Endpoint:** `GET /api/reports/dashboard/{companyId}`
- **Access:** `ROLE_SUPER_ADMIN`, `ROLE_COMPANY_ADMIN`, `ROLE_HR_MANAGER`
- **Response `200 OK`:**
```json
{
  "success": true,
  "data": {
    "totalEmployees": 5,
    "presentToday": 4,
    "absentToday": 1,
    "lateEmployees": 1,
    "employeesOnBreak": 1,
    "activeShifts": 4,
    "attendancePercentage": 80.0,
    "recentCheckIns": [...],
    "departmentStats": [...],
    "todayDressCode": {
      "colorName": "Navy Blue",
      "colorHex": "#1e3a8a",
      "description": "Corporate navy blue blazer or solid shirt",
      "isMandatory": true
    }
  }
}
```
