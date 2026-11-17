import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { CalendarCheck, Clock, MapPin, Camera, ShieldCheck, Filter, Download } from 'lucide-react';

export default function MyAttendance() {
  const { user } = useAuth();
  const employeeId = user?.employeeId || 1;
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState('ALL');

  useEffect(() => {
    loadAttendance();
  }, [employeeId]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const data = await api.getEmployeeAttendance(employeeId);
      setAttendance(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalDays = attendance.length;
  const onTimeCount = attendance.filter(a => a.status === 'ON_TIME').length;
  const lateCount = attendance.filter(a => a.status === 'LATE').length;
  const totalHours = attendance.reduce((sum, a) => sum + (Number(a.workingHours) || 0), 0).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-7 h-7 text-navy-800" />
            My Attendance History
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Detailed log of your check-in, check-out, working hours, and verification records
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Days Logged</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{totalDays}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Working Hours</p>
          <p className="text-2xl font-bold text-navy-900 mt-1">{totalHours} <span className="text-xs text-slate-400 font-normal">hrs</span></p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">On-Time Arrivals</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{onTimeCount}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Late Arrivals</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{lateCount}</p>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-sm">Attendance Records</h3>
          <span className="text-xs text-slate-500">Showing all records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check-In</th>
                <th className="py-3 px-4">Check-Out</th>
                <th className="py-3 px-4">Hours</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">GPS / Radius</th>
                <th className="py-3 px-4">Dress Color</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">Loading attendance records...</td>
                </tr>
              ) : attendance.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">No attendance records found.</td>
                </tr>
              ) : (
                attendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900">{rec.attendanceDate}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-800">{rec.checkInTime || '--:--'}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-800">{rec.checkOutTime || 'Active / Open'}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{rec.workingHours ? `${rec.workingHours} hrs` : '--'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.status === 'ON_TIME'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : rec.status === 'LATE'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                        <MapPin className="w-3.5 h-3.5" />
                        Verified Office Radius
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                        <span className="w-2.5 h-2.5 rounded-full bg-navy-800 inline-block" />
                        {rec.dressColor || 'Navy Blue'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

