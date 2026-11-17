import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StatCard from '../components/common/StatCard';
import SelfieReviewModal from '../components/attendance/SelfieReviewModal';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Coffee,
  CalendarCheck,
  Shirt,
  MapPin,
  Download,
  Filter,
  Camera,
  Search,
  ShieldCheck,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecordForSelfie, setSelectedRecordForSelfie] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    setLoading(true);
    const data = await api.getDashboardSummary(user?.companyId || 1);
    setSummary(data);
    setLoading(false);
  };

  const handleExportCSV = () => {
    if (!summary?.recentCheckIns?.length) return;
    const headers = ['Employee Name', 'Employee Code', 'Department', 'Check-In Time', 'Status', 'Late Minutes', 'GPS Verified', 'Distance (m)'];
    const rows = summary.recentCheckIns.map(c => [
      c.employeeName,
      c.employeeCode,
      c.department,
      c.checkInTime,
      c.status,
      c.lateMinutes || 0,
      c.locationVerified ? 'YES' : 'NO',
      c.distanceMeters || 0
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCheckIns = summary?.recentCheckIns?.filter(c =>
    c.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.department.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Executive Analytics Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Workforce Intelligence
          </h1>
          <p className="text-xs text-slate-500">
            Real-time biometric attendance, GPS geofence compliance, and department operational stats
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV Report</span>
          </button>
          <button
            onClick={loadDashboard}
            className="px-4 py-2.5 bg-brand-primary hover:bg-brand-primaryLight text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-2 transition"
          >
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {/* 7 KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={summary?.totalEmployees || 0}
          icon={Users}
          trend="+4.2%"
          trendLabel="Active on payroll"
          color="blue"
        />
        <StatCard
          title="Present Today"
          value={summary?.presentToday || 0}
          icon={UserCheck}
          trend={`${summary?.attendancePercentage || 0}%`}
          trendLabel="Attendance Rate"
          color="emerald"
        />
        <StatCard
          title="Absent Today"
          value={summary?.absentToday || 0}
          icon={UserX}
          trendLabel="Approved leaves & offline"
          color="rose"
        />
        <StatCard
          title="Late Arrivals"
          value={summary?.lateEmployees || 0}
          icon={Clock}
          trendLabel="Punched after grace period"
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Employees on Break"
          value={summary?.employeesOnBreak || 0}
          icon={Coffee}
          trendLabel="Tea, lunch, or meetings"
          color="amber"
        />
        <StatCard
          title="Active Shifts"
          value={summary?.activeShifts || 4}
          icon={CalendarCheck}
          trendLabel="Morning, Afternoon, Night"
          color="purple"
        />
        <StatCard
          title="Attendance Score"
          value={`${summary?.attendancePercentage || 0}%`}
          icon={ShieldCheck}
          trend="+2.5%"
          trendLabel="Company performance"
          color="sky"
        />
      </div>

      {/* TODAY'S DRESS CODE AND GEOFENCE HIGHLIGHT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Dress Code Policy Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className="w-12 h-12 rounded-2xl border-2 border-white shadow-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: summary?.todayDressCode?.colorHex || '#1e3a8a' }}
            >
              <Shirt className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Today's Company Dress Theme
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                {summary?.todayDressCode?.colorName || 'Navy Blue'}
              </h3>
              <p className="text-xs text-slate-500">{summary?.todayDressCode?.description || 'Corporate professional formal attire'}</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold shrink-0">
            94% Compliant
          </span>
        </div>

        {/* Office Geofencing Status Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Office Geofence Security
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                TechCorp Headquarters
              </h3>
              <p className="text-xs text-slate-500">250m perimeter &bull; 98.2% in-radius punch verification</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold shrink-0">
            Active Fence
          </span>
        </div>

      </div>

      {/* RECENT CHECK-INS MASTER STREAM TABLE */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
        
        {/* Table Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Live Attendance & Punch Stream</h3>
            <p className="text-xs text-slate-500">Real-time check-ins with verified selfie snapshots and GPS coordinates</p>
          </div>

          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search employee or dept..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Attendance Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4">GPS Verification</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Biometric Selfie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCheckIns.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No matching check-in records found
                  </td>
                </tr>
              ) : (
                filteredCheckIns.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{item.employeeName}</div>
                      <div className="text-[11px] text-slate-400 font-mono font-normal">{item.employeeCode}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {item.department}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                      {new Date(item.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.locationVerified ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                          In Office ({item.distanceMeters || 14}m)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Out of Radius ({item.distanceMeters || 800}m)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        item.isLate
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {item.isLate ? `Late (+${item.lateMinutes}m)` : item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setSelectedRecordForSelfie(item)}
                        className="px-3 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center space-x-1 border border-sky-200 transition"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>View Selfie</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* SELFIE REVIEW AUDIT MODAL */}
      <SelfieReviewModal
        isOpen={!!selectedRecordForSelfie}
        onClose={() => setSelectedRecordForSelfie(null)}
        attendanceRecord={selectedRecordForSelfie}
      />

    </div>
  );
}
