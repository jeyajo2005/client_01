import React from 'react';

export default function BiometricFaceIcon({ className = "w-5 h-5 text-sky-600" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 8V5a2 2 0 0 1 2-2h3" />
      <path d="M4 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 4h3a2 2 0 0 1 2 2v3" />
      <path d="M16 20h3a2 2 0 0 0 2-2v-3" />
      <circle cx="12" cy="11" r="3" />
      <path d="M8.5 17c1-1.5 2.5-2 3.5-2s2.5.5 3.5 2" />
    </svg>
  );
}

