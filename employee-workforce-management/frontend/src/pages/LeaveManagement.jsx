import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  CalendarDays,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  AlertCircle,
  X
} from 'lucide-react';

export default function LeaveManagement() {
  const { user, isEmployee } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    leaveType: 'CASUAL',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    loadLeaves();
  }, [user]);

  const loadLeaves = async () => {
    const list = await api.getLeaves(user?.companyId || 1);
    setLeaves(list || []);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      const created = await api.applyLeave({
        employeeId: user?.employeeId || 1,
        ...formData
      });
      setLeaves([created, ...leaves]);
      setShowApplyModal(false);
      setFormData({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
      setNotification({ type: 'success', text: 'Leave application submitted for approval' });
    } catch (err) {
      setNotification({ type: 'error', text: err.message });
    }
  };

  const handleReview = async (leaveId, approve) => {
    try {
      await api.reviewLeave(leaveId, approve);
      setLeaves(leaves.map(l => l.id === leaveId ? { ...l, status: approve ? 'APPROVED' : 'REJECTED' } : l));
      setNotification({ type: 'success', text: approve ? 'Leave application approved' : 'Leave application rejected' });
    } catch (err) {
      setNotification({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Leave Management</h1>
          <p className="text-xs text-slate-500">Submit time-off requests, view leave balances, and track approval status</p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="w-full sm:w-auto px-5 py-2.5 bg-brand-primary hover:bg-brand-primaryLight text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {notification && (
        <div className="p-4 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between">
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)} className="underline ml-4">Close</button>
        </div>
      )}

      {/* LEAVE BALANCES OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-card">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Casual Leave</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900">8 / 12</div>
          <span className="text-[10px] sm:text-[11px] text-slate-400">Days Remaining</span>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-card">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Sick Leave</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900">10 / 10</div>
          <span className="text-[10px] sm:text-[11px] text-slate-400">Days Remaining</span>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-card">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Annual Vacation</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900">14 / 18</div>
          <span className="text-[10px] sm:text-[11px] text-slate-400">Days Remaining</span>
        </div>
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-card">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Pending Approval</span>
          <div className="text-xl sm:text-2xl font-black text-amber-600">
            {leaves.filter(l => l.status === 'PENDING').length}
          </div>
          <span className="text-[10px] sm:text-[11px] text-slate-400">Applications</span>
        </div>
      </div>

      {/* LEAVE APPLICATIONS TABLE */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Leave Applications Queue</h3>
            <p className="text-xs text-slate-500">Review time-off details, dates, and justifications</p>
          </div>
          <span className="text-xs font-bold text-slate-500">{leaves.length} Applications</span>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-[650px] w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Total Days</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                {!isEmployee && <th className="py-3 px-4 text-right">Review Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaves.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {l.employeeName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-slate-100 text-slate-700">
                      {l.leaveType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                    {l.startDate} &rarr; {l.endDate}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {l.totalDays || 1} {l.totalDays === 1 ? 'day' : 'days'}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs text-slate-600 truncate" title={l.reason}>
                    {l.reason}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      l.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      l.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  {!isEmployee && (
                    <td className="py-3.5 px-4 text-right">
                      {l.status === 'PENDING' ? (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleReview(l.id, true)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReview(l.id, false)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold text-xs border border-rose-200"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Resolved</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* APPLY LEAVE MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Submit Leave Application</h3>
              <button onClick={() => setShowApplyModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Leave Category</label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                >
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave (Health)</option>
                  <option value="ANNUAL">Annual Paid Vacation</option>
                  <option value="UNPAID">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Detailed Reason</label>
                <textarea
                  required
                  rows="3"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Describe reason for time-off..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-brand-primary hover:bg-brand-primaryLight rounded-xl shadow"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
