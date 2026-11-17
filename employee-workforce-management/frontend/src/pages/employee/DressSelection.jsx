import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { DRESS_COLOR_PALETTE } from '../../utils/constants';
import { Shirt, CheckCircle, Sparkles, Calendar, Info, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DressSelection() {
  const { user } = useAuth();
  const employeeId = user?.employeeId || 1;
  const [selectedColor, setSelectedColor] = useState(DRESS_COLOR_PALETTE[0]);
  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadHistory();
  }, [employeeId]);

  const loadHistory = async () => {
    const list = await api.getEmployeeAttendance(employeeId);
    if (list) {
      const dressHistory = list.map(item => ({
        date: item.attendanceDate,
        color: item.dressColor || 'Navy Blue',
        status: 'Compliant'
      }));
      setHistory(dressHistory);
    }
  };

  const handleSaveSelection = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await api.selectDressCode({
        employeeId,
        date: todayStr,
        dressColor: selectedColor.name,
        colorHex: selectedColor.hex
      });
      setMessage({ type: 'success', text: `Dress colour "${selectedColor.name}" logged successfully for today!` });
      confetti({ particleCount: 50, spread: 60 });
      await loadHistory();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to record dress code.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Shirt className="w-7 h-7 text-navy-800" />
            Daily Dress Code Selection
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Select your daily corporate dress attire and log verification for company standards
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
          <Sparkles className="w-4 h-4 text-sky-600" />
          AI Color Verification Enabled
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Palette Selection Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 text-base mb-1">Choose Today's Attire Color</h2>
          <p className="text-slate-500 text-xs mb-5">Click on a palette swatch to match your chosen clothing today</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DRESS_COLOR_PALETTE.map((color) => {
              const isSelected = selectedColor.name === color.name;
              return (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'border-navy-900 bg-navy-50/50 shadow-sm ring-2 ring-navy-900/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span
                    className="w-8 h-8 rounded-lg shadow-sm border border-slate-200 flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{color.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{color.hex}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-md shadow-inner" style={{ backgroundColor: selectedColor.hex }} />
              <span className="text-sm font-medium text-slate-700">
                Selected: <strong className="text-slate-900">{selectedColor.name}</strong>
              </span>
            </div>
            <button
              onClick={handleSaveSelection}
              disabled={saving}
              className="py-2.5 px-5 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Confirm Dress Selection'}
            </button>
          </div>
        </div>

        {/* Policy Guidelines & History */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-600" />
              Company Attire Guidelines
            </h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li>• <strong>Mon - Thu:</strong> Business Formal or Smart Casual (Navy, Charcoal, Slate, Sky Blue).</li>
              <li>• <strong>Friday:</strong> Casual Friday (All approved colors welcome).</li>
              <li>• In-office camera check-in verifies dress harmony using computer vision.</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              Your Recent Dress History
            </h3>
            {history.length === 0 ? (
              <p className="text-xs text-slate-400">No dress history logged yet.</p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {history.slice(0, 6).map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
                    <span className="text-slate-500">{item.date}</span>
                    <span className="font-medium text-slate-800">{item.color}</span>
                    <span className="text-emerald-600 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

