import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import Login from '../pages/Login';
import EmployeeDashboard from '../pages/EmployeeDashboard';
import ShiftManagement from '../pages/ShiftManagement';
import DressCodeManagement from '../pages/DressCodeManagement';
import LeaveManagement from '../pages/LeaveManagement';
import Profile from '../pages/Profile';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Employee Dashboard (Main Landing) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      {/* Dedicated Employee Punch Hero */}
      <Route
        path="/punch"
        element={
          <ProtectedRoute>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      {/* Employee Shift Management & Requests */}
      <Route
        path="/shifts"
        element={
          <ProtectedRoute>
            <ShiftManagement />
          </ProtectedRoute>
        }
      />

      {/* Employee Dress Code & AI Policy Selection */}
      <Route
        path="/dress-code"
        element={
          <ProtectedRoute>
            <DressCodeManagement />
          </ProtectedRoute>
        }
      />

      {/* Employee Leave Management & Applications */}
      <Route
        path="/leaves"
        element={
          <ProtectedRoute>
            <LeaveManagement />
          </ProtectedRoute>
        }
      />

      {/* Employee Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Any old admin route or unhandled path redirects to Employee Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
