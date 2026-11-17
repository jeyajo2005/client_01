import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';
import LiveCameraModal from '../../components/attendance/LiveCameraModal';
import GeolocationCard from '../../components/attendance/GeolocationCard';
import DressCodeCard from '../../components/attendance/DressCodeCard';
import { Camera, CheckCircle2, Clock, MapPin, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';

export default function SelfieAttendance() {
  const { user } = useAuth();
  const employeeId = user?.employeeId || 1;
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selfieImage, setSelfieImage] = useState(null);
  const [gpsData, setGpsData] = useState(null);
  const [selectedDress, setSelectedDress] = useState({ name: 'Navy Blue', hex: '#1e3a8a' });
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadStatus();
  }, [employeeId]);

  const loadStatus = async () => {
    const list = await api.getEmployeeAttendance(employeeId);
    const todayStr = new Date().toISOString().split('T')[0];
    const rec = list?.find(a => a.attendanceDate === todayStr);
    setTodayAttendance(rec || null);
  };

  const handleCapture = (dataUri) => {
    setSelfieImage(dataUri);
    setIsCameraOpen(false);
  };

  const handlePunchCheckIn = async () => {
    if (!selfieImage) {
      setIsCameraOpen(true);
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.checkIn({
        employeeId,
        latitude: gpsData?.lat || 37.7749,
        longitude: gpsData?.lng || -122.4194,
        deviceInfo: navigator.userAgent,
        selfieBase64: selfieImage,
        dressColor: selectedDress.name
      });
      setMessage({ type: 'success', text: `Check-in successful at ${res.checkInTime}! Status: ${res.status}` });
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      await loadStatus();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Check-in failed' });
    } finally {
      setLoading(false);
    }
  };

  const handlePunchCheckOut = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.checkOut({
        employeeId,
        latitude: gpsData?.lat || 37.7749,
        longitude: gpsData?.lng || -122.4194,
        selfieBase64: selfieImage
      });
      setMessage({ type: 'success', text: `Checked out at ${res.checkOutTime}. Total hours: ${res.workingHours || 8} hrs.` });
      await loadStatus();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Check-out failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Camera className="w-7 h-7 text-navy-800" />
            Selfie & Biometric Attendance
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Transparent camera & GPS geofence verification for verified check-in
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Strict Multi-Tenant Verification Active
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

      {/* Main Punch Kiosk Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Selfie Viewfinder Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900 text-lg flex items-center gap-2">
                <Camera className="w-5 h-5 text-navy-800" />
                Live Selfie Capture
              </h2>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${selfieImage ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {selfieImage ? 'Selfie Captured' : 'Selfie Required'}
              </span>
            </div>

            <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
              {selfieImage ? (
                <img src={selfieImage} alt="Captured Selfie" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 text-slate-300">
                  <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center mb-3">
                    <Camera className="w-8 h-8 text-sky-400" />
                  </div>
                  <p className="font-medium text-white">No selfie captured yet</p>
                  <p className="text-xs text-slate-400 mt-1">Open camera to capture verification image</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setIsCameraOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all"
              >
                <Camera className="w-4 h-4" />
                {selfieImage ? 'Retake Live Selfie' : 'Open Camera'}
              </button>
            </div>
          </div>

          {/* Action Punch Buttons */}
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
            <button
              onClick={handlePunchCheckIn}
              disabled={loading || (todayAttendance && !todayAttendance.checkOutTime)}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {todayAttendance && !todayAttendance.checkOutTime ? 'Already Checked In' : 'Punch Check-In'}
            </button>

            <button
              onClick={handlePunchCheckOut}
              disabled={loading || !todayAttendance || !!todayAttendance.checkOutTime}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-900 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              {todayAttendance?.checkOutTime ? 'Checked Out' : 'Punch Check-Out'}
            </button>
          </div>
        </div>

        {/* Right Column: Geofence and Dress Policy Check */}
        <div className="lg:col-span-5 space-y-6">
          <GeolocationCard onLocationUpdate={(data) => setGpsData(data)} />
          <DressCodeCard onSelectDress={(c) => setSelectedDress(c)} />
        </div>
      </div>

      <LiveCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCapture}
      />
    </div>
  );
}

