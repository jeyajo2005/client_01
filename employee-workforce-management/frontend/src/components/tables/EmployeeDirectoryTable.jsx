import React from 'react';
import { Edit2, Trash2, Clock, MapPin } from 'lucide-react';

export default function EmployeeDirectoryTable({ employees = [], onEdit, onDelete }) {
  if (!employees.length) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No employees found matching criteria
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs text-slate-600">
        <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
          <tr>
            <th className="py-3 px-4">Employee</th>
            <th className="py-3 px-4">Department & Role</th>
            <th className="py-3 px-4">Shift</th>
            <th className="py-3 px-4">Office Geofence</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-slate-50/70 transition">
              <td className="py-3.5 px-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={emp.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{emp.fullName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{emp.employeeCode} &bull; {emp.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="font-semibold text-slate-800">{emp.designation}</div>
                <div className="text-[11px] text-sky-600">{emp.departmentName || 'Engineering'}</div>
              </td>
              <td className="py-3.5 px-4 font-medium text-slate-700">
                <div className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  <span>{emp.shiftName || 'Morning Shift'}</span>
                </div>
              </td>
              <td className="py-3.5 px-4 text-slate-700">
                <div className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  <span className="truncate max-w-xs">{emp.locationName || 'TechCorp HQ'}</span>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  emp.workStatus === 'WORKING' ? 'bg-emerald-100 text-emerald-800' :
                  emp.workStatus === 'ON_BREAK' ? 'bg-amber-100 text-amber-800' :
                  emp.workStatus === 'ON_LEAVE' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {emp.workStatus || 'WORKING'}
                </span>
              </td>
              <td className="py-3.5 px-4 text-right space-x-1">
                {onEdit && (
                  <button
                    onClick={() => onEdit(emp)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition"
                    title="Edit Employee"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(emp)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Employee"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

