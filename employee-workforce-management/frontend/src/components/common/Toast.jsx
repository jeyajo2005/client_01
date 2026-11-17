import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const themes = {
    success: 'bg-emerald-50 text-emerald-900 border-emerald-200 icon-emerald-600',
    error: 'bg-rose-50 text-rose-900 border-rose-200 icon-rose-600',
    info: 'bg-sky-50 text-sky-900 border-sky-200 icon-sky-600',
  };

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  };

  const Icon = icons[type] || CheckCircle2;

  return (
    <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold shadow-md ${themes[type] || themes.info}`}>
      <div className="flex items-center space-x-2.5">
        <Icon className="w-4 h-4 shrink-0" />
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} className="p-1 rounded hover:bg-black/5 ml-3">
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

