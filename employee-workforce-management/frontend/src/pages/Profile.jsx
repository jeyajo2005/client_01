import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Building,
  Clock,
  MapPin,
  Shield,
  Key,
  CheckCircle,
  Save,
  Lock
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 100-0003');
  const [emergencyName, setEmergencyName] = useState('Jane Doe');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (555) 999-1001');
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [notification, setNotification] = useState(null);

  const handleSaveContact = (e) => {
    e.preventDefault();
    setNotification({ type: 'success', text: 'Contact & Emergency details updated successfully.' });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      setNotification({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    setNotification({ type: 'success', text: 'Password successfully updated' });
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Profile Header Hero */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-card flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
        <img
          src={user?.avatarUrl || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'}
          alt=""
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-sky-500/20 shadow-md"
        />
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{user?.fullName || 'John Doe'}</h1>
              <p className="text-xs text-sky-600 font-bold mt-0.5">{user?.designation || 'Senior Full Stack Engineer'}</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200 self-center sm:self-auto">
              ID: {user?.employeeCode || 'EMP-1001'}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-y-2 gap-x-4 text-xs text-slate-600">
            <span className="flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              {user?.email}
            </span>
            <span className="flex items-center">
              <Building className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              {user?.companyName || 'TechCorp Global Solutions'}
            </span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              Morning Shift (09:00 - 17:00)
            </span>
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              TechPark Silicon Valley HQ
            </span>
          </div>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between border ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)} className="underline ml-4">Close</button>
        </div>
      )}

      {/* Two Column Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contact & Emergency Form */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
          <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center space-x-2">
            <Phone className="w-4 h-4 text-sky-600" />
            <span>Contact & Emergency Info</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">Keep your communication details up to date</p>

          <form onSubmit={handleSaveContact} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Mobile Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Emergency Contact Person</label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Emergency Contact Phone</label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-brand-primary hover:bg-brand-primaryLight text-white font-bold rounded-xl shadow transition"
              >
                Update Contact Information
              </button>
            </div>
          </form>
        </div>

        {/* Security & Password Update */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-card">
          <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center space-x-2">
            <Key className="w-4 h-4 text-sky-600" />
            <span>Account Security & Credentials</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">Update your password or authentication keys</p>

          <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Current Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">New Password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow transition"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
