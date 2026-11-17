# WorkforcePro – Enterprise Employee Workforce Management System

A complete, modern, production-grade Employee Workforce Management platform built with **React.js + Vite + Tailwind CSS** frontend, **Java Spring Boot 3 + Spring Security + JWT** backend, and **MySQL 8.0** database with multi-tenant company isolation.

---

## 1. System Features & Highlights

- **Multi-Tenant Architecture:** Multi-company support isolated strictly via `company_id`.
- **Role-Based Access Control (RBAC):**
  - **Super Admin:** Platform oversight, multi-company statistics, system health.
  - **Company Admin:** Executive dashboards, department setup, geofences, dress code rules, shifts, company analytics.
  - **HR Manager:** Employee onboarding (automatic ID generation), attendance master log, leave approvals, shift change review, attendance correction.
  - **Employee:** Daily punch portal, live camera selfie capture, GPS office radius verification, daily dress code picker, breaks stopwatch, shift schedule, leave applications.
- **GPS Location Geofencing:**
  - Client transparently captures GPS coordinates.
  - Backend uses the **Haversine formula** to calculate distance in meters against designated office geofences.
  - Verifies employee is within allowed office radius (e.g. 250m) before marking verified check-in.
  - Never executes covert continuous tracking.
- **Biometric Selfie Attendance:**
  - Live camera stream via WebRTC `navigator.mediaDevices.getUserMedia`.
  - Capture selfie during check-in and checkout.
  - Admin & HR can audit employee selfies with full timestamps and GPS tags via the "Audit Selfie" modal.
- **Dress Code Management:**
  - Weekly dress code themes (e.g., Monday: Navy Blue, Tuesday: Crisp White, Wednesday: Sky Blue, Thursday: Charcoal Grey, Friday: Casual Denim).
  - Daily employee dress selection with color swatches.
  - AI compliance verification simulation scoring match accuracy.
- **Shift & Working Hours Management:**
  - Morning, Afternoon, Night, and Custom shifts.
  - Configurable grace period (e.g., 15 minutes before flagged late).
  - Shift change requests with HR review queue.
  - Working hours and break duration calculations.
- **Break Session Logger:**
  - Real-time work stopwatch.
  - Break types: Tea/Coffee Break (15m), Lunch Break (45m), Client Meeting, Personal Pause.
  - Automatic deduction from net work minutes.

---

## 2. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti, React Router DOM |
| **Backend** | Java 17, Spring Boot 3.3.4, Spring Security 6, Spring Data JPA, JJWT 0.12.5 |
| **Database** | MySQL 8.0 (InnoDB, Normalized 3NF, Foreign Keys, Indexes) |
| **Documentation** | Swagger / OpenAPI 3.0 UI (`/swagger-ui.html`) |

---

## 3. Demo Credentials (Ready to Test)

Default password for all demo accounts: `Admin@123`

| Role | Email / Employee ID | Name | Company |
|---|---|---|---|
| **Super Admin** | `superadmin@workforce.com` (`SUPER-001`) | Alexander Vance | Platform Oversight |
| **Company Admin** | `admin@techcorp.com` (`ADM-1001`) | Elena Rostova | TechCorp Solutions |
| **HR Manager** | `hr@techcorp.com` (`HR-1001`) | Marcus Sterling | TechCorp Solutions |
| **Employee 1** | `john.doe@techcorp.com` (`EMP-1001`) | John Doe | TechCorp Solutions |
| **Employee 2** | `sarah.c@techcorp.com` (`EMP-1002`) | Sarah Connor | TechCorp Solutions |

> **Tip:** You can also use the **Quick Demo Switcher** in the top navigation bar or the login screen to toggle between any role instantly with 1-click!

---

## 4. Quick Start & Execution Guide

### 4.1 Frontend Setup & Startup (React + Vite)
```bash
# Navigate to frontend folder
cd frontend

# Dependencies are already installed! Start the development server:
npm run dev
```
Open **`http://localhost:5173`** in your browser.

To verify a production build:
```bash
npm run build
```

---

