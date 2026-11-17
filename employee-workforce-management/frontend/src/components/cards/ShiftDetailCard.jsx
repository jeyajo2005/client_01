import React from 'react';
import { Clock, ShieldAlert } from 'lucide-react';

export default function ShiftDetailCard({ shift, onSelect, isSelected = false }) {
  if (!shift) return null;

  return (
    <div
      onClick={onSelect}
      className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
        isSelected
          ? 'border-sky-500 bg-sky-50/50 shadow-md ring-1 ring-sky-500'
          : 'border-slate-200 bg-white hover:border-slate-300 shadow-card'
      }`}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ backgroundColor: shift.colorCode || '#3b82f6' }}
      />

      <div className="flex items-center justify-between mb-2 mt-1">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
          {shift.shiftType || 'STANDARD'}
        </span>
        <Clock className="w-4 h-4 text-slate-400" />
      </div>

      <h4 className="font-extrabold text-slate-900 text-sm">{shift.name}</h4>

      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
        <span className="font-mono font-bold text-slate-800">{shift.startTime?.slice(0, 5)} &ndash; {shift.endTime?.slice(0, 5)}</span>
        <span className="text-[11px] text-amber-700 font-semibold">{shift.gracePeriodMinutes || 15}m Grace</span>
      </div>
    </div>
  );
}

