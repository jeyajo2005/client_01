package com.workforce.config;

import com.workforce.entity.*;
import com.workforce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private ShiftRepository shiftRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DressCodeRepository dressCodeRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private AttendancePhotoRepository attendancePhotoRepository;

    @Autowired
    private EmployeeDressRepository employeeDressRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Ensure all users have valid BCrypt hash for Admin@123
        String validAdminHash = passwordEncoder.encode("Admin@123");
        userRepository.findAll().forEach(u -> {
            if (u.getPassword() == null || !passwordEncoder.matches("Admin@123", u.getPassword())) {
                u.setPassword(validAdminHash);
                userRepository.save(u);
            }
        });

        if (roleRepository.count() > 0) {
            return; // Already initialized
        }

        System.out.println(">>> Initializing Workforce Management Database with Default Data...");

        // 1. Roles
        Role superAdminRole = roleRepository.save(new Role("ROLE_SUPER_ADMIN", "Platform Super Administrator"));
        Role adminRole = roleRepository.save(new Role("ROLE_COMPANY_ADMIN", "Company Administrator"));
        Role hrRole = roleRepository.save(new Role("ROLE_HR_MANAGER", "Human Resources Manager"));
        Role empRole = roleRepository.save(new Role("ROLE_EMPLOYEE", "Company Employee"));

        // 2. Companies
        Company techcorp = new Company("TechCorp Global Solutions", "TECHCORP", "contact@techcorp.com", "+1 (555) 234-5678", "100 Innovation Way, Silicon Valley, CA");
        techcorp.setLogoUrl("https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop");
        techcorp = companyRepository.save(techcorp);

        Company apexLog = new Company("Apex Logistics & Freight", "APEXLOG", "support@apexlogistics.com", "+1 (555) 876-5432", "450 Harbor Boulevard, Seattle, WA");
        apexLog = companyRepository.save(apexLog);

        String encodedPassword = passwordEncoder.encode("Admin@123");

        // 3. Users
        User superAdmin = new User("SUPER-001", "superadmin@workforce.com", encodedPassword, "Alexander", "Vance");
        superAdmin.setRoles(Set.of(superAdminRole));
        superAdmin.setPhone("+1 (555) 000-0001");
        superAdmin.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop");
        userRepository.save(superAdmin);

        User companyAdmin = new User("ADM-1001", "admin@techcorp.com", encodedPassword, "Elena", "Rostova");
        companyAdmin.setCompany(techcorp);
        companyAdmin.setRoles(Set.of(adminRole));
        companyAdmin.setPhone("+1 (555) 100-0001");
        companyAdmin.setAvatarUrl("https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop");
        userRepository.save(companyAdmin);

        User hrManager = new User("HR-1001", "hr@techcorp.com", encodedPassword, "Marcus", "Sterling");
        hrManager.setCompany(techcorp);
        hrManager.setRoles(Set.of(hrRole));
        hrManager.setPhone("+1 (555) 100-0002");
        hrManager.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop");
        userRepository.save(hrManager);

        User empUser1 = new User("EMP-1001", "john.doe@techcorp.com", encodedPassword, "John", "Doe");
        empUser1.setCompany(techcorp);
        empUser1.setRoles(Set.of(empRole));
        empUser1.setPhone("+1 (555) 100-0003");
        empUser1.setAvatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop");
        userRepository.save(empUser1);

        User empUser2 = new User("EMP-1002", "sarah.c@techcorp.com", encodedPassword, "Sarah", "Connor");
        empUser2.setCompany(techcorp);
        empUser2.setRoles(Set.of(empRole));
        empUser2.setPhone("+1 (555) 100-0004");
        empUser2.setAvatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop");
        userRepository.save(empUser2);

        User empUser3 = new User("EMP-1003", "alex.k@techcorp.com", encodedPassword, "Alex", "Kumar");
        empUser3.setCompany(techcorp);
        empUser3.setRoles(Set.of(empRole));
        empUser3.setPhone("+1 (555) 100-0005");
        empUser3.setAvatarUrl("https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop");
        userRepository.save(empUser3);

        // 4. Departments
        Department engDept = departmentRepository.save(new Department(techcorp, "Software Engineering", "ENG", "Core platform engineering"));
        Department hrDept = departmentRepository.save(new Department(techcorp, "Human Resources", "HR", "People and culture"));
        Department designDept = departmentRepository.save(new Department(techcorp, "Product Design", "DESIGN", "UX and UI systems"));

        // 5. Locations (Office Geofences)
        Location hqLocation = locationRepository.save(new Location(techcorp, "TechCorp Headquarters - Tech Park", "100 Innovation Way, Silicon Valley, CA 94025", 37.774929, -122.419416, 250.0));
        locationRepository.save(new Location(techcorp, "Downtown Development Hub", "450 Mission Street, Suite 800, San Francisco, CA", 37.789172, -122.401449, 150.0));

        // 6. Shifts
        Shift morningShift = shiftRepository.save(new Shift(techcorp, "Morning Shift", "MORNING", LocalTime.of(9, 0), LocalTime.of(17, 0), 15, "#3b82f6"));
        Shift afternoonShift = shiftRepository.save(new Shift(techcorp, "Afternoon Shift", "AFTERNOON", LocalTime.of(13, 0), LocalTime.of(21, 0), 15, "#f59e0b"));
        Shift nightShift = shiftRepository.save(new Shift(techcorp, "Night Shift", "NIGHT", LocalTime.of(21, 0), LocalTime.of(5, 0), 15, "#8b5cf6"));

        // 7. Employees
        Employee emp1 = new Employee(empUser1, techcorp, engDept, hqLocation, morningShift, "Senior Full Stack Engineer", LocalDate.of(2023, 1, 15));
        emp1.setWorkStatus("WORKING");
        emp1.setEmergencyContactName("Jane Doe");
        emp1.setEmergencyContactPhone("+1 (555) 999-1001");
        emp1 = employeeRepository.save(emp1);

        Employee emp2 = new Employee(empUser2, techcorp, designDept, hqLocation, morningShift, "Lead Product Designer", LocalDate.of(2023, 3, 20));
        emp2.setWorkStatus("WORKING");
        emp2 = employeeRepository.save(emp2);

        Employee emp3 = new Employee(empUser3, techcorp, engDept, hqLocation, afternoonShift, "DevOps Specialist", LocalDate.of(2023, 6, 10));
        emp3.setWorkStatus("ON_BREAK");
        emp3 = employeeRepository.save(emp3);

        // 8. Weekly Dress Codes
        dressCodeRepository.save(new DressCode(techcorp, "MONDAY", "Navy Blue", "#1e3a8a", "Formal corporate navy blue blazer or solid shirt", true));
        dressCodeRepository.save(new DressCode(techcorp, "TUESDAY", "Crisp White", "#ffffff", "Formal crisp white button-down shirt", true));
        dressCodeRepository.save(new DressCode(techcorp, "WEDNESDAY", "Sky Blue", "#38bdf8", "Light blue business casual", true));
        dressCodeRepository.save(new DressCode(techcorp, "THURSDAY", "Charcoal Grey", "#475569", "Professional charcoal or steel grey", true));
        dressCodeRepository.save(new DressCode(techcorp, "FRIDAY", "Casual Denim", "#0284c7", "Casual Friday polo or neat smart denim", false));

        // 9. Today's Dress Selection
        EmployeeDress empDress1 = new EmployeeDress(techcorp, emp1, LocalDate.now(), "Navy Blue", "#1e3a8a", true);
        empDress1.setAiVerified(true);
        empDress1.setAiConfidenceScore(0.98);
        employeeDressRepository.save(empDress1);

        // 10. Today's Sample Attendance
        Attendance att1 = new Attendance();
        att1.setCompany(techcorp);
        att1.setEmployee(emp1);
        att1.setShift(morningShift);
        att1.setAttendanceDate(LocalDate.now());
        att1.setCheckInTime(LocalDateTime.now().minusHours(4));
        att1.setCheckInLatitude(37.774920);
        att1.setCheckInLongitude(-122.419410);
        att1.setCheckInLocationVerified(true);
        att1.setCheckInDistanceMeters(14.2);
        att1.setStatus("PRESENT");
        att1.setIsLate(false);
        att1.setLateMinutes(0);
        att1.setTotalWorkMinutes(240);
        att1 = attendanceRepository.save(att1);

        // Selfie record
        AttendancePhoto photo = new AttendancePhoto(att1, "CHECK_IN", "/uploads/selfies/demo_emp1.jpg",
                "data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\"><rect width=\"200\" height=\"200\" fill=\"%231e3a8a\"/><circle cx=\"100\" cy=\"80\" r=\"40\" fill=\"%23ffffff\"/><ellipse cx=\"100\" cy=\"160\" rx=\"60\" ry=\"35\" fill=\"%23ffffff\"/><text x=\"100\" y=\"190\" fill=\"%2338bdf8\" text-anchor=\"middle\" font-size=\"12\">EMP-1001 VERIFIED</text></svg>",
                LocalDateTime.now().minusHours(4));
        attendancePhotoRepository.save(photo);

        System.out.println(">>> Database initialized successfully with demo accounts:");
        System.out.println("    Super Admin:   superadmin@workforce.com / Admin@123");
        System.out.println("    Company Admin: admin@techcorp.com / Admin@123");
        System.out.println("    HR Manager:    hr@techcorp.com / Admin@123");
        System.out.println("    Employee:      john.doe@techcorp.com / Admin@123");
    }
}
