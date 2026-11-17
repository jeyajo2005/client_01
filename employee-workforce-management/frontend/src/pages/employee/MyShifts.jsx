import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Clock, Calendar, CheckCircle2, AlertCircle, Send, ArrowRight, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MyShifts() {
  const { user } = useAuth();
  const employeeId = user?.employeeId || 1;
  const [shifts, setShifts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [targetShiftId, setTargetShiftId] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadShiftsData();
  }, []);

  const loadShiftsData = async () => {
    try {
      const allShifts = await api.getShifts(1);
      setShifts(allShifts || []);
      if (allShifts && allShifts.length > 0) {
        setTargetShiftId(allShifts[0].id);
      }
      const reqList = await api.getShiftRequests(1);
      setRequests(reqList || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setMessage({ type: 'error', text: 'Please enter a valid reason for the shift change.' });
      return;
    }
    setSubmitting(true);
    setMessage(null);
    try {
      await api.requestShiftChange({
        employeeId,
        currentShiftId: 1,
        requestedShiftId: Number(targetShiftId),
        reason
      });
      setMessage({ type: 'success', text: 'Shift change request submitted successfully to HR.' });
      setReason('');
      confetti({ particleCount: 50, spread: 60 });
      await loadShiftsData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to submit shift change request.' });
    } finally {
      setSubmitting(false);
    }
  };

  const currentShift = shifts.find(s => s.id === 1) || shifts[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-7 h-7 text-navy-800" />
            My Shift & Schedule
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            View assigned shift timings, weekly rota, and request shift transitions
          </p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="font-medium text-sm">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Current Assigned Shift */}
        <div className="lg:col-span-5 bg-gradient-to-br from-navy-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-sky-400 font-bold">Current Assigned Shift</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full font-semibold">
                Active
              </span>
            </div>
            <h2 className="text-2xl font-bold mt-4">{currentShift?.name || 'Morning Shift'}</h2>
            <p className="text-slate-300 text-sm mt-1">Standard 8-Hour Professional Rota</p>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/10 text-sm">
                <span className="text-slate-400">Shift Timings</span>
                <span className="font-mono font-bold text-white">{currentShift?.startTime} - {currentShift?.endTime}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10 text-sm">
                <span className="text-slate-400">Grace Period</span>
                <span className="font-semibold text-white">{currentShift?.gracePeriodMinutes || 15} minutes</span>
              </div>
              <div className="flex items-center justify-between py-2 text-sm">
                <span className="text-slate-400">Total Work Duration</span>
                <span className="font-semibold text-white">8.0 Hours</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Location: HQ Tech Park</span>
            <span>Mon - Fri</span>
          </div>
        </div>

        {/* Request Shift Transition */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 text-base mb-1">Request Shift Transition</h2>
          <p className="text-slate-500 text-xs mb-5">Submit a formal request to your HR manager to switch shifts</p>

          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Shift</label>
              <select
                value={targetShiftId}
                onChange={(e) => setTargetShiftId(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white"
              >
                {shifts.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.startTime} - {s.endTime})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Reason for Request</label>
              <textarea
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain the reason for requesting this shift change..."
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-900"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-navy-900 hover:bg-navy-800 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Submitting Request...' : 'Submit Shift Change Request'}
            </button>
          </form>
        </div>
      </div>

      {/* Shift Request History */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 text-sm mb-3">Recent Shift Requests</h3>
        {requests.length === 0 ? (
          <p className="text-xs text-slate-400">No shift requests submitted.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {requests.map(req => (
              <div key={req.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800">{req.targetShiftName || 'Target Shift'}</p>
                  <p className="text-slate-500 mt-0.5">{req.reason}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                  req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                  req.status === 'REJECTED' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

