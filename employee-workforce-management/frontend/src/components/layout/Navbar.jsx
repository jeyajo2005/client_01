import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  ShieldCheck,
  LogOut,
  Menu
} from 'lucide-react';

export default function Navbar({ onToggleMobileMenu }) {
  const { user, logout } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs h-16">
      <div className="flex items-center justify-between h-full px-3 sm:px-6">
        
        {/* Left: Mobile Hamburger & Brand Identity */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden transition"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-sky-600 flex items-center justify-center text-white shadow-md shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
                Workforce<span className="text-sky-600">Pro</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-md bg-sky-50 text-sky-700 border border-sky-200">
                Employee
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block truncate max-w-[200px] md:max-w-none">
              {user?.companyName || 'TechCorp Global Solutions'}
            </p>
          </div>
        </div>

        {/* Center: Live Office Time & Date */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
          <Clock className="w-4 h-4 text-sky-600 animate-pulse" />
          <span>Office Clock:</span>
          <span className="font-bold text-slate-900 font-mono">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-normal">
            {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Right: Active Employee Info & Logout */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Active Single Employee Badge */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-800 font-bold">{user?.fullName || 'John Doe'}</span>
            <span className="text-[10px] text-sky-600 font-mono hidden sm:inline">({user?.employeeCode || 'EMP-1001'})</span>
          </div>

          {/* User Profile Pill & Logout */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'}
              alt={user?.fullName || 'User'}
              className="w-8 h-8 rounded-xl object-cover ring-2 ring-sky-500/20 shrink-0"
            />
            
            <button
              onClick={logout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
