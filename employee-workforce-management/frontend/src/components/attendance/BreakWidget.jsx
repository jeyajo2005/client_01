import React, { useState, useEffect } from 'react';
import { Coffee, Utensils, Users, AlertCircle, Play, Pause, Clock, CheckCircle } from 'lucide-react';

export default function BreakWidget({ workStatus, onStartBreak, onEndBreak }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState('TEA_BREAK');
  const [notes, setNotes] = useState('');
  const [elapsed, setElapsed] = useState(0);

  const breakTypes = [
    { id: 'TEA_BREAK', label: 'Tea / Coffee Break', time: '15 mins', icon: Coffee },
    { id: 'LUNCH_BREAK', label: 'Lunch Break', time: '45 mins', icon: Utensils },
    { id: 'MEETING', label: 'Client / External Meeting', time: 'Variable', icon: Users },
    { id: 'PERSONAL', label: 'Personal Pause', time: 'Variable', icon: AlertCircle },
  ];

  useEffect(() => {
    let interval = null;
    if (workStatus === 'ON_BREAK' || workStatus === 'WORKING') {
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workStatus]);

  const formatTimer = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirmBreak = () => {
    if (onStartBreak) {
      onStartBreak({ breakType: selectedType, notes });
    }
    setShowModal(false);
    setNotes('');
  };

  const getStatusBadge = () => {
    switch (workStatus) {
      case 'WORKING':
        return { label: 'Active & Working', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500' };
      case 'ON_BREAK':
        return { label: 'Currently On Break', bg: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-500' };
      case 'COMPLETED':
        return { label: 'Shift Completed', bg: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500' };
      case 'ON_LEAVE':
        return { label: 'On Approved Leave', bg: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500' };
      default:
        return { label: 'Shift Offline', bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Work Status & Breaks</h3>
            <p className="text-xs text-slate-500">Live duration and break logger</p>
          </div>
        </div>

        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
          <span className={`w-2 h-2 rounded-full mr-1.5 ${badge.dot} animate-pulse`} />
          {badge.label}
        </span>
      </div>

      {/* Live Timer and Action Controls */}
      <div className="my-4 p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            {workStatus === 'ON_BREAK' ? 'Current Break Duration' : 'Active Work Session'}
          </span>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white mt-0.5">
            {formatTimer(elapsed)}
          </div>
        </div>

        <div>
          {workStatus === 'WORKING' && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 transition"
            >
              <Pause className="w-4 h-4" />
              <span>Take Break</span>
            </button>
          )}

          {workStatus === 'ON_BREAK' && (
            <button
              type="button"
              onClick={onEndBreak}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 transition animate-bounce"
            >
              <Play className="w-4 h-4" />
              <span>Resume Work</span>
            </button>
          )}

          {workStatus === 'COMPLETED' && (
            <span className="text-xs text-slate-400 flex items-center font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-400 mr-1" />
              Logged Out
            </span>
          )}
        </div>
      </div>

      {/* Take Break Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-base mb-1">Select Break Type</h4>
            <p className="text-xs text-slate-500 mb-4">Breaks are logged in compliance with working hours policies.</p>

            <div className="space-y-2 mb-4">
              {breakTypes.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedType(b.id)}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition ${
                    selectedType === b.id
                      ? 'border-sky-500 bg-sky-50 text-slate-900 ring-1 ring-sky-500 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <b.icon className="w-5 h-5 text-sky-600" />
                    <div>
                      <div className="text-xs">{b.label}</div>
                      <div className="text-[11px] text-slate-500">Standard allowance: {b.time}</div>
                    </div>
                  </div>
                  {selectedType === b.id && <CheckCircle className="w-4 h-4 text-sky-600" />}
                </button>
              ))}
            </div>

            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-700 block mb-1">Optional Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Grabbing coffee with engineering team"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBreak}
                className="px-5 py-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow transition"
              >
                Start Break
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
