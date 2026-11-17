import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-800/40">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-sky-500 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Workforce<span className="text-sky-600">Pro</span></h2>
              <p className="text-xs text-slate-500">Account Recovery</p>
            </div>
          </div>

          {!submitted ? (
            <>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Reset Your Password</h3>
              <p className="text-xs text-slate-500 mb-6">
                Enter your registered corporate email and we will send password reset instructions to your inbox.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. employee@techcorp.com"
                      className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand-primary hover:bg-brand-primaryLight text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2"
                >
                  <span>Send Recovery Link</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Recovery Email Dispatched</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Instructions have been sent to <strong className="text-slate-800">{email}</strong>. For demo purposes, you can immediately sign in with default credentials <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sky-700 font-mono">Admin@123</code>.
              </p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link to="/login" className="inline-flex items-center text-xs font-bold text-sky-600 hover:text-sky-700 space-x-1">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

