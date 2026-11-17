import React from 'react';
import { TrendingUp, Users } from 'lucide-react';

export default function AttendanceMetricCard({ title, count, total, percentage, color = 'blue' }) {
  const percent = percentage !== undefined ? percentage : (total > 0 ? Math.round((count / total) * 100) : 0);

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</span>
        <span className="text-xs font-black text-slate-900">{percent}%</span>
      </div>

      <div className="text-2xl font-black text-slate-900 mb-2">
        {count} <span className="text-xs text-slate-400 font-normal">/ {total} Total</span>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            color === 'emerald' ? 'bg-emerald-500' :
            color === 'amber' ? 'bg-amber-500' :
            color === 'rose' ? 'bg-rose-500' : 'bg-sky-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

