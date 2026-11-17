import React from 'react';
import { Shirt, Sparkles } from 'lucide-react';

export default function DressPolicyCard({ policy, isToday = false }) {
  if (!policy) return null;

  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      isToday
        ? 'border-sky-500 bg-sky-50/40 shadow-md ring-1 ring-sky-500'
        : 'border-slate-200 bg-white shadow-card'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
          {policy.dayOfWeek}
        </span>
        {isToday && (
          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-sky-600 text-white">
            Today
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2.5 mb-2">
        <span
          className="w-4 h-4 rounded-full border border-slate-300 shadow-xs shrink-0"
          style={{ backgroundColor: policy.colorHex }}
        />
        <h4 className="font-extrabold text-slate-900 text-sm truncate">{policy.colorName}</h4>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed mb-3">
        {policy.description}
      </p>

      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span className="px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700">
          {policy.isMandatory ? 'Mandatory' : 'Optional'}
        </span>
        <span className="font-mono text-slate-400">{policy.colorHex}</span>
      </div>
    </div>
  );
}

