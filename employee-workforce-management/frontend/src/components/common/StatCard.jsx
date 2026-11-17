import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, trend, trendLabel, color = 'blue' }) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 text-brand-primary border-blue-100',
      pill: 'text-brand-primary bg-blue-100/60'
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      pill: 'text-emerald-700 bg-emerald-100/60'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
      pill: 'text-amber-700 bg-amber-100/60'
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600 border-rose-100',
      pill: 'text-rose-700 bg-rose-100/60'
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600 border-purple-100',
      pill: 'text-purple-700 bg-purple-100/60'
    },
    sky: {
      bg: 'bg-sky-50 text-sky-600 border-sky-100',
      pill: 'text-sky-700 bg-sky-100/60'
    }
  };

  const currentTheme = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${currentTheme.bg}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </div>
        {trend && (
          <div className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${currentTheme.pill}`}>
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>{trend}</span>
          </div>
        )}
      </div>

      {trendLabel && (
        <p className="mt-1.5 text-xs text-slate-500 font-medium">
          {trendLabel}
        </p>
      )}
    </div>
  );
}
