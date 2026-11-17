import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon
}) {
  const base = 'inline-flex items-center justify-center font-bold rounded-xl transition shadow-xs focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed';

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-xs',
    lg: 'px-6 py-2.5 text-sm',
  };

  const variants = {
    primary: 'bg-gradient-to-r from-brand-primary to-brand-primaryLight hover:brightness-110 text-white shadow-md',
    secondary: 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md',
    ghost: 'text-slate-600 hover:bg-slate-100',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-1.5" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

