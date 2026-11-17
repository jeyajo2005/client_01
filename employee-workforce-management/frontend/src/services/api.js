import { DEMO_USERS, DEFAULT_OFFICE_LOCATIONS, DRESS_COLOR_PALETTE, ROLES } from '../utils/constants';

const BASE_URL = '/api';

// Helper: Haversine distance in meters
export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Initial Mock Seed State for persistent fallback
const INITIAL_STATE_KEY = 'workforce_mock_db_v1';

function getInitialMockDb() {
  const saved = localStorage.getItem(INITIAL_STATE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn('Resetting corrupt mock db');
    }
  }

  const todayStr = new Date().toISOString().split('T')[0];

  const db = {
    companies: [
      { id: 1, name: 'TechCorp Global Solutions', code: 'TECHCORP', email: 'contact@techcorp.com' },
      { id: 2, name: 'Apex Logistics & Freight', code: 'APEXLOG', email: 'support@apexlogistics.com' }
    ],
    departments: [
      { id: 1, companyId: 1, name: 'Software Engineering', code: 'ENG', employeeCount: 18 },
      { id: 2, companyId: 1, name: 'Human Resources', code: 'HR', employeeCount: 6 },
      { id: 3, companyId: 1, name: 'Product & UI/UX Design', code: 'DESIGN', employeeCount: 8 },
      { id: 4, companyId: 1, name: 'Sales & Growth', code: 'SALES', employeeCount: 12 },
      { id: 5, companyId: 1, name: 'Quality Assurance & DevOps', code: 'QA', employeeCount: 7 }
    ],
    locations: DEFAULT_OFFICE_LOCATIONS,
    shifts: [
      { id: 1, companyId: 1, name: 'Morning Shift', shiftType: 'MORNING', startTime: '09:00:00', endTime: '17:00:00', gracePeriodMinutes: 15, colorCode: '#3b82f6', isActive: true },
      { id: 2, companyId: 1, name: 'Afternoon Shift', shiftType: 'AFTERNOON', startTime: '13:00:00', endTime: '21:00:00', gracePeriodMinutes: 15, colorCode: '#f59e0b', isActive: true },
      { id: 3, companyId: 1, name: 'Night Shift', shiftType: 'NIGHT', startTime: '21:00:00', endTime: '05:00:00', gracePeriodMinutes: 15, colorCode: '#8b5cf6', isActive: true },
      { id: 4, companyId: 1, name: 'Custom Executive', shiftType: 'CUSTOM', startTime: '10:00:00', endTime: '19:00:00', gracePeriodMinutes: 10, colorCode: '#10b981', isActive: true }
    ],
    employees: [
      {
        id: 1,
        userId: 4,
        companyId: 1,
        employeeCode: 'EMP-1001',
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        email: 'john.doe@techcorp.com',
        phone: '+1 (555) 100-0003',
        departmentId: 1,
        departmentName: 'Software Engineering',
        designation: 'Senior Full Stack Engineer',
        shiftId: 1,
        shiftName: 'Morning Shift (09:00 - 17:00)',
        locationId: 1,
        locationName: 'TechCorp Headquarters - Tech Park',
        joiningDate: '2023-01-15',
        employmentType: 'FULL_TIME',
        workStatus: 'WORKING',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        emergencyContactName: 'Jane Doe',
        emergencyContactPhone: '+1 (555) 999-1001'
      },
      {
        id: 2,
        userId: 5,
        companyId: 1,
        employeeCode: 'EMP-1002',
        firstName: 'Sarah',
        lastName: 'Connor',
        fullName: 'Sarah Connor',
        email: 'sarah.c@techcorp.com',
        phone: '+1 (555) 100-0004',
        departmentId: 3,
        departmentName: 'Product & UI/UX Design',
        designation: 'Lead Product Designer',
        shiftId: 1,
        shiftName: 'Morning Shift (09:00 - 17:00)',
        locationId: 1,
        locationName: 'TechCorp Headquarters - Tech Park',
        joiningDate: '2023-03-20',
        employmentType: 'FULL_TIME',
        workStatus: 'WORKING',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        emergencyContactName: 'John Connor',
        emergencyContactPhone: '+1 (555) 999-1002'
      },
      {
        id: 3,
        userId: 6,
        companyId: 1,
        employeeCode: 'EMP-1003',
        firstName: 'Alex',
        lastName: 'Kumar',
        fullName: 'Alex Kumar',
        email: 'alex.k@techcorp.com',
        phone: '+1 (555) 100-0005',
        departmentId: 5,
        departmentName: 'Quality Assurance & DevOps',
        designation: 'DevOps Specialist',
        shiftId: 2,
        shiftName: 'Afternoon Shift (13:00 - 21:00)',
        locationId: 1,
        locationName: 'TechCorp Headquarters - Tech Park',
        joiningDate: '2023-06-10',
        employmentType: 'FULL_TIME',
        workStatus: 'ON_BREAK',
        avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop'
      },
      {
        id: 4,
        userId: 7,
        companyId: 1,
        employeeCode: 'EMP-1004',
        firstName: 'Priya',
        lastName: 'Sharma',
        fullName: 'Priya Sharma',
        email: 'priya.s@techcorp.com',
        phone: '+1 (555) 100-0006',
        departmentId: 1,
        departmentName: 'Software Engineering',
        designation: 'Frontend UI Specialist',
        shiftId: 1,
        shiftName: 'Morning Shift (09:00 - 17:00)',
        locationId: 2,
        locationName: 'Downtown Development Hub',
        joiningDate: '2023-08-01',
        employmentType: 'FULL_TIME',
        workStatus: 'WORKING',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop'
      },
      {
        id: 5,
        userId: 8,
        companyId: 1,
        employeeCode: 'EMP-1005',
        firstName: 'Michael',
        lastName: 'Scott',
        fullName: 'Michael Scott',
        email: 'michael.s@techcorp.com',
        phone: '+1 (555) 100-0007',
        departmentId: 4,
        departmentName: 'Sales & Growth',
        designation: 'Enterprise Account Manager',
        shiftId: 4,
        shiftName: 'Custom Executive (10:00 - 19:00)',
        locationId: 1,
        locationName: 'TechCorp Headquarters - Tech Park',
        joiningDate: '2022-11-05',
        employmentType: 'FULL_TIME',
        workStatus: 'ON_LEAVE',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
      }
    ],
    dressCodes: [
      { id: 1, companyId: 1, dayOfWeek: 'MONDAY', colorName: 'Navy Blue', colorHex: '#1e3a8a', description: 'Corporate navy blue blazer or solid formal shirt', isMandatory: true },
      { id: 2, companyId: 1, dayOfWeek: 'TUESDAY', colorName: 'Crisp White', colorHex: '#ffffff', description: 'Formal white crisp button-down shirt', isMandatory: true },
      { id: 3, companyId: 1, dayOfWeek: 'WEDNESDAY', colorName: 'Sky Blue', colorHex: '#38bdf8', description: 'Light sky blue business casual', isMandatory: true },
      { id: 4, companyId: 1, dayOfWeek: 'THURSDAY', colorName: 'Charcoal Grey', colorHex: '#475569', description: 'Professional steel or charcoal grey', isMandatory: true },
      { id: 5, companyId: 1, dayOfWeek: 'FRIDAY', colorName: 'Casual Denim', colorHex: '#0284c7', description: 'Casual Friday polo or neat smart denim', isMandatory: false }
    ],
    employeeDress: [
      { id: 1, employeeId: 1, employeeName: 'John Doe', dressDate: todayStr, selectedColorName: 'Navy Blue', selectedColorHex: '#1e3a8a', isCompliant: true, aiVerified: true, aiConfidenceScore: 0.98 },
      { id: 2, employeeId: 2, employeeName: 'Sarah Connor', dressDate: todayStr, selectedColorName: 'Navy Blue', selectedColorHex: '#1e3a8a', isCompliant: true, aiVerified: true, aiConfidenceScore: 0.96 },
      { id: 3, employeeId: 3, employeeName: 'Alex Kumar', dressDate: todayStr, selectedColorName: 'Sky Blue', selectedColorHex: '#38bdf8', isCompliant: false, aiVerified: true, aiConfidenceScore: 0.88 }
    ],
    attendance: [
      {
        id: 1,
        companyId: 1,
        employeeId: 1,
        employeeName: 'John Doe',
        employeeCode: 'EMP-1001',
        department: 'Software Engineering',
        shiftName: 'Morning Shift',
        attendanceDate: todayStr,
        checkInTime: `${todayStr}T08:55:00`,
        checkOutTime: null,
        checkInLatitude: 37.774920,
        checkInLongitude: -122.419410,
        checkInLocationVerified: true,
        checkInDistanceMeters: 14.2,
        checkOutLocationVerified: false,
        totalWorkMinutes: 245,
        totalBreakMinutes: 15,
        status: 'PRESENT',
        isLate: false,
        lateMinutes: 0,
        notes: 'Verified via GPS Geofence and Live Selfie Cam',
        selfieBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%231e3a8a"/><circle cx="100" cy="80" r="40" fill="%23ffffff"/><ellipse cx="100" cy="160" rx="60" ry="35" fill="%23ffffff"/><text x="100" y="195" font-size="12" fill="%2338bdf8" text-anchor="middle">EMP-1001 VERIFIED</text></svg>'
      },
      {
        id: 2,
        companyId: 1,
        employeeId: 2,
        employeeName: 'Sarah Connor',
        employeeCode: 'EMP-1002',
        department: 'Product & UI/UX Design',
        shiftName: 'Morning Shift',
        attendanceDate: todayStr,
        checkInTime: `${todayStr}T09:22:00`,
        checkOutTime: null,
        checkInLatitude: 37.774950,
        checkInLongitude: -122.419380,
        checkInLocationVerified: true,
        checkInDistanceMeters: 22.1,
        checkOutLocationVerified: false,
        totalWorkMinutes: 218,
        totalBreakMinutes: 0,
        status: 'LATE',
        isLate: true,
        lateMinutes: 22,
        notes: 'Late arrival due to public transit delay',
        selfieBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%230f172a"/><circle cx="100" cy="80" r="40" fill="%23f8fafc"/><ellipse cx="100" cy="160" rx="60" ry="35" fill="%23f8fafc"/><text x="100" y="195" font-size="12" fill="%2338bdf8" text-anchor="middle">EMP-1002 VERIFIED</text></svg>'
      },
      {
        id: 3,
        companyId: 1,
        employeeId: 4,
        employeeName: 'Priya Sharma',
        employeeCode: 'EMP-1004',
        department: 'Software Engineering',
        shiftName: 'Morning Shift',
        attendanceDate: todayStr,
        checkInTime: `${todayStr}T08:58:00`,
        checkOutTime: null,
        checkInLatitude: 37.789160,
        checkInLongitude: -122.401430,
        checkInLocationVerified: true,
        checkInDistanceMeters: 14.8,
        checkOutLocationVerified: false,
        totalWorkMinutes: 242,
        totalBreakMinutes: 0,
        status: 'PRESENT',
        isLate: false,
        lateMinutes: 0,
        notes: 'Downtown Hub verified check-in',
        selfieBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%230284c7"/><circle cx="100" cy="80" r="40" fill="%23ffffff"/><ellipse cx="100" cy="160" rx="60" ry="35" fill="%23ffffff"/><text x="100" y="195" font-size="12" fill="%23ffffff" text-anchor="middle">EMP-1004 VERIFIED</text></svg>'
      }
    ],
    breaks: [
      { id: 1, employeeId: 1, breakType: 'TEA_BREAK', startTime: `${todayStr}T10:30:00`, endTime: `${todayStr}T10:45:00`, durationMinutes: 15 },
      { id: 2, employeeId: 3, breakType: 'LUNCH_BREAK', startTime: `${todayStr}T13:00:00`, endTime: null, durationMinutes: 0 }
    ],
    leaves: [
      { id: 1, companyId: 1, employeeId: 5, employeeName: 'Michael Scott', leaveType: 'ANNUAL', startDate: todayStr, endDate: `${todayStr}`, totalDays: 1, reason: 'Annual scheduled personal vacation', status: 'APPROVED', approvedBy: 'Marcus Sterling (HR)' },
      { id: 2, companyId: 1, employeeId: 1, employeeName: 'John Doe', leaveType: 'CASUAL', startDate: '2026-11-20', endDate: '2026-11-20', totalDays: 1, reason: 'Vehicle registration appointment', status: 'PENDING', approvedBy: null }
    ],
    shiftRequests: [
      { id: 1, companyId: 1, employeeId: 2, employeeName: 'Sarah Connor', currentShift: 'Morning Shift', requestedShift: 'Afternoon Shift', effectiveDate: '2026-11-25', reason: 'Design team afternoon sprint planning overlap', status: 'PENDING' }
    ]
  };

  localStorage.setItem(INITIAL_STATE_KEY, JSON.stringify(db));
  return db;
}

