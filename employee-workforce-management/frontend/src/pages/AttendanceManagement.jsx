import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SelfieReviewModal from '../components/attendance/SelfieReviewModal';
import {
  CalendarCheck,
  Search,
  Filter,
  Download,
  Camera,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Edit,
  CheckCircle,
  X
} from 'lucide-react';

export default function AttendanceManagement() {
  const { user } = useAuth();
  const [attendanceList, setAttendanceList] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [gpsFilter, setGpsFilter] = useState('ALL');
  const [selectedRecordForSelfie, setSelectedRecordForSelfie] = useState(null);
  const [correctionRecord, setCorrectionRecord] = useState(null);
  const [correctionNotes, setCorrectionNotes] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadAttendance();
  }, [user]);

  const loadAttendance = async () => {
    const list = await api.getCompanyAttendance(user?.companyId || 1);
    setAttendanceList(list || []);
  };

  const handleExportCSV = () => {
    if (!attendanceList.length) return;
    const headers = ['Employee Name', 'Employee Code', 'Department', 'Date', 'Check-In', 'Check-Out', 'Status', 'Late Minutes', 'GPS Verified', 'Distance (m)'];
    const rows = attendanceList.map(a => [
      a.employeeName,
      a.employeeCode,
      a.department || 'General',
      a.attendanceDate,
      a.checkInTime || '-',
      a.checkOutTime || '-',
      a.status,
      a.lateMinutes || 0,
      a.checkInLocationVerified ? 'YES' : 'NO',
      a.checkInDistanceMeters || 0
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_Attendance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveCorrection = (e) => {
    e.preventDefault();
    if (!correctionRecord) return;

    const updated = attendanceList.map(a => {
      if (a.id === correctionRecord.id) {
        return {
          ...a,
          notes: (a.notes ? a.notes + ' | ' : '') + `HR Correction: ${correctionNotes}`,
          status: 'PRESENT',
          isLate: false
        };
      }
      return a;
    });

    setAttendanceList(updated);
    setNotification({ type: 'success', text: `Attendance corrected for ${correctionRecord.employeeName}` });
    setCorrectionRecord(null);
    setCorrectionNotes('');
  };

  const filteredAttendance = attendanceList.filter(a => {
    const matchesSearch =
      a.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
      a.employeeCode?.toLowerCase().includes(search.toLowerCase()) ||
      a.department?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'LATE' && a.isLate) ||
      (statusFilter === 'PRESENT' && !a.isLate && a.status === 'PRESENT');

    const matchesGps =
      gpsFilter === 'ALL' ||
      (gpsFilter === 'VERIFIED' && a.checkInLocationVerified) ||
      (gpsFilter === 'OUTSIDE' && !a.checkInLocationVerified);

    return matchesSearch && matchesStatus && matchesGps;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Attendance Master Log</h1>
          <p className="text-xs text-slate-500">Review employee daily check-in records, GPS geofence verifications, and selfie snapshots</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primaryLight text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 transition"
        >
          <Download className="w-4 h-4" />
          <span>Export Master CSV</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between">
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)} className="underline ml-4">Close</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by employee name, ID, or department..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="PRESENT">On-Time (Present)</option>
            <option value="LATE">Late Arrivals</option>
          </select>

          <select
            value={gpsFilter}
            onChange={(e) => setGpsFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium text-slate-700"
          >
            <option value="ALL">All GPS States</option>
            <option value="VERIFIED">Inside Office Geofence</option>
            <option value="OUTSIDE">Outside Office Radius</option>
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Date & Shift</th>
                <th className="py-3.5 px-4">Check-In</th>
                <th className="py-3.5 px-4">Check-Out</th>
                <th className="py-3.5 px-4">GPS Verification</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Selfie Audit</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAttendance.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{att.employeeName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{att.employeeCode} &bull; {att.department || 'Engineering'}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{att.attendanceDate}</div>
                    <div className="text-[11px] text-sky-600">{att.shiftName || 'Morning Shift'}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                    {att.checkInTime ? new Date(att.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                    {att.checkOutTime ? new Date(att.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (
                      <span className="text-emerald-600 font-bold font-sans">Active (In Office)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {att.checkInLocationVerified ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                        In Radius ({att.checkInDistanceMeters || 14}m)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
                        Outside ({att.checkInDistanceMeters || 800}m)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      att.isLate
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {att.isLate ? `Late (+${att.lateMinutes}m)` : att.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => setSelectedRecordForSelfie(att)}
                      className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs flex items-center space-x-1 border border-sky-200 transition"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Audit Selfie</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => { setCorrectionRecord(att); setCorrectionNotes(''); }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition"
                      title="Attendance Correction Request"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SELFIE REVIEW MODAL */}
      <SelfieReviewModal
        isOpen={!!selectedRecordForSelfie}
        onClose={() => setSelectedRecordForSelfie(null)}
        attendanceRecord={selectedRecordForSelfie}
      />

      {/* ATTENDANCE CORRECTION MODAL */}
      {correctionRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">HR Attendance Correction</h3>
              <button onClick={() => setCorrectionRecord(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Override late penalty or adjust verified status for <strong className="text-slate-800">{correctionRecord.employeeName}</strong> on {correctionRecord.attendanceDate}.
            </p>

            <form onSubmit={handleSaveCorrection} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Reason for HR Adjustment</label>
                <textarea
                  required
                  rows="3"
                  value={correctionNotes}
                  onChange={(e) => setCorrectionNotes(e.target.value)}
                  placeholder="e.g. Official transit breakdown confirmed; late mark waived by HR"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setCorrectionRecord(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-brand-primary hover:bg-brand-primaryLight rounded-lg shadow"
                >
                  Save Correction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
