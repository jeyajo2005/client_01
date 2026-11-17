import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Users,
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HRDashboard() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [shiftRequests, setShiftRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadHRData();
  }, []);

  const loadHRData = async () => {
    setLoading(true);
    try {
      const [empList, leaveList, shiftList] = await Promise.all([
        api.getEmployees(1),
        api.getLeaves(1),
        api.getShiftRequests(1)
      ]);
      setEmployees(empList || []);
      setLeaves(leaveList || []);
      setShiftRequests(shiftList || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewLeave = async (leaveId, approve) => {
    try {
      await api.reviewLeave(leaveId, approve);
      setMessage({
        type: 'success',
        text: `Leave request ${approve ? 'Approved' : 'Rejected'} successfully.`
      });
      if (approve) confetti({ particleCount: 40, spread: 50 });
      await loadHRData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update leave status.' });
    }
  };

  const handleReviewShift = async (requestId, approve) => {
    try {
      await api.reviewShiftChange(requestId, approve);
      setMessage({
        type: 'success',
        text: `Shift request ${approve ? 'Approved' : 'Rejected'} successfully.`
      });
      if (approve) confetti({ particleCount: 40, spread: 50 });
      await loadHRData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update shift request.' });
    }
  };

  const pendingLeaves = leaves.filter(l => l.status === 'PENDING');
  const pendingShifts = shiftRequests.filter(s => s.status === 'PENDING');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-navy-800" />
            HR Manager Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Workforce overview, pending leave approvals, shift transitions, and attendance compliance
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          HR Operations Active
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium text-sm">{message.text}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Workforce</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{employees.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Pending Leaves</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pendingLeaves.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Shift Change Requests</p>
          <p className="text-2xl font-bold text-sky-600 mt-1">{pendingShifts.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Active Departments</p>
          <p className="text-2xl font-bold text-navy-900 mt-1">5</p>
        </div>
      </div>

      {/* Approval Queues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leave Requests */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-navy-800" />
              Pending Leave Approvals ({pendingLeaves.length})
            </h3>
          </div>

          {pendingLeaves.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No pending leave applications.</p>
          ) : (
            <div className="space-y-3">
              {pendingLeaves.map(leave => (
                <div key={leave.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{leave.employeeName}</p>
                    <p className="text-slate-500 mt-0.5">
                      <span className="font-semibold text-sky-700">{leave.leaveType}</span> ({leave.startDate} to {leave.endDate})
                    </p>
                    <p className="text-slate-600 italic mt-1">"{leave.reason}"</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleReviewLeave(leave.id, true)}
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReviewLeave(leave.id, false)}
                      className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-sm"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Shift Transitions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-navy-800" />
              Pending Shift Requests ({pendingShifts.length})
            </h3>
          </div>

          {pendingShifts.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No pending shift transition requests.</p>
          ) : (
            <div className="space-y-3">
              {pendingShifts.map(req => (
                <div key={req.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{req.employeeName}</p>
                    <p className="text-slate-500 mt-0.5">
                      Target: <span className="font-semibold text-navy-900">{req.targetShiftName}</span>
                    </p>
                    <p className="text-slate-600 italic mt-1">"{req.reason}"</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleReviewShift(req.id, true)}
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReviewShift(req.id, false)}
                      className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-sm"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

