// User Roles
export const ROLES = {
  SUPER_ADMIN: 'ROLE_SUPER_ADMIN',
  COMPANY_ADMIN: 'ROLE_COMPANY_ADMIN',
  HR_MANAGER: 'ROLE_HR_MANAGER',
  EMPLOYEE: 'ROLE_EMPLOYEE',
};

// Demo Accounts for seamless 1-click testing
export const DEMO_USERS = [
  {
    role: ROLES.SUPER_ADMIN,
    label: 'Super Admin',
    email: 'superadmin@workforce.com',
    employeeCode: 'SUPER-001',
    password: 'Admin@123',
    fullName: 'Alexander Vance',
    designation: 'Platform Administrator',
    companyName: 'Platform Global Oversight',
    companyId: 1,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
  },
  {
    role: ROLES.COMPANY_ADMIN,
    label: 'Company Admin',
    email: 'admin@techcorp.com',
    employeeCode: 'ADM-1001',
    password: 'Admin@123',
    fullName: 'Elena Rostova',
    designation: 'Managing Director & Admin',
    companyName: 'TechCorp Global Solutions',
    companyId: 1,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
  },
  {
    role: ROLES.HR_MANAGER,
    label: 'HR Manager',
    email: 'hr@techcorp.com',
    employeeCode: 'HR-1001',
    password: 'Admin@123',
    fullName: 'Marcus Sterling',
    designation: 'Head of Human Resources',
    companyName: 'TechCorp Global Solutions',
    companyId: 1,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
  {
    role: ROLES.EMPLOYEE,
    label: 'Employee (John Doe)',
    email: 'john.doe@techcorp.com',
    employeeCode: 'EMP-1001',
    password: 'Admin@123',
    fullName: 'John Doe',
    designation: 'Senior Full Stack Engineer',
    companyName: 'TechCorp Global Solutions',
    companyId: 1,
    employeeId: 1,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  }
];

// Default Office Geofences
export const DEFAULT_OFFICE_LOCATIONS = [
  {
    id: 1,
    companyId: 1,
    name: 'TechCorp Headquarters - Tech Park',
    address: '100 Innovation Way, Silicon Valley, CA 94025',
    latitude: 37.774929,
    longitude: -122.419416,
    radiusMeters: 250.0,
    isActive: true,
  },
  {
    id: 2,
    companyId: 1,
    name: 'Downtown Development Hub',
    address: '450 Mission Street, Suite 800, San Francisco, CA',
    latitude: 37.789172,
    longitude: -122.401449,
    radiusMeters: 150.0,
    isActive: true,
  }
];

// Dress Code Palette Suggestions
export const DRESS_COLOR_PALETTE = [
  { name: 'Navy Blue', hex: '#1e3a8a', label: 'Navy Blue (Formal)' },
  { name: 'Crisp White', hex: '#ffffff', label: 'Crisp White (Classic)' },
  { name: 'Sky Blue', hex: '#38bdf8', label: 'Sky Blue (Smart Casual)' },
  { name: 'Charcoal Grey', hex: '#475569', label: 'Charcoal Grey (Corporate)' },
  { name: 'Casual Denim', hex: '#0284c7', label: 'Denim Blue (Casual)' },
  { name: 'Emerald Green', hex: '#059669', label: 'Emerald Green' },
  { name: 'Burgundy', hex: '#881337', label: 'Burgundy / Maroon' },
  { name: 'Formal Black', hex: '#0f172a', label: 'Jet Black (Formal)' },
];
