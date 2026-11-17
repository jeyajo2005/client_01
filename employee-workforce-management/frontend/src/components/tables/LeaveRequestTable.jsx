import React from 'react';

export default function LeaveRequestTable({ leaves = [], onReview, isEmployee = false }) {
  if (!leaves.length) {
    return <div className="p-8 text-center text-slate-400 text-xs">No leave applications found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-600">
        <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
          <tr>
            <th className="py-3 px-4">Employee</th>
            <th className="py-3 px-4">Type</th>
            <th className="py-3 px-4">Dates</th>
            <th className="py-3 px-4">Days</th>
            <th className="py-3 px-4">Reason</th>
            <th className="py-3 px-4">Status</th>
            {!isEmployee && <th className="py-3 px-4 text-right">Review Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {leaves.map((l) => (
            <tr key={l.id} className="hover:bg-slate-50/70 transition">
              <td className="py-3.5 px-4 font-bold text-slate-900">{l.employeeName}</td>
              <td className="py-3.5 px-4">
                <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-slate-100 text-slate-700">
                  {l.leaveType}
                </span>
              </td>
              <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                {l.startDate} &rarr; {l.endDate}
              </td>
              <td className="py-3.5 px-4 font-bold text-slate-800">{l.totalDays || 1}</td>
              <td className="py-3.5 px-4 max-w-xs text-slate-600 truncate">{l.reason}</td>
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
                        onClick={() => onReview && onReview(l.id, true)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onReview && onReview(l.id, false)}
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
  );
}