### 4.2 Backend Setup & Startup (Java Spring Boot)
Ensure MySQL is running on `localhost:3306` with database `workforce_management_db`.

1. **Import Database Schema & Seeds:**
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed_data.sql
```
*(Or let Spring Boot JPA auto-create tables and auto-seed via `DataInitializer.java` on first boot).*

2. **Configure `application.properties` (if needed):**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/workforce_management_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
```

3. **Run Spring Boot Application:**
```bash
# Using Maven:
mvn clean spring-boot:run

# Or compile and run using JDK 17:
java -jar target/employee-workforce-management-1.0.0-SNAPSHOT.jar
```
The REST API will be available at **`http://localhost:8080/api`**  
The interactive Swagger API docs will be at **`http://localhost:8080/swagger-ui.html`**

---

## 5. Project Directory Structure

```
employee-workforce-management/
├── backend/
│   ├── pom.xml                                   # Maven dependencies & build configuration
│   └── src/main/
│       ├── java/com/workforce/
│       │   ├── WorkforceApplication.java         # Spring Boot main class
│       │   ├── config/                           # SecurityConfig, WebConfig, OpenApiConfig, DataInitializer
│       │   ├── controller/                       # Auth, Attendance, Employee, Shift, Dress, Location, Report, Leave
│       │   ├── dto/                              # Request/Response models & validation
│       │   ├── entity/                           # JPA Entities for all MySQL tables
│       │   ├── exception/                        # GlobalExceptionHandler, Custom exceptions
│       │   ├── repository/                       # 16 Spring Data JPA Repositories
│       │   ├── security/                         # JWT TokenProvider, JwtFilter, CustomUserDetailsService
│       │   └── service/                          # Business logic, Haversine formula, Biometrics
│       └── resources/
│           └── application.properties            # MySQL, JWT, Multipart file upload configs
├── frontend/
│   ├── package.json                              # React, Vite, Tailwind CSS, Lucide
│   ├── vite.config.js                            # Dev proxy to backend port 8080
│   ├── tailwind.config.js                        # Navy blue & Light blue color palette
│   ├── index.html                                # HTML5 shell with Inter typography
│   └── src/
│       ├── App.jsx                               # Role-based protected routes
│       ├── main.jsx                              # Entry point
│       ├── index.css                             # Tailwind styling and custom scrollbars
│       ├── context/                              # AuthContext with 1-click role switcher
│       ├── services/                             # api.js REST client with offline fallback engine
│       ├── utils/                                # constants.js (Demo users, Geofences, Colors)
│       ├── components/
│       │   ├── layout/                           # Navbar, Sidebar, AppLayout
│       │   ├── attendance/                       # LiveCameraModal, GeolocationCard, DressCodeCard, BreakWidget, SelfieReviewModal
│       │   └── common/                           # StatCard
│       └── pages/                                # Login, AdminDashboard, EmployeeDashboard, EmployeeManagement,
│                                                 # AttendanceManagement, ShiftManagement, DressCodeManagement,
│                                                 # LocationManagement, LeaveManagement, Reports, Profile
├── database/
│   ├── schema.sql                                # 17 normalized MySQL tables with constraints and indexes
│   └── seed_data.sql                             # Pre-populated demo companies, users, shifts, and check-ins
├── documentation/
│   ├── API_Documentation.md                      # Comprehensive REST API endpoint reference
│   └── Database_Documentation.md                 # Mermaid ERD and database schema breakdown
└── uploads/
    └── selfies/                                  # Stored check-in and check-out photos
```

---

## 6. Security & Privacy Guarantees

1. **Password Protection:** Encrypted using industry-standard **BCrypt** hashing.
2. **GPS Geofence Privacy:** Browser Geolocation is invoked strictly upon check-in or checkout action. Covert continuous location tracking is explicitly prohibited.
3. **Transparent Camera Consent:** WebRTC camera access requires user consent; employees review their selfie before confirming submission.
4. **Tenant Isolation:** Multi-company records are isolated through `company_id` filters across all JPA repositories.
5. **Audit Logging:** Check-ins, overrides, shift modifications, and approvals are stored in `audit_logs` with actor details, timestamps, and IP addresses.
