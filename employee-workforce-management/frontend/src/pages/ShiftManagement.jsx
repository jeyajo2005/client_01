import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Clock,
  Plus,
  CheckCircle,
  XCircle,
  UserCheck,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';

export default function ShiftManagement() {
  const { user, isEmployee } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // New Shift Form
  const [shiftForm, setShiftForm] = useState({
    name: '',
    shiftType: 'MORNING',
    startTime: '09:00',
    endTime: '17:00',
    gracePeriodMinutes: 15,
    colorCode: '#3b82f6'
  });

  // Request Form
  const [requestForm, setRequestForm] = useState({
    requestedShiftId: 2,
    effectiveDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    reason: ''
  });

  useEffect(() => {
    loadShiftsAndRequests();
  }, [user]);

  const loadShiftsAndRequests = async () => {
    const sList = await api.getShifts(user?.companyId || 1);
    setShifts(sList || []);

    const rList = await api.getShiftRequests(user?.companyId || 1);
    setRequests(rList || []);
  };

  const handleCreateShift = (e) => {
    e.preventDefault();
    const newShift = {
      id: shifts.length + 1,
      companyId: user?.companyId || 1,
      ...shiftForm,
      isActive: true
    };
    setShifts([...shifts, newShift]);
    setShowAddModal(false);
    setNotification({ type: 'success', text: `Shift '${shiftForm.name}' configured successfully` });
  };

  const handleReviewRequest = async (reqId, approve) => {
    try {
      await api.reviewShiftRequest(reqId, approve);
      setRequests(requests.map(r => r.id === reqId ? { ...r, status: approve ? 'APPROVED' : 'REJECTED' } : r));
      setNotification({ type: 'success', text: approve ? 'Shift request approved' : 'Shift request rejected' });
    } catch (err) {
      setNotification({ type: 'error', text: err.message });
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    try {
      const created = await api.requestShiftChange({
        employeeId: user?.employeeId || 1,
        requestedShiftId: requestForm.requestedShiftId,
        effectiveDate: requestForm.effectiveDate,
        reason: requestForm.reason
      });
      setRequests([created, ...requests]);
      setShowRequestModal(false);
      setNotification({ type: 'success', text: 'Shift change request submitted to HR' });
    } catch (err) {
      setNotification({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Shift Schedule & Requests</h1>
          <p className="text-xs text-slate-500">View company shifts, grace periods, and submit shift change applications</p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowRequestModal(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-brand-primary text-white font-bold text-xs rounded-xl shadow-md hover:bg-brand-primaryLight transition text-center cursor-pointer"
          >
            Request Shift Change
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between">
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)} className="underline ml-4">Close</button>
        </div>
      )}

      {/* SHIFT SCHEDULE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {shifts.map((shift) => (
          <div
            key={shift.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card hover:shadow-card-hover transition relative overflow-hidden flex flex-col justify-between"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: shift.colorCode || '#3b82f6' }}
            />

            <div>
              <div className="flex items-center justify-between mt-1 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  {shift.shiftType}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Active Shift" />
              </div>

              <h3 className="text-base font-extrabold text-slate-900">{shift.name}</h3>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500">Working Hours:</span>
                  <span className="font-bold font-mono text-slate-900">{shift.startTime.slice(0, 5)} &ndash; {shift.endTime.slice(0, 5)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-500">Grace Allowance:</span>
                  <span className="font-semibold text-amber-700">{shift.gracePeriodMinutes} mins</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Automatic late detection</span>
              <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: shift.colorCode }} />
            </div>
          </div>
        ))}
      </div>

      {/* SHIFT TRANSITION REQUESTS QUEUE */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Shift Change Applications</h3>
            <p className="text-xs text-slate-500">Employee schedule change requests awaiting management decision</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {requests.length} Requests
          </span>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-[650px] w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Current Shift</th>
                <th className="py-3 px-4">Requested Shift</th>
                <th className="py-3 px-4">Effective Date</th>
                <th className="py-3 px-4">Reason</th>
                <th className="py-3 px-4">Status</th>
                {!isEmployee && <th className="py-3 px-4 text-right">Review Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {r.employeeName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {r.currentShift || 'Morning Shift'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-sky-700">
                    {r.requestedShift}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                    {r.effectiveDate}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs text-slate-600 truncate" title={r.reason}>
                    {r.reason}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      r.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      r.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  {!isEmployee && (
                    <td className="py-3.5 px-4 text-right">
                      {r.status === 'PENDING' ? (
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleReviewRequest(r.id, true)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReviewRequest(r.id, false)}
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

      {/* CREATE SHIFT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Define New Shift</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShift} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Shift Name</label>
                <input
                  type="text"
                  required
                  value={shiftForm.name}
                  onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })}
                  placeholder="e.g. European Overlap Shift"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={shiftForm.startTime}
                    onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={shiftForm.endTime}
                    onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Grace Period (Mins)</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={shiftForm.gracePeriodMinutes}
                    onChange={(e) => setShiftForm({ ...shiftForm, gracePeriodMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Tag Color</label>
                  <input
                    type="color"
                    value={shiftForm.colorCode}
                    onChange={(e) => setShiftForm({ ...shiftForm, colorCode: e.target.value })}
                    className="w-full h-9 p-1 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-brand-primary hover:bg-brand-primaryLight rounded-xl shadow"
                >
                  Save Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST SHIFT CHANGE MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Request Shift Change</h3>
              <button onClick={() => setShowRequestModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Requested Target Shift</label>
                <select
                  value={requestForm.requestedShiftId}
                  onChange={(e) => setRequestForm({ ...requestForm, requestedShiftId: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                >
                  {shifts.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.startTime.slice(0, 5)} - {s.endTime.slice(0, 5)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Effective Date</label>
                <input
                  type="date"
                  required
                  value={requestForm.effectiveDate}
                  onChange={(e) => setRequestForm({ ...requestForm, effectiveDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Reason for Request</label>
                <textarea
                  required
                  rows="3"
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                  placeholder="Explain why the shift schedule adjustment is needed..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-brand-primary hover:bg-brand-primaryLight rounded-xl shadow"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
