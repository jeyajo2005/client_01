import React from 'react';
import { MapPin, Navigation, ShieldCheck } from 'lucide-react';

export default function OfficeLocationCard({ location, onSelect, isSelected = false }) {
  if (!location) return null;

  return (
    <div
      onClick={onSelect}
      className={`p-5 rounded-2xl border transition-all cursor-pointer ${
        isSelected
          ? 'border-sky-500 bg-sky-50/50 shadow-md ring-1 ring-sky-500'
          : 'border-slate-200 bg-white hover:border-slate-300 shadow-card'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="p-2 rounded-xl bg-sky-100 text-sky-700">
          <MapPin className="w-4 h-4" />
        </span>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
          {location.radiusMeters || 200}m Radius
        </span>
      </div>

      <h4 className="font-extrabold text-slate-900 text-sm">{location.name}</h4>
      <p className="text-xs text-slate-500 mt-0.5 truncate">{location.address}</p>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>{Number(location.latitude).toFixed(5)}, {Number(location.longitude).toFixed(5)}</span>
        <span className="text-sky-600 font-bold font-sans">Geofence Active</span>
      </div>
    </div>
  );
}

