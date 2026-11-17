import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  Shirt,
  CalendarDays,
  UserCheck,
  ShieldAlert,
  X,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  const navItems = [
    {
      label: 'Dashboard',
      to: '/',
      icon: LayoutDashboard,
    },
    {
      label: 'Daily Check-In & Selfie',
      to: '/punch',
      icon: CalendarCheck,
      badge: 'Live',
      badgeColor: 'bg-emerald-500 text-white',
    },
    {
      label: 'My Shift Schedule',
      to: '/shifts',
      icon: Clock,
    },
    {
      label: 'Dress Code Policy',
      to: '/dress-code',
      icon: Shirt,
    },
    {
      label: 'Leave Requests',
      to: '/leaves',
      icon: CalendarDays,
    },
    {
      label: 'My Profile',
      to: '/profile',
      icon: UserCheck,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar / Slide-out Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none transform transition-transform duration-300 ease-in-out lg:static lg:transform-none lg:w-64 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-base text-white">Workforce<span className="text-sky-400">Pro</span></span>
            <span className="text-[10px] bg-sky-950 text-sky-300 px-2 py-0.5 rounded-full border border-sky-800">Employee</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Employee Profile Quick Card */}
        <div className="p-3.5 mx-3 my-3 bg-slate-800/90 rounded-2xl border border-slate-700/60 flex items-center space-x-3 shadow-inner">
          <div className="relative shrink-0">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'}
              alt={user?.fullName || 'Employee'}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-sky-500/50"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0f172a] ${
                user?.workStatus === 'WORKING'
                  ? 'bg-emerald-500'
                  : user?.workStatus === 'ON_BREAK'
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
              }`}
            />
          </div>
          <div className="overflow-hidden min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">{user?.fullName || 'John Doe'}</div>
            <div className="text-[11px] text-slate-400 truncate">{user?.employeeCode || 'EMP-1001'}</div>
            <div className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider truncate mt-0.5">
              {user?.designation || 'Software Engineer'}
            </div>
          </div>
        </div>

        {/* Navigation Section Title */}
        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Employee Workspace</span>
          <Sparkles className="w-3 h-3 text-sky-400" />
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => {
                if (onClose) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Security / Privacy Enforced Badge */}
        <div className="p-3.5 m-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-400 text-xs">
          <div className="flex items-center space-x-2 text-slate-200 font-semibold mb-1">
            <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-xs">GPS & Selfie Protected</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-400">
            Location is verified only upon punch action. No constant background tracking.
          </p>
        </div>
      </aside>
    </>
  );
}
