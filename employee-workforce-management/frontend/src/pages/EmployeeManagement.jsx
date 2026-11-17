import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Building,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function EmployeeManagement() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [notification, setNotification] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employeeCode: '',
    designation: '',
    departmentId: 1,
    shiftId: 1,
    locationId: 1,
    employmentType: 'FULL_TIME',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });

  useEffect(() => {
    loadEmployees();
  }, [user]);

  const loadEmployees = async () => {
    const list = await api.getEmployees(user?.companyId || 1);
    setEmployees(list || []);
  };

  const handleAddOpen = () => {
    const nextCode = `EMP-${1001 + employees.length}`;
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      employeeCode: nextCode,
      designation: '',
      departmentId: 1,
      shiftId: 1,
      locationId: 1,
      employmentType: 'FULL_TIME',
      emergencyContactName: '',
      emergencyContactPhone: ''
    });
    setEditingEmployee(null);
    setShowAddModal(true);
  };

  const handleEditOpen = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      employeeCode: emp.employeeCode,
      designation: emp.designation,
      departmentId: emp.departmentId || 1,
      shiftId: emp.shiftId || 1,
      locationId: emp.locationId || 1,
      employmentType: emp.employmentType || 'FULL_TIME',
      emergencyContactName: emp.emergencyContactName || '',
      emergencyContactPhone: emp.emergencyContactPhone || ''
    });
    setShowAddModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        // Update local state
        const updatedList = employees.map(emp => {
          if (emp.id === editingEmployee.id) {
            return {
              ...emp,
              ...formData,
              fullName: `${formData.firstName} ${formData.lastName}`
            };
          }
          return emp;
        });
        setEmployees(updatedList);
        setNotification({ type: 'success', text: `Employee ${formData.firstName} updated successfully` });
      } else {
        const created = await api.createEmployee(user?.companyId || 1, formData);
        setEmployees([...employees, created]);
        setNotification({ type: 'success', text: `New employee ${formData.firstName} onboarded successfully with ID ${formData.employeeCode}` });
      }
      setShowAddModal(false);
    } catch (err) {
      setNotification({ type: 'error', text: err.message || 'Operation failed' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingEmployee) return;
    try {
      await api.deleteEmployee(deletingEmployee.id);
      setEmployees(employees.filter(e => e.id !== deletingEmployee.id));
      setNotification({ type: 'success', text: `Employee ${deletingEmployee.fullName} removed from workforce` });
    } catch (err) {
      setNotification({ type: 'error', text: err.message });
    } finally {
      setDeletingEmployee(null);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeCode?.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation?.toLowerCase().includes(search.toLowerCase());

    const matchesDept = selectedDept === 'ALL' || emp.departmentName === selectedDept || emp.departmentId === Number(selectedDept);
    const matchesStatus = selectedStatus === 'ALL' || emp.workStatus === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Workforce Directory</h1>
          <p className="text-xs text-slate-500">Manage employee accounts, designations, shifts, and credentials</p>
        </div>

        <button
          onClick={handleAddOpen}
          className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primaryLight text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Employee</span>
        </button>
      </div>

      {notification && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)} className="underline ml-4">Close</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, employee ID, designation, or email..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium text-slate-700"
          >
            <option value="ALL">All Departments</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Product & UI/UX Design">Product Design</option>
            <option value="Sales & Growth">Sales & Growth</option>
            <option value="Quality Assurance & DevOps">QA & DevOps</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="WORKING">Working</option>
            <option value="ON_BREAK">On Break</option>
            <option value="COMPLETED">Completed</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Department & Role</th>
                <th className="py-3.5 px-4">Shift Schedule</th>
                <th className="py-3.5 px-4">Office Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
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
                    <div className="text-[11px] text-sky-600 font-medium">{emp.departmentName || 'Engineering'}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center text-slate-700 font-medium">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      <span>{emp.shiftName || 'Morning Shift (09:00 - 17:00)'}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center text-slate-700">
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
                  <td className="py-3.5 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => handleEditOpen(emp)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition"
                      title="Edit Employee"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingEmployee(emp)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete Employee"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT EMPLOYEE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingEmployee ? 'Edit Employee Details' : 'Onboard New Employee'}
                </h3>
                <p className="text-xs text-slate-500">Provide personal, designation, department, and shift details.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Rachel"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Green"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. rachel.g@techcorp.com"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Employee ID Code</label>
                  <input
                    type="text"
                    required
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 bg-slate-50 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Senior Software Architect"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Department</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="1">Software Engineering</option>
                    <option value="2">Human Resources</option>
                    <option value="3">Product Design</option>
                    <option value="4">Sales & Growth</option>
                    <option value="5">QA & DevOps</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Shift Schedule</label>
                  <select
                    value={formData.shiftId}
                    onChange={(e) => setFormData({ ...formData, shiftId: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="1">Morning (09:00 - 17:00)</option>
                    <option value="2">Afternoon (13:00 - 21:00)</option>
                    <option value="3">Night (21:00 - 05:00)</option>
                    <option value="4">Custom Exec (10:00 - 19:00)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Geofence Office</label>
                  <select
                    value={formData.locationId}
                    onChange={(e) => setFormData({ ...formData, locationId: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="1">Silicon Valley Tech Park HQ</option>
                    <option value="2">Downtown Development Hub</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 font-bold text-white bg-brand-primary hover:bg-brand-primaryLight rounded-xl shadow-md transition"
                >
                  {editingEmployee ? 'Save Changes' : 'Confirm Onboarding'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">Delete Employee Profile</h3>
            <p className="text-xs text-slate-500 mb-5">
              Are you sure you want to remove <strong className="text-slate-800">{deletingEmployee.fullName}</strong> ({deletingEmployee.employeeCode})? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setDeletingEmployee(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
