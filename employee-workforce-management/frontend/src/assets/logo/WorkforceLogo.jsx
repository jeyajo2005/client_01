import React from 'react';

export default function WorkforceLogo({ className = "h-8 w-auto", showText = true }) {
  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0f172a] via-[#1e3a8a] to-[#0ea5e9] flex items-center justify-center text-white shadow-md shrink-0">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L3 7v9c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V7l-9-5z" />
          <path d="M9 12l2 2 4-4" stroke="#38bdf8" strokeWidth="2.5" />
        </svg>
      </div>
      {showText && (
        <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
          Workforce<span className="text-sky-600">Pro</span>
        </span>
      )}
    </div>
  );
}

