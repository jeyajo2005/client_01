import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, Clock, CalendarDays, UserCheck } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { to: '/', label: 'Home', icon: LayoutDashboard },
    { to: '/punch', label: 'Punch', icon: CalendarCheck, isHero: true },
    { to: '/shifts', label: 'Shifts', icon: Clock },
    { to: '/leaves', label: 'Leaves', icon: CalendarDays },
    { to: '/profile', label: 'Profile', icon: UserCheck },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                  item.isHero
                    ? isActive
                      ? 'text-sky-600 font-bold'
                      : 'text-sky-600 font-semibold'
                    : isActive
                    ? 'text-sky-600 font-bold'
                    : 'text-slate-500 hover:text-slate-900 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.isHero ? (
                    <div className="w-10 h-10 -mt-5 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-700 text-white flex items-center justify-center shadow-lg shadow-sky-600/30 ring-4 ring-white">
                      <Icon className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                      {isActive && (
                        <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-sky-600 rounded-full" />
                      )}
                    </div>
                  )}
                  <span className={`text-[10px] mt-1 ${item.isHero ? 'font-bold' : ''}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

