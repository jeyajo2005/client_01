import React from 'react';
import { Camera, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function AttendanceLogTable({ records = [], onReviewSelfie, onCorrect }) {
  if (!records.length) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No attendance records found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-600">
        <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
          <tr>
            <th className="py-3 px-4">Employee</th>
            <th className="py-3 px-4">Date & Shift</th>
            <th className="py-3 px-4">Check-In</th>
            <th className="py-3 px-4">Check-Out</th>
            <th className="py-3 px-4">GPS Radius</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Selfie Audit</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.map((a) => (
            <tr key={a.id} className="hover:bg-slate-50/70 transition">
              <td className="py-3.5 px-4 font-bold text-slate-900">
                <div>{a.employeeName}</div>
                <div className="text-[11px] text-slate-400 font-mono font-normal">{a.employeeCode}</div>
              </td>
              <td className="py-3.5 px-4">
                <div className="font-semibold text-slate-800">{a.attendanceDate}</div>
                <div className="text-[11px] text-sky-600">{a.shiftName || 'Morning Shift'}</div>
              </td>
              <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                {a.checkInTime ? new Date(a.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
              </td>
              <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                {a.checkOutTime ? new Date(a.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (
                  <span className="text-emerald-600 font-bold font-sans">Active (In Office)</span>
                )}
              </td>
              <td className="py-3.5 px-4">
                {a.checkInLocationVerified ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                    In Radius ({a.checkInDistanceMeters || 14}m)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
                    Outside ({a.checkInDistanceMeters || 800}m)
                  </span>
                )}
              </td>
              <td className="py-3.5 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  a.isLate ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {a.isLate ? `Late (+${a.lateMinutes}m)` : a.status}
                </span>
              </td>
              <td className="py-3.5 px-4 text-right">
                {onReviewSelfie && (
                  <button
                    onClick={() => onReviewSelfie(a)}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs inline-flex items-center space-x-1 border border-sky-200 transition"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Audit Selfie</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

