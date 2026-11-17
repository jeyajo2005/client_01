import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import LiveCameraModal from '../components/attendance/LiveCameraModal';
import GeolocationCard from '../components/attendance/GeolocationCard';
import DressCodeCard from '../components/attendance/DressCodeCard';
import BreakWidget from '../components/attendance/BreakWidget';
import {
  CalendarCheck,
  Camera,
  CheckCircle,
  Clock,
  MapPin,
  Shirt,
  Calendar,
  AlertTriangle,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [employeeId] = useState(user?.employeeId || 1);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [workStatus, setWorkStatus] = useState(user?.workStatus || 'WORKING');
  const [selfieImage, setSelfieImage] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [gpsData, setGpsData] = useState(null);
  const [selectedDress, setSelectedDress] = useState({ name: 'Navy Blue', hex: '#1e3a8a' });
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // Modals for requests
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [shiftReason, setShiftReason] = useState('');
  const [leaveData, setLeaveData] = useState({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });

  useEffect(() => {
    loadData();
  }, [employeeId]);

  const loadData = async () => {
    const list = await api.getEmployeeAttendance(employeeId);
    setAttendanceHistory(list || []);

    const todayStr = new Date().toISOString().split('T')[0];
    const today = list?.find(a => a.attendanceDate === todayStr);
    setTodayAttendance(today || null);

    if (today && !today.checkOutTime) {
      setWorkStatus('WORKING');
    } else if (today && today.checkOutTime) {
      setWorkStatus('COMPLETED');
    } else {
      setWorkStatus('OFFLINE');
    }
  };

  const handleCheckIn = async () => {
    if (!selfieImage) {
      setIsCameraOpen(true);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        employeeId,
        latitude: gpsData?.latitude || 37.774929,
        longitude: gpsData?.longitude || -122.419416,
        selfieBase64: selfieImage,
        dressColorName: selectedDress.name,
        dressColorHex: selectedDress.hex,
        notes: 'Check-in verified with live camera and GPS'
      };

      const record = await api.checkIn(payload);
      setTodayAttendance(record);
      setWorkStatus('WORKING');
      setActionMessage({ type: 'success', text: 'Checked in successfully! Have a great workday.' });

      // Celebration effect
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      loadData();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Check-in failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const payload = {
        employeeId,
        latitude: gpsData?.latitude || 37.774929,
        longitude: gpsData?.longitude || -122.419416,
        selfieBase64: selfieImage,
        notes: 'Check-out completed'
      };

      const record = await api.checkOut(payload);
      setTodayAttendance(record);
      setWorkStatus('COMPLETED');
      setActionMessage({ type: 'success', text: 'Checked out successfully. Rest well!' });
      loadData();
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message || 'Check-out failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleStartBreak = async ({ breakType, notes }) => {
    try {
      await api.startBreak({ employeeId, breakType, notes });
      setWorkStatus('ON_BREAK');
      setActionMessage({ type: 'success', text: `Break started: ${breakType}` });
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    }
  };

  const handleEndBreak = async () => {
    try {
      await api.endBreak(employeeId);
      setWorkStatus('WORKING');
      setActionMessage({ type: 'success', text: 'Break ended. Welcome back to work!' });
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    }
  };

  const handleSubmitShiftRequest = async (e) => {
    e.preventDefault();
    try {
      await api.requestShiftChange({
        employeeId,
        requestedShiftId: 2,
        effectiveDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        reason: shiftReason || 'Shift schedule adjustment request'
      });
      setShowShiftModal(false);
      setShiftReason('');
      setActionMessage({ type: 'success', text: 'Shift change request sent to HR for approval.' });
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    }
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    try {
      await api.applyLeave({
        employeeId,
        leaveType: leaveData.leaveType,
        startDate: leaveData.startDate,
        endDate: leaveData.endDate,
        reason: leaveData.reason
      });
      setShowLeaveModal(false);
      setLeaveData({ leaveType: 'CASUAL', startDate: '', endDate: '', reason: '' });
      setActionMessage({ type: 'success', text: 'Leave application submitted for approval.' });
    } catch (err) {
      setActionMessage({ type: 'error', text: err.message });
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      
      {/* Header Greeting & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-brand-primary to-brand-primaryLight rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-sky-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Employee Self-Service Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Hello, {user?.fullName || 'John Doe'}
          </h1>
          <p className="text-xs text-sky-100 mt-1">
            Assigned: <span className="font-semibold text-white">Morning Shift (09:00 - 17:00)</span> &bull; Location: <span className="font-semibold text-white">TechPark HQ</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => setShowLeaveModal(true)}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold backdrop-blur-md border border-white/20 transition shadow-xs text-center cursor-pointer"
          >
            Apply for Leave
          </button>
          <button
            onClick={() => setShowShiftModal(true)}
            className="px-4 py-2.5 bg-white text-brand-primary hover:bg-sky-50 rounded-xl text-xs font-bold transition shadow-md text-center cursor-pointer"
          >
            Request Shift Change
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {actionMessage && (
        <div className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between border ${
          actionMessage.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <span>{actionMessage.text}</span>
          <button onClick={() => setActionMessage(null)} className="underline text-[11px] ml-4 cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* HERO ATTENDANCE PUNCH CARD */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Punch Status & Details */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-brand-primary to-sky-500 text-white flex items-center justify-center shadow-md shrink-0">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Attendance</span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                {todayAttendance?.checkInTime
                  ? `Checked In at ${new Date(todayAttendance.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : 'Ready for Check-In'}
              </h2>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Attendance requires <strong className="text-slate-900">GPS geofence radius validation</strong> and a <strong className="text-slate-900">live camera selfie snapshot</strong>. No continuous tracking is used.
          </p>

          {/* Verification checklist pills */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs">
            <span className={`px-2.5 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 border ${
              gpsData?.isVerified
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              <MapPin className="w-3.5 h-3.5" />
              <span>GPS: {gpsData?.isVerified ? `Verified (${gpsData.distanceMeters}m)` : 'Checking GPS...'}</span>
            </span>

            <span className={`px-2.5 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 border ${
              selfieImage
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              <Camera className="w-3.5 h-3.5" />
              <span>Selfie: {selfieImage ? 'Live Snapshot Ready' : 'Pending Capture'}</span>
            </span>

            <span className="px-2.5 py-1.5 rounded-xl font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center space-x-1.5">
              <Shirt className="w-3.5 h-3.5" />
              <span>Dress: {selectedDress.name}</span>
            </span>
          </div>

          {/* Main Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            {!todayAttendance?.checkInTime ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-sky-600" />
                  <span>{selfieImage ? 'Retake Selfie' : '1. Take Live Selfie'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCheckIn}
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-extrabold shadow-lg flex items-center justify-center space-x-2 transition transform active:scale-98 cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{loading ? 'Processing...' : '2. Check In Now'}</span>
                </button>
              </>
            ) : !todayAttendance?.checkOutTime ? (
              <button
                type="button"
                onClick={handleCheckOut}
                disabled={loading}
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:brightness-110 text-white text-xs font-extrabold shadow-lg flex items-center justify-center space-x-2 transition transform active:scale-98 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>{loading ? 'Processing...' : 'Check Out for Today'}</span>
              </button>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Shift Complete! Checked out at {new Date(todayAttendance.checkOutTime).toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Selfie Preview Viewport */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-700 shadow-md flex items-center justify-center">
            {selfieImage ? (
              <img src={selfieImage} alt="Selfie" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-4">
                <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500 mx-auto mb-2" />
                <span className="text-xs text-slate-400 font-medium">No Selfie Captured Yet</span>
              </div>
            )}
            {selfieImage && (
              <div className="absolute bottom-2 inset-x-2 py-1 bg-black/60 backdrop-blur-xs rounded text-white text-[10px] text-center font-mono">
                Face Verified
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCameraOpen(true)}
            className="mt-3 text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center space-x-1 cursor-pointer"
          >
            <span>{selfieImage ? 'Change Photo' : 'Activate Camera'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* THREE COLUMN DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        
        {/* 1. Geolocation Verification */}
        <GeolocationCard
          onLocationChange={(loc) => setGpsData(loc)}
        />

        {/* 2. Today's Dress Code & Selection */}
        <DressCodeCard
          selectedColor={selectedDress}
          onColorSelect={(c) => setSelectedDress(c)}
        />

        {/* 3. Work Status & Break Logger */}
        <BreakWidget
          workStatus={workStatus}
          onStartBreak={handleStartBreak}
          onEndBreak={handleEndBreak}
        />

      </div>

      {/* RECENT PERSONAL ATTENDANCE LOG */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">My Attendance History</h3>
            <p className="text-xs text-slate-500">Record of recent punches, working hours, and location verification</p>
          </div>
          <span className="text-xs font-bold text-slate-500">{attendanceHistory.length} Days Logged</span>
        </div>

        <div className="mt-4 -mx-4 sm:mx-0 overflow-x-auto">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <table className="min-w-[650px] w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Check-In</th>
                  <th className="py-3 px-4">Check-Out</th>
                  <th className="py-3 px-4">Work Time</th>
                  <th className="py-3 px-4">GPS Verification</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Selfie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceHistory.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">
                      {att.attendanceDate}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium whitespace-nowrap">
                      {att.checkInTime ? new Date(att.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium whitespace-nowrap">
                      {att.checkOutTime ? new Date(att.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                      {att.totalWorkMinutes ? `${Math.floor(att.totalWorkMinutes / 60)}h ${att.totalWorkMinutes % 60}m` : 'In Progress'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {att.checkInLocationVerified ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          In Radius ({att.checkInDistanceMeters || 14}m)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Remote / Override
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        att.status === 'PRESENT' && !att.isLate ? 'bg-emerald-100 text-emerald-800' :
                        att.isLate ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {att.isLate ? `Late (${att.lateMinutes}m)` : att.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-[11px] font-semibold text-sky-600 flex items-center">
                        <Camera className="w-3.5 h-3.5 mr-1" />
                        Captured
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CAMERA MODAL */}
      <LiveCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img) => setSelfieImage(img)}
        initialImage={selfieImage}
      />

      {/* APPLY LEAVE MODAL */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Apply for Leave</h3>
            <p className="text-xs text-slate-500 mb-4">Submit time-off request for HR approval.</p>

            <form onSubmit={handleSubmitLeave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Leave Type</label>
                <select
                  value={leaveData.leaveType}
                  onChange={(e) => setLeaveData({ ...leaveData, leaveType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                >
                  <option value="CASUAL">Casual Leave (Personal / Urgent)</option>
                  <option value="SICK">Sick Leave (Medical certificate)</option>
                  <option value="ANNUAL">Annual Paid Vacation</option>
                  <option value="UNPAID">Unpaid Leave of Absence</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveData.startDate}
                    onChange={(e) => setLeaveData({ ...leaveData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveData.endDate}
                    onChange={(e) => setLeaveData({ ...leaveData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Reason</label>
                <textarea
                  required
                  rows="3"
                  value={leaveData.reason}
                  onChange={(e) => setLeaveData({ ...leaveData, reason: e.target.value })}
                  placeholder="Provide brief context for leave request..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-brand-primary hover:bg-brand-primaryLight rounded-lg shadow cursor-pointer"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REQUEST SHIFT CHANGE MODAL */}
      {showShiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-1">Request Shift Transition</h3>
            <p className="text-xs text-slate-500 mb-4">Current: Morning Shift (09:00 - 17:00)</p>

            <form onSubmit={handleSubmitShiftRequest} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Target Shift</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500">
                  <option value="2">Afternoon Shift (13:00 - 21:00)</option>
                  <option value="3">Night Shift (21:00 - 05:00)</option>
                  <option value="4">Custom Executive (10:00 - 19:00)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Justification</label>
                <textarea
                  required
                  rows="3"
                  value={shiftReason}
                  onChange={(e) => setShiftReason(e.target.value)}
                  placeholder="Reason for requesting shift adjustment..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowShiftModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-brand-primary hover:bg-brand-primaryLight rounded-lg shadow cursor-pointer"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
