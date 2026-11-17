import React from 'react';

export default function ShiftRequestTable({ requests = [], onReview, isEmployee = false }) {
  if (!requests.length) {
    return <div className="p-8 text-center text-slate-400 text-xs">No shift requests found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-600">
        <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
          <tr>
            <th className="py-3 px-4">Employee</th>
            <th className="py-3 px-4">Current Shift</th>
            <th className="py-3 px-4">Requested Shift</th>
            <th className="py-3 px-4">Effective Date</th>
            <th className="py-3 px-4">Reason</th>
            <th className="py-3 px-4">Status</th>
            {!isEmployee && <th className="py-3 px-4 text-right">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {requests.map((r) => (
            <tr key={r.id} className="hover:bg-slate-50/70 transition">
              <td className="py-3.5 px-4 font-bold text-slate-900">{r.employeeName}</td>
              <td className="py-3.5 px-4 text-slate-600 font-medium">{r.currentShift || 'Morning'}</td>
              <td className="py-3.5 px-4 font-bold text-sky-700">{r.requestedShift}</td>
              <td className="py-3.5 px-4 font-mono font-medium text-slate-800">{r.effectiveDate}</td>
              <td className="py-3.5 px-4 max-w-xs text-slate-600 truncate">{r.reason}</td>
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
                        onClick={() => onReview && onReview(r.id, true)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onReview && onReview(r.id, false)}
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

