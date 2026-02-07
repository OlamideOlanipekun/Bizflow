
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from '../constants';

const Auth: React.FC<{ onLogin: (email: string, pass: string) => Promise<void> }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      await new Promise(resolve => setTimeout(resolve, 800));
      setLoginStep('authorizing');
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid identity credentials. Access denied by protocol.');
      setLoginStep('idle');
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row mesh-gradient-bg selection:bg-indigo-500/30 selection:text-white overflow-hidden">

      {/* Left Side: Brand Experience Zone */}
      <div className="hidden lg:flex lg:w-3/5 relative flex-col justify-between p-16 xl:p-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Brand Header */}
        <Link to="/" className="relative z-10 flex items-center gap-4 group">
          <div className="w-14 h-14 glass-effect rounded-2xl flex items-center justify-center text-white font-black text-2xl group-hover:scale-110 transition-transform duration-500">B</div>
          <span className="text-3xl font-black tracking-tighter text-white">BizFlow<span className="text-indigo-400">.</span></span>
        </Link>

        {/* Content & Visual */}
        <div className="relative z-10 space-y-12 max-w-2xl mt-12">
          <div className="space-y-6">
            <h2 className="text-7xl xl:text-8xl font-black text-white tracking-tighter leading-[0.85] shimmer-text">
              Lead With <br />
              <span className="text-indigo-400">Intelligence.</span>
            </h2>
            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-md">
              Secure access to your executive dashboard. Modern business logic meets AI-driven strategic pivots.
            </p>
          </div>

          {/* Bento-style Feature Deck */}
          <div className="grid grid-cols-2 gap-6 relative">
            <div className="glass-effect rounded-[2.5rem] p-8 space-y-4 hover:translate-y-[-4px] transition-transform duration-500">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                <ICONS.Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-white font-bold">Generative Insights</h4>
                <p className="text-xs text-slate-500 mt-1">Real-time market analysis powered by Gemini 1.5 Pro.</p>
              </div>
            </div>
            <div className="glass-effect rounded-[2.5rem] p-8 space-y-4 hover:translate-y-[-4px] transition-transform duration-500" style={{ transitionDelay: '0.1s' }}>
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <ICONS.Bolt className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-white font-bold">High Velocity</h4>
                <p className="text-xs text-slate-500 mt-1">Instant sync across all your global business nodes.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="relative z-10 flex items-center gap-10">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                USR
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Trusted by <span className="text-slate-300">500+ Corporations</span> globally
          </p>
        </div>
      </div>

      {/* Right Side: Focus Action Zone */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 relative bg-white lg:rounded-l-[4rem] shadow-[-20px_0_60px_rgba(0,0,0,0.5)] z-20">
        <div className="w-full max-w-md space-y-10 group/form">
          {/* Form Header */}
          <div className="space-y-4">
            <div className="lg:hidden flex justify-center mb-8">
              <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center text-white font-black text-3xl">B</div>
            </div>
            <h1 className="text-5xl font-black text-slate-950 tracking-tighter">Login</h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">Enter your credentials to access the command center.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-5 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4 text-rose-700 animate-fade-in">
              <div className="w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-200">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-xs font-black uppercase tracking-tight">{error}</p>
            </div>
          )}

          {/* Form Area */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Anti-autofill honeypot fields (hidden) */}
            <input style={{ display: 'none' }} type="text" name="fake_email" />
            <input style={{ display: 'none' }} type="password" name="fake_password" />

            <div className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2 group/input">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 group-focus-within/input:text-indigo-600 transition-colors">
                  Executive Identity
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="bf_executive_id"
                    id="bf_executive_id"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="chrome-off"
                    className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-[12px] focus:ring-indigo-500/5 focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-bold text-lg placeholder-slate-300 shadow-inner"
                    placeholder="email@company.com"
                  />
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-600 transition-colors">
                    <ICONS.Customers className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2 group/input">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-focus-within/input:text-indigo-600 transition-colors">
                    Security Protocol
                  </label>
                  <button type="button" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                    Recovery
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="bf_security_cipher"
                    id="bf_security_cipher"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-[12px] focus:ring-indigo-500/5 focus:border-indigo-600 focus:bg-white transition-all text-slate-900 font-bold text-lg placeholder-slate-300 shadow-inner"
                    placeholder="Signature Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              disabled={isLoggingIn}
              type="submit"
              className="w-full bg-slate-950 hover:bg-indigo-600 text-white font-black py-7 rounded-[2.5rem] transition-all duration-500 shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 group relative overflow-hidden active:scale-[0.98] disabled:opacity-50"
            >
              <div className={`flex items-center gap-4 transition-all duration-500 ${isLoggingIn ? 'opacity-0 scale-90 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
                <span className="text-xs uppercase tracking-[0.5em] font-black">Establish Connection</span>
                <ICONS.Bolt className="w-5 h-5 group-hover:rotate-12 transition-transform duration-500" />
              </div>

              {isLoggingIn && (
                <div className="absolute inset-0 flex items-center justify-center gap-4 animate-fade-in">
                  <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span className="text-[11px] font-black uppercase tracking-[0.4em]">
                    {loginStep === 'verifying' ? 'Verifying Integrity' : 'Authorizing Sync'}
                  </span>
                </div>
              )}
            </button>
          </form>

          {/* Footer Access */}
          <div className="pt-8 flex flex-col items-center gap-8">
            <div className="flex items-center gap-4 w-full">
              <div className="h-px bg-slate-100 flex-1"></div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Enterprise SSO</span>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>

            <div className="flex gap-4 w-full">
              <button className="flex-1 py-5 border border-slate-100 rounded-[1.5rem] hover:bg-slate-50 transition-all flex items-center justify-center">
                <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black">G</div>
              </button>
              <button className="flex-1 py-5 border border-slate-100 rounded-[1.5rem] hover:bg-slate-50 transition-all flex items-center justify-center px-4">
                <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black">M</div>
              </button>
            </div>

            <p className="text-slate-500 font-medium text-sm">
              Not on the platform yet?
              <Link to="/signup" className="ml-2 text-indigo-600 font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                Join Network
              </Link>
            </p>
          </div>
        </div>

        {/* Legal Meta */}
        <div className="mt-16 pt-8 w-full max-w-md flex justify-between items-center opacity-40 group hover:opacity-100 transition-opacity">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">&copy; 2025 BIZFLOW HQ</p>
          <div className="flex gap-6">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600">Privacy</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600">Terms</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