function saveMockDb(db) {
  localStorage.setItem(INITIAL_STATE_KEY, JSON.stringify(db));
}

// REST API CLIENT with seamless fallback
export const api = {
  // Generic fetch wrapper with token header
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('workforce_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json().catch(() => null);
      if (data && (data.isOffline || (data.success === false && data.data === null))) {
        return null;
      }

      return data;
    } catch (err) {
      // Backend offline or unreachable, trigger interactive fallback
      return null;
    }
  },

  // Auth
  async login(username, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (res && res.data) return res.data;

    // Fallback login for single employee portal
    const singleEmp = DEMO_USERS.find(u => u.role === ROLES.EMPLOYEE) || DEMO_USERS[0];
    const match = DEMO_USERS.find(
      u => (u.email.toLowerCase() === username.toLowerCase() || u.employeeCode.toLowerCase() === username.toLowerCase())
    ) || singleEmp;

    if (match) {
      const db = getInitialMockDb();
      const emp = db.employees.find(e => e.email.toLowerCase() === match.email.toLowerCase());
      return {
        accessToken: 'mock_jwt_token_' + Date.now(),
        tokenType: 'Bearer',
        userId: match.employeeId || 1,
        employeeId: emp ? emp.id : (match.employeeId || 1),
        companyId: match.companyId,
        companyName: match.companyName,
        employeeCode: match.employeeCode,
        email: match.email,
        fullName: match.fullName,
        avatarUrl: match.avatarUrl,
        roles: [match.role],
        workStatus: emp ? emp.workStatus : 'WORKING'
      };
    }
    throw new Error('Invalid email or password. Please use one of the demo credentials provided.');
  },

  // Dashboard Stats
  async getDashboardSummary(companyId = 1) {
    const res = await this.request(`/reports/dashboard/${companyId}`);
    if (res && res.data) return res.data;

    const db = getInitialMockDb();
    const today = new Date().toISOString().split('T')[0];
    const presentCount = db.attendance.filter(a => a.attendanceDate === today).length;
    const lateCount = db.attendance.filter(a => a.attendanceDate === today && a.isLate).length;
    const onBreakCount = db.employees.filter(e => e.workStatus === 'ON_BREAK').length;
    const totalEmployees = db.employees.length;
    const absentCount = Math.max(0, totalEmployees - presentCount);

    return {
      totalEmployees,
      presentToday: presentCount,
      absentToday: absentCount,
      lateEmployees: lateCount,
      employeesOnBreak: onBreakCount,
      activeShifts: db.shifts.length,
      attendancePercentage: totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0,
      recentCheckIns: db.attendance.map(a => ({
        id: a.id,
        employeeName: a.employeeName,
        employeeCode: a.employeeCode,
        department: a.department,
        checkInTime: a.checkInTime,
        status: a.status,
        isLate: a.isLate,
        lateMinutes: a.lateMinutes,
        locationVerified: a.checkInLocationVerified,
        distanceMeters: a.checkInDistanceMeters,
        selfieBase64: a.selfieBase64
      })),
      departmentStats: db.departments,
      todayDressCode: db.dressCodes[0] || { colorName: 'Navy Blue', colorHex: '#1e3a8a', description: 'Corporate formal attire', isMandatory: true }
    };
  },

  // Attendance Check-in
  async checkIn(payload) {
    const res = await this.request('/attendance/check-in', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res && res.data) return res.data;

    const db = getInitialMockDb();
    const emp = db.employees.find(e => e.id === Number(payload.employeeId)) || db.employees[0];
    const todayStr = new Date().toISOString().split('T')[0];

    const targetOffice = db.locations[0];
    const dist = calculateDistanceMeters(
      payload.latitude,
      payload.longitude,
      targetOffice.latitude,
      targetOffice.longitude
    );
    const verified = dist <= targetOffice.radiusMeters;

    const newAttendance = {
      id: db.attendance.length + 1,
      companyId: 1,
      employeeId: emp.id,
      employeeName: emp.fullName,
      employeeCode: emp.employeeCode,
      department: emp.departmentName,
      shiftName: emp.shiftName,
      attendanceDate: todayStr,
      checkInTime: new Date().toISOString(),
      checkOutTime: null,
      checkInLatitude: payload.latitude,
      checkInLongitude: payload.longitude,
      checkInLocationVerified: verified,
      checkInDistanceMeters: dist,
      totalWorkMinutes: 0,
      totalBreakMinutes: 0,
      status: 'PRESENT',
      isLate: false,
      lateMinutes: 0,
      notes: payload.notes || 'Checked in via web client with GPS and Selfie',
      selfieBase64: payload.selfieBase64 || null
    };

    // Remove existing today check-in if retrying demo
    db.attendance = db.attendance.filter(a => !(a.employeeId === emp.id && a.attendanceDate === todayStr));
    db.attendance.unshift(newAttendance);

    // Update employee status
    emp.workStatus = 'WORKING';

    // Record dress selection if provided
    if (payload.dressColorName) {
      db.employeeDress.unshift({
        id: db.employeeDress.length + 1,
        employeeId: emp.id,
        employeeName: emp.fullName,
        dressDate: todayStr,
        selectedColorName: payload.dressColorName,
        selectedColorHex: payload.dressColorHex || '#1e3a8a',
        isCompliant: true,
        aiVerified: true,
        aiConfidenceScore: 0.98
      });
    }

    saveMockDb(db);
    return newAttendance;
  },

  // Attendance Check-out
  async checkOut(payload) {
    const res = await this.request('/attendance/check-out', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res && res.data) return res.data;

    const db = getInitialMockDb();
    const emp = db.employees.find(e => e.id === Number(payload.employeeId)) || db.employees[0];
    const todayStr = new Date().toISOString().split('T')[0];
    const att = db.attendance.find(a => a.employeeId === emp.id && a.attendanceDate === todayStr);

    if (att) {
      att.checkOutTime = new Date().toISOString();
      att.totalWorkMinutes = 480;
      att.checkOutLocationVerified = true;
    }

    emp.workStatus = 'COMPLETED';
    saveMockDb(db);
    return att || { status: 'COMPLETED' };
  },

  // Breaks
  async startBreak(payload) {
    const res = await this.request('/attendance/breaks/start', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res && res.data) return res.data;

    const db = getInitialMockDb();
    const emp = db.employees.find(e => e.id === Number(payload.employeeId)) || db.employees[0];
    emp.workStatus = 'ON_BREAK';

    const newBreak = {
      id: db.breaks.length + 1,
      employeeId: emp.id,
      breakType: payload.breakType || 'TEA_BREAK',
      startTime: new Date().toISOString(),
      endTime: null,
      durationMinutes: 0
    };
    db.breaks.push(newBreak);
    saveMockDb(db);
    return newBreak;
  },

  async endBreak(employeeId) {
    const res = await this.request(`/attendance/breaks/end?employeeId=${employeeId}`, {
      method: 'POST'
    });
    if (res && res.data) return res.data;

    const db = getInitialMockDb();
    const emp = db.employees.find(e => e.id === Number(employeeId)) || db.employees[0];
    emp.workStatus = 'WORKING';

    const activeBreak = db.breaks.find(b => b.employeeId === emp.id && !b.endTime);
    if (activeBreak) {
      activeBreak.endTime = new Date().toISOString();
      activeBreak.durationMinutes = 15;
    }

    saveMockDb(db);
    return activeBreak || { durationMinutes: 15 };
  },

  // Employees List
  async getEmployees(companyId = 1) {
    const res = await this.request(`/employees/company/${companyId}`);
    if (res && res.data) return res.data;
    const db = getInitialMockDb();
    return db.employees;
  },

  async createEmployee(companyId = 1, payload) {
    const res = await this.request(`/employees/company/${companyId}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res && res.data) return res.data;

    const db = getInitialMockDb();
    const count = db.employees.length + 1;
    const empCode = payload.employeeCode || `EMP-${1000 + count}`;
    const dept = db.departments.find(d => d.id === Number(payload.departmentId)) || db.departments[0];
    const shift = db.shifts.find(s => s.id === Number(payload.shiftId)) || db.shifts[0];
    const loc = db.locations.find(l => l.id === Number(payload.locationId)) || db.locations[0];

    const newEmp = {
      id: count,
      userId: count + 10,
      companyId,
      employeeCode: empCode,
      firstName: payload.firstName,
      lastName: payload.lastName,
      fullName: `${payload.firstName} ${payload.lastName}`,
      email: payload.email,
      phone: payload.phone || '+1 (555) 000-0000',
      departmentId: dept.id,
      departmentName: dept.name,
      designation: payload.designation,
      shiftId: shift.id,
      shiftName: shift.name,
      locationId: loc.id,
      locationName: loc.name,
      joiningDate: payload.joiningDate || new Date().toISOString().split('T')[0],
      employmentType: payload.employmentType || 'FULL_TIME',
      workStatus: 'OFFLINE',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.firstName)}+${encodeURIComponent(payload.lastName)}&background=1e3a8a&color=fff`,
      emergencyContactName: payload.emergencyContactName,
      emergencyContactPhone: payload.emergencyContactPhone
    };

    db.employees.push(newEmp);
    saveMockDb(db);
    return newEmp;
  },

  async deleteEmployee(id) {
    const res = await this.request(`/employees/${id}`, { method: 'DELETE' });
    if (res) return true;
    const db = getInitialMockDb();
    db.employees = db.employees.filter(e => e.id !== Number(id));
    saveMockDb(db);
    return true;
  },

  // Shifts
  async getShifts(companyId = 1) {
    const res = await this.request(`/shifts/company/${companyId}`);
    if (res && res.data) return res.data;
    return getInitialMockDb().shifts;
  },

  async getShiftRequests(companyId = 1) {
    const res = await this.request(`/shifts/requests/company/${companyId}`);
    if (res && res.data) return res.data;
    return getInitialMockDb().shiftRequests;
  },

  async reviewShiftRequest(requestId, approve) {
    const res = await this.request(`/shifts/requests/${requestId}/review?approve=${approve}`, { method: 'POST' });
    if (res && res.data) return res.data;
    const db = getInitialMockDb();
    const req = db.shiftRequests.find(r => r.id === Number(requestId));
    if (req) {
      req.status = approve ? 'APPROVED' : 'REJECTED';
      saveMockDb(db);
    }
    return req;
  },

  async requestShiftChange(payload) {
    const res = await this.request('/shifts/requests', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res && res.data) return res.data;

    const db = getInitialMockDb();
    const emp = db.employees.find(e => e.id === Number(payload.employeeId)) || db.employees[0];
    const shift = db.shifts.find(s => s.id === Number(payload.requestedShiftId)) || db.shifts[1];

    const newReq = {
      id: db.shiftRequests.length + 1,
      companyId: 1,
      employeeId: emp.id,
      employeeName: emp.fullName,
      currentShift: emp.shiftName,
      requestedShift: shift.name,
      effectiveDate: payload.effectiveDate,
      reason: payload.reason,
      status: 'PENDING'
    };
    db.shiftRequests.push(newReq);
    saveMockDb(db);
    return newReq;
  },

  // Dress Codes
  async getDressCodes(companyId = 1) {
    const res = await this.request(`/dress-codes/company/${companyId}`);
    if (res && res.data) return res.data;
    return getInitialMockDb().dressCodes;
  },

  async getTodayDressCode(companyId = 1) {
    const res = await this.request(`/dress-codes/today/${companyId}`);
    if (res && res.data) return res.data;
    const codes = getInitialMockDb().dressCodes;
    return codes[0];
  },

  async selectDailyDress(payload) {
    const res = await this.request('/dress-codes/select', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res && res.data) return res.data;

    const db = getInitialMockDb();
    const emp = db.employees.find(e => e.id === Number(payload.employeeId)) || db.employees[0];
    const newEntry = {
      id: db.employeeDress.length + 1,
      employeeId: emp.id,
      employeeName: emp.fullName,
      dressDate: new Date().toISOString().split('T')[0],
      selectedColorName: payload.selectedColorName,
      selectedColorHex: payload.selectedColorHex,
      isCompliant: true,
      aiVerified: true,
      aiConfidenceScore: 0.98
    };
    db.employeeDress.unshift(newEntry);
    saveMockDb(db);
    return newEntry;
  },

  async getEmployeeDressHistory(employeeId) {
    const res = await this.request(`/dress-codes/history/${employeeId}`);
    if (res && res.data) return res.data;
    return getInitialMockDb().employeeDress.filter(d => d.employeeId === Number(employeeId));
  },

  // Locations / Geofences
  async getLocations(companyId = 1) {
    const res = await this.request(`/locations/company/${companyId}`);
    if (res && res.data) return res.data;
    return getInitialMockDb().locations;
  },

  async createLocation(companyId = 1, payload) {
    const res = await this.request(`/locations/company/${companyId}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res && res.data) return res.data;

    const db = getInitialMockDb();
    const newLoc = {
      id: db.locations.length + 1,
      companyId,
      name: payload.name,
      address: payload.address,
      latitude: Number(payload.latitude),
      longitude: Number(payload.longitude),
      radiusMeters: Number(payload.radiusMeters) || 200,
      isActive: true
    };
    db.locations.push(newLoc);
    saveMockDb(db);
    return newLoc;
  },

  // Leaves
  async getLeaves(companyId = 1) {
    const res = await this.request(`/leaves/company/${companyId}`);
    if (res && res.data) return res.data;
    return getInitialMockDb().leaves;
  },

  async applyLeave(payload) {
    const res = await this.request('/leaves/apply', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res && res.data) return res.data;

    const db = getInitialMockDb();
    const emp = db.employees.find(e => e.id === Number(payload.employeeId)) || db.employees[0];
    const newLeave = {
      id: db.leaves.length + 1,
      companyId: 1,
      employeeId: emp.id,
      employeeName: emp.fullName,
      leaveType: payload.leaveType,
      startDate: payload.startDate,
      endDate: payload.endDate,
      totalDays: 1,
      reason: payload.reason,
      status: 'PENDING',
      approvedBy: null
    };
    db.leaves.unshift(newLeave);
    saveMockDb(db);
    return newLeave;
  },

  async reviewLeave(leaveId, approve) {
    const res = await this.request(`/leaves/${leaveId}/review?approve=${approve}`, { method: 'POST' });
    if (res && res.data) return res.data;

    const db = getInitialMockDb();
    const leave = db.leaves.find(l => l.id === Number(leaveId));
    if (leave) {
      leave.status = approve ? 'APPROVED' : 'REJECTED';
      leave.approvedBy = 'HR Manager';
      saveMockDb(db);
    }
    return leave;
  },

  // Attendance Records
  async getCompanyAttendance(companyId = 1) {
    const res = await this.request(`/attendance/company/${companyId}`);
    if (res && res.data) return res.data;
    return getInitialMockDb().attendance;
  },

  async getEmployeeAttendance(employeeId = 1) {
    const res = await this.request(`/attendance/employee/${employeeId}`);
    if (res && res.data) return res.data;
    return getInitialMockDb().attendance.filter(a => a.employeeId === Number(employeeId));
  }
};
