import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DRESS_COLOR_PALETTE } from '../utils/constants';
import {
  Shirt,
  Calendar,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Edit2,
  X,
  Palette
} from 'lucide-react';

export default function DressCodeManagement() {
  const { user, isEmployee } = useAuth();
  const [weeklyCodes, setWeeklyCodes] = useState([]);
  const [editingCode, setEditingCode] = useState(null);
  const [employeeSelections, setEmployeeSelections] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    const codes = await api.getDressCodes(user?.companyId || 1);
    setWeeklyCodes(codes || []);

    const db = JSON.parse(localStorage.getItem('workforce_mock_db_v1') || '{}');
    setEmployeeSelections(db.employeeDress || []);
  };

  const handleSavePolicy = (e) => {
    e.preventDefault();
    if (!editingCode) return;

    const updated = weeklyCodes.map(c => c.id === editingCode.id ? editingCode : c);
    setWeeklyCodes(updated);
    setEditingCode(null);
    setNotification({ type: 'success', text: `Dress code policy for ${editingCode.dayOfWeek} updated to ${editingCode.colorName}` });
  };

  const compliantCount = employeeSelections.filter(s => s.isCompliant).length;
  const totalSelections = employeeSelections.length || 1;
  const complianceRate = Math.round((compliantCount / totalSelections) * 100);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Dress Code Policy</h1>
          <p className="text-xs text-slate-500">Corporate weekday dress themes, color guidelines, and AI compliance audit</p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Company Compliance: {complianceRate}%</span>
          </span>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-between">
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)} className="underline ml-4">Close</button>
        </div>
      )}

      {/* WEEKLY DRESS CODE SCHEDULE CARDS */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          <Calendar className="w-4 h-4 text-sky-600" />
          <span>Weekly Corporate Dress Policy</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {weeklyCodes.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card hover:shadow-card-hover transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                    {item.dayOfWeek}
                  </span>
                  {!isEmployee && (
                    <button
                      onClick={() => setEditingCode(item)}
                      className="p-1 rounded-md text-slate-400 hover:text-sky-600 hover:bg-slate-50"
                      title="Edit Policy"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className="w-5 h-5 rounded-full border border-slate-300 shadow-sm shrink-0"
                    style={{ backgroundColor: item.colorHex }}
                  />
                  <h4 className="font-extrabold text-slate-900 text-sm truncate">{item.colorName}</h4>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className={`px-2 py-0.5 rounded font-bold ${item.isMandatory ? 'bg-slate-100 text-slate-700' : 'bg-sky-50 text-sky-700'}`}>
                  {item.isMandatory ? 'Mandatory' : 'Casual'}
                </span>
                <span className="text-slate-400 font-mono text-[10px]">{item.colorHex}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TODAY'S EMPLOYEE DRESS SELECTIONS AUDIT TABLE */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Today's Employee Attire Submissions</h3>
            <p className="text-xs text-slate-500">Selections verified during attendance check-in</p>
          </div>
          <span className="text-xs font-bold text-slate-500">{employeeSelections.length} Submissions</span>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-[600px] w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Selected Attire Color</th>
                <th className="py-3 px-4">Hex Code</th>
                <th className="py-3 px-4">AI Verification</th>
                <th className="py-3 px-4">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employeeSelections.map((sel) => (
                <tr key={sel.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {sel.employeeName}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800 flex items-center space-x-2">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300"
                      style={{ backgroundColor: sel.selectedColorHex }}
                    />
                    <span>{sel.selectedColorName}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {sel.selectedColorHex}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
                      Confidence: {Math.round((sel.aiConfidenceScore || 0.95) * 100)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      sel.isCompliant
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sel.isCompliant ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Compliant
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Deviation
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT POLICY MODAL */}
      {editingCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Configure {editingCode.dayOfWeek} Dress Policy</h3>
              <button onClick={() => setEditingCode(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePolicy} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Theme Color Name</label>
                <input
                  type="text"
                  required
                  value={editingCode.colorName}
                  onChange={(e) => setEditingCode({ ...editingCode, colorName: e.target.value })}
                  placeholder="e.g. Navy Blue"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Color Palette Swatch</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={editingCode.colorHex}
                    onChange={(e) => setEditingCode({ ...editingCode, colorHex: e.target.value })}
                    className="w-12 h-10 p-1 border border-slate-300 rounded-xl cursor-pointer"
                  />
                  <input
                    type="text"
                    value={editingCode.colorHex}
                    onChange={(e) => setEditingCode({ ...editingCode, colorHex: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Description / Attire Guidelines</label>
                <textarea
                  required
                  rows="3"
                  value={editingCode.description}
                  onChange={(e) => setEditingCode({ ...editingCode, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="mandatory"
                  checked={editingCode.isMandatory}
                  onChange={(e) => setEditingCode({ ...editingCode, isMandatory: e.target.checked })}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="mandatory" className="font-semibold text-slate-700">Strictly Mandatory Attire</label>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingCode(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-brand-primary hover:bg-brand-primaryLight rounded-xl shadow"
                >
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
