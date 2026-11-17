import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS, ROLES } from '../utils/constants';
import { ShieldCheck, Lock, Mail, Sparkles, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('john.doe@techcorp.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const employeeDemos = DEMO_USERS.filter((u) => u.role === ROLES.EMPLOYEE);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demo) => {
    setUsername(demo.email);
    setPassword(demo.password);
    setLoading(true);
    try {
      await login(demo.email, demo.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-6 px-3 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md md:max-w-4xl">
        
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 border border-slate-800/40">
          
          {/* Brand Panel (Navy Blue) */}
          <div className="md:col-span-5 bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#0ea5e9] p-6 sm:p-8 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <h1 className="text-xl font-black tracking-tight">Workforce<span className="text-sky-300">Pro</span></h1>
                  <p className="text-[11px] text-sky-200">Employee Attendance Portal</p>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black leading-tight tracking-tight mb-2.5">
                Employee Punch & Biometrics
              </h2>
              <p className="text-xs text-sky-100/90 leading-relaxed mb-5">
                Daily check-in portal with real-time biometric camera selfie capture, office GPS geofence verification, dress code policies, and leave tracker.
              </p>

              <div className="space-y-2.5 hidden sm:block">
                <div className="flex items-center space-x-2.5 text-xs text-sky-100">
                  <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0" />
                  <span>GPS Office Radius Verification</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs text-sky-100">
                  <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0" />
                  <span>Live Camera Biometric Selfie</span>
                </div>
                <div className="flex items-center space-x-2.5 text-xs text-sky-100">
                  <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0" />
                  <span>Weekday Dress Code & Shifts</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/15 text-[11px] text-sky-200/80">
              Employee Self-Service &bull; Mobile Ready
            </div>
          </div>

          {/* Form Panel */}
          <div className="md:col-span-7 p-6 sm:p-8 bg-white flex flex-col justify-between">
            <div>
              <div className="mb-5">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Employee Sign In</h3>
                <p className="text-xs text-slate-500 mt-1">Enter your Employee ID or corporate email</p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email / Employee ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. john.doe@techcorp.com or EMP-1001"
                      className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none transition shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <a
                      href="#forgot"
                      onClick={(e) => { e.preventDefault(); alert('Default demo password is Admin@123'); }}
                      className="text-xs font-semibold text-sky-600 hover:text-sky-700"
                    >
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 focus:outline-none transition shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-primary to-brand-primaryLight hover:brightness-110 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Demo Credentials for Single Employee */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 mb-2.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>1-Click Employee Quick Login:</span>
              </div>
              {employeeDemos[0] && (
                <button
                  type="button"
                  onClick={() => handleQuickDemo(employeeDemos[0])}
                  className="w-full p-3 rounded-xl border border-sky-200 bg-sky-50/60 hover:bg-sky-100/80 text-left transition-all group flex items-center justify-between shadow-xs"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={employeeDemos[0].avatarUrl}
                      alt={employeeDemos[0].fullName}
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-sky-500/30"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700">
                        {employeeDemos[0].fullName} <span className="text-[11px] font-semibold text-sky-600">({employeeDemos[0].employeeCode})</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{employeeDemos[0].designation}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-xs font-bold text-sky-700 bg-white px-2.5 py-1.5 rounded-lg border border-sky-200 shadow-xs group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <span>1-Click Login</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </div>
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
