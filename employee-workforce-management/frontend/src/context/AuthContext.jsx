import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { DEMO_USERS, ROLES } from '../utils/constants';

const AuthContext = createContext(null);

const DEFAULT_EMPLOYEE = {
  userId: 4,
  employeeId: 1,
  companyId: 1,
  companyName: 'TechCorp Global Solutions',
  employeeCode: 'EMP-1001',
  email: 'john.doe@techcorp.com',
  fullName: 'John Doe',
  designation: 'Senior Full Stack Engineer',
  avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  roles: [ROLES.EMPLOYEE],
  workStatus: 'WORKING'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('workforce_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure user is strictly an employee
        if (parsed && parsed.roles && parsed.roles.includes(ROLES.EMPLOYEE)) {
          return parsed;
        }
      } catch (e) {}
    }
    // Default strictly to Employee
    return DEFAULT_EMPLOYEE;
  });

  const [token, setToken] = useState(() => localStorage.getItem('workforce_token') || 'demo_token_employee');

  useEffect(() => {
    if (user) {
      localStorage.setItem('workforce_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('workforce_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('workforce_token', token);
    } else {
      localStorage.removeItem('workforce_token');
    }
  }, [token]);

  const login = async (username, password) => {
    const data = await api.login(username, password);
    // Force employee role for frontend portal
    if (!data.roles || !data.roles.includes(ROLES.EMPLOYEE)) {
      data.roles = [ROLES.EMPLOYEE];
    }
    setToken(data.accessToken);
    setUser(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('workforce_user');
    localStorage.removeItem('workforce_token');
  };

  const switchEmployee = (employeeEmail) => {
    const match = DEMO_USERS.filter(u => u.role === ROLES.EMPLOYEE).find(u => u.email === employeeEmail);
    if (match) {
      const newUser = {
        userId: match.employeeId || 1,
        employeeId: match.employeeId || 1,
        companyId: match.companyId,
        companyName: match.companyName,
        employeeCode: match.employeeCode,
        email: match.email,
        fullName: match.fullName,
        designation: match.designation,
        avatarUrl: match.avatarUrl,
        roles: [ROLES.EMPLOYEE],
        workStatus: 'WORKING'
      };
      setUser(newUser);
      setToken('demo_token_' + match.employeeCode.toLowerCase());
    }
  };

  const hasRole = (role) => user?.roles?.includes(role);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      switchEmployee,
      switchRole: switchEmployee,
      isAuthenticated: !!user,
      hasRole,
      isSuperAdmin: false,
      isCompanyAdmin: false,
      isHR: false,
      isEmployee: true
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
