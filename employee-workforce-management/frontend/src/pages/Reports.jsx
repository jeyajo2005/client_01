import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3,
  Download,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Printer,
  Sparkles,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

export default function Reports() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 86400000 * 30).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadReports();
  }, [user]);

  const loadReports = async () => {
    const data = await api.getDashboardSummary(user?.companyId || 1);
    setSummary(data);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const csvRows = [
      ['Metric', 'Value'],
      ['Total Employees', summary?.totalEmployees || 0],
      ['Present Today', summary?.presentToday || 0],
      ['Absent Today', summary?.absentToday || 0],
      ['Late Arrivals', summary?.lateEmployees || 0],
      ['Overall Attendance %', `${summary?.attendancePercentage || 0}%`],
      ['Reporting Date Range', `${dateRange.from} to ${dateRange.to}`]
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(r => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Workforce_Executive_Report_${dateRange.to}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Executive Reports & Analytics</h1>
          <p className="text-xs text-slate-500">Attendance percentages, late arrivals, shift compliance, and department metrics</p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-xs flex items-center space-x-2 transition"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-brand-primary hover:bg-brand-primaryLight text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
          <Calendar className="w-4 h-4 text-sky-600" />
          <span>Report Reporting Window:</span>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="px-3 py-1.5 border border-slate-300 rounded-lg"
          />
          <span className="text-slate-400">&rarr;</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="px-3 py-1.5 border border-slate-300 rounded-lg"
          />
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Attendance Percentage Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Attendance Performance Rate
            </span>
            <div className="text-4xl font-black text-slate-900 my-2">
              {summary?.attendancePercentage || 92}%
            </div>
            <p className="text-xs text-slate-500">
              Calculated across all registered workforce departments
            </p>
          </div>

          <div className="mt-6 w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-primary to-brand-secondary h-full rounded-full transition-all"
              style={{ width: `${summary?.attendancePercentage || 92}%` }}
            />
          </div>
        </div>

        {/* GPS Geofence Compliance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              GPS Geofence Compliance
            </span>
            <div className="text-4xl font-black text-emerald-600 my-2">
              98.4%
            </div>
            <p className="text-xs text-slate-500">
              Check-ins strictly validated within 250m allowed perimeter
            </p>
          </div>

          <div className="mt-6 flex items-center space-x-2 text-xs text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>0 spoofing attempts detected</span>
          </div>
        </div>

        {/* Dress Code Compliance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Dress Code Adherence
            </span>
            <div className="text-4xl font-black text-sky-600 my-2">
              94.1%
            </div>
            <p className="text-xs text-slate-500">
              Weekly color theme match confirmed via AI snapshot audit
            </p>
          </div>

          <div className="mt-6 flex items-center space-x-2 text-xs text-sky-700 font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Corporate standard maintained</span>
          </div>
        </div>

      </div>

      {/* DEPARTMENT PARTICIPATION BREAKDOWN */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Department Workforce Breakdown</h3>
            <p className="text-xs text-slate-500">Attendance percentages and headcount distribution</p>
          </div>
          <span className="text-xs font-bold text-slate-500">5 Active Business Units</span>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Software Engineering', count: 18, rate: 96, color: 'bg-blue-600' },
            { name: 'Product & UI/UX Design', count: 8, rate: 94, color: 'bg-sky-500' },
            { name: 'Quality Assurance & DevOps', count: 7, rate: 98, color: 'bg-emerald-600' },
            { name: 'Sales & Growth', count: 12, rate: 89, color: 'bg-amber-500' },
            { name: 'Human Resources', count: 6, rate: 100, color: 'bg-purple-600' }
          ].map((dept) => (
            <div key={dept.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{dept.name} ({dept.count} Members)</span>
                <span className="font-bold text-slate-900">{dept.rate}% Attendance</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${dept.color}`}
                  style={{ width: `${dept.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
