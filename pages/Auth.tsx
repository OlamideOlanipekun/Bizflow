
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from '../constants';

const Auth: React.FC<{ onLogin: (email: string, pass: string) => Promise<void> }> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@bizflow.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginStep, setLoginStep] = useState<'idle' | 'verifying' | 'authorizing'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoggingIn(true);
    setLoginStep('verifying');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoginStep('authorizing');
      await onLogin(email, password);
    } catch (err) {
      setError('Invalid identity credentials. Access denied by protocol.');
      setLoginStep('idle');
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Left Side: Brand Experience Zone */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-between p-20">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[160px]"></div>

        {/* Brand Header */}
        <Link to="/" className="relative z-10 flex items-center gap-4 group">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-indigo-600/40 group-hover:scale-110 transition-transform">B</div>
          <span className="text-2xl font-black tracking-tighter text-white">BizFlow</span>
        </Link>

        {/* Content & Visual */}
        <div className="relative z-10 space-y-12 max-w-lg">
          <div className="space-y-6">
            <h2 className="text-6xl font-black text-white tracking-tighter leading-[0.9]">
              Secure the <br />
              <span className="text-indigo-400">Command Chain.</span>
            </h2>
            <p className="text-xl text-slate-400 font-medium leading-relaxed">
              Log in to the high-velocity ecosystem designed for modern executive leadership.
            </p>
          </div>

          {/* Floating Feature Card */}
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl animate-float">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">System Trace v2.4</span>
              </div>
              <ICONS.Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="space-y-6">
              <div className="flex items-end gap-2">
                <div className="flex-1 bg-white/10 rounded-t-xl h-12"></div>
                <div className="flex-1 bg-indigo-500 rounded-t-xl h-24 shadow-lg shadow-indigo-500/20"></div>
                <div className="flex-1 bg-white/10 rounded-t-xl h-16"></div>
                <div className="flex-1 bg-white/10 rounded-t-xl h-20"></div>
              </div>
              <div className="flex justify-between items-center">
                 <p className="text-sm font-black text-white">Projected Growth</p>
                 <p className="text-sm font-black text-emerald-400">+24.8%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 flex items-center gap-8 opacity-40">
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">TLS 1.3 Certified</span>
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ISO 27001 Ready</span>
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">SLA 99.99%</span>
        </div>
      </div>

      {/* Right Side: Focus Action Zone */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24 relative overflow-y-auto">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">B</div>
          <span className="text-xl font-black tracking-tighter text-slate-950">BizFlow</span>
        </div>

        <div className="w-full max-w-md space-y-12">
          {/* Form Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-slate-950 tracking-tighter">Command Access</h1>
            <p className="text-slate-500 font-medium">Verify your identity to re-establish workspace sync.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-5 bg-rose-50 border-l-4 border-rose-500 rounded-xl flex items-center gap-4 text-rose-700 animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs font-black uppercase tracking-tight">{error}</p>
            </div>
          )}

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* Email Input */}
              <div className="space-y-3 group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-1 transition-colors group-focus-within:text-indigo-600">
                  Entity Identifier
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-bold text-lg placeholder-slate-300 shadow-sm"
                    placeholder="name@bizflow.io"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                    <ICONS.Customers className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-3 group">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] transition-colors group-focus-within:text-indigo-600">
                    Sovereign Token
                  </label>
                  <button type="button" className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                    Request Recovery
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-bold text-lg placeholder-slate-300 shadow-sm"
                    placeholder="••••••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              disabled={isLoggingIn}
              type="submit"
              className="w-full bg-slate-950 hover:bg-indigo-600 text-white font-black py-6 rounded-[1.5rem] transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-4 group relative overflow-hidden"
            >
              <div className={`flex items-center gap-4 transition-all duration-300 ${isLoggingIn ? 'opacity-0 scale-90 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}`}>
                <span className="text-xs uppercase tracking-[0.4em]">Establish Link</span>
                <ICONS.Bolt className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </div>

              {isLoggingIn && (
                <div className="absolute inset-0 flex items-center justify-center gap-4 animate-fade-in">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                    {loginStep === 'verifying' ? 'Verifying Integrity' : 'Syncing Protocol'}
                  </span>
                </div>
              )}
            </button>
          </form>

          {/* Social Auth & Footer */}
          <div className="space-y-10 pt-4">
            <div className="flex items-center gap-4">
              <div className="h-px bg-slate-100 flex-1"></div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Enterprise Access</span>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button className="flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest text-slate-600">
                  <div className="w-5 h-5 bg-slate-100 rounded-lg flex items-center justify-center text-[10px]">G</div>
                  Google
               </button>
               <button className="flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest text-slate-600">
                  <div className="w-5 h-5 bg-slate-100 rounded-lg flex items-center justify-center text-[10px]">M</div>
                  Microsoft
               </button>
            </div>

            <p className="text-center text-slate-500 font-medium text-sm">
              Missing from the ecosystem? 
              <Link to="/signup" className="ml-2 text-indigo-600 font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                Provision Access
              </Link>
            </p>
          </div>
        </div>

        {/* Global Footer */}
        <div className="mt-auto pt-20 w-full max-w-md flex justify-between items-center opacity-30 group hover:opacity-100 transition-opacity">
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">&copy; 2025 BIZFLOW HQ</p>
           <div className="flex gap-4">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Privacy</span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Terms</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
