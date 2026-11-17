import React, { useState } from 'react';
import { DRESS_COLOR_PALETTE } from '../../utils/constants';
import { Shirt, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';

export default function DressCodeCard({ todayDressPolicy, selectedColor, onColorSelect }) {
  const policy = todayDressPolicy || {
    colorName: 'Navy Blue',
    colorHex: '#1e3a8a',
    description: 'Corporate navy blue blazer or formal shirt',
    isMandatory: true,
  };

  const [currentColor, setCurrentColor] = useState(selectedColor || policy);

  const handleSelect = (color) => {
    setCurrentColor(color);
    if (onColorSelect) {
      onColorSelect(color);
    }
  };

  const isCompliant = currentColor?.name?.toLowerCase() === policy.colorName?.toLowerCase();

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-card">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Shirt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Today's Dress Code</h3>
            <p className="text-xs text-slate-500">Corporate policy & daily selection</p>
          </div>
        </div>

        {/* AI Compliance status pill */}
        {isCompliant ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            AI Compliant (98%)
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Deviation Flagged
          </span>
        )}
      </div>

      {/* Today's Designated Theme */}
      <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Required Dress Theme
          </span>
          <div className="text-sm font-bold text-slate-900 flex items-center space-x-2 mt-0.5">
            <span
              className="w-3.5 h-3.5 rounded-full inline-block border border-slate-300 shadow-xs"
              style={{ backgroundColor: policy.colorHex }}
            />
            <span>{policy.colorName}</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{policy.description}</p>
        </div>
        <div className="text-right">
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-700">
            {policy.isMandatory ? 'Mandatory' : 'Casual'}
          </span>
        </div>
      </div>

      {/* Select Worn Color */}
      <div>
        <span className="text-xs font-semibold text-slate-700 block mb-2">
          Select Your Daily Attire Color:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DRESS_COLOR_PALETTE.map((c) => {
            const isSelected = currentColor?.name === c.name;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => handleSelect(c)}
                className={`p-2 rounded-xl text-left border flex items-center space-x-2 transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/70 ring-1 ring-sky-500 text-slate-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600 font-medium'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-slate-300 shrink-0 shadow-xs"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-xs truncate">{c.name}</span>
                {isSelected && <CheckCircle className="w-3.5 h-3.5 text-sky-600 ml-auto shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
