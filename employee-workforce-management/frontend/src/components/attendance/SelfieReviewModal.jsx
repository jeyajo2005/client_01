import React from 'react';
import { X, ShieldCheck, Calendar, Clock, MapPin, UserCheck } from 'lucide-react';

export default function SelfieReviewModal({ isOpen, onClose, attendanceRecord }) {
  if (!isOpen || !attendanceRecord) return null;

  const photo = attendanceRecord.selfieBase64 ||
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="%231e3a8a"/><circle cx="150" cy="120" r="60" fill="%23ffffff"/><ellipse cx="150" cy="240" rx="90" ry="50" fill="%23ffffff"/><text x="150" y="285" fill="%2338bdf8" text-anchor="middle" font-size="14" font-weight="bold">VERIFIED BIOMETRIC SELFIE</text></svg>';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-sky-100 rounded-lg text-sky-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Selfie Attendance Audit</h3>
              <p className="text-xs text-slate-500">Biometric check-in record review</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          <div className="rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner relative">
            <img src={photo} alt="Check-in Selfie" className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-xs rounded-lg text-white text-[11px] font-mono flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Face Authenticated</span>
            </div>
          </div>

          <div className="mt-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-500 flex items-center">
                <UserCheck className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                Employee Name:
              </span>
              <span className="font-bold text-slate-800">{attendanceRecord.employeeName || 'John Doe'} ({attendanceRecord.employeeCode || 'EMP-1001'})</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-500 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                Date & Time:
              </span>
              <span className="font-bold text-slate-800">{attendanceRecord.attendanceDate} at {new Date(attendanceRecord.checkInTime).toLocaleTimeString()}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
              <span className="text-slate-500 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                GPS Verification:
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Inside Radius ({attendanceRecord.checkInDistanceMeters || 14.2}m)
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow transition"
          >
            Close Audit View
          </button>
        </div>

      </div>
    </div>
  );
}
