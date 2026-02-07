
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from '../constants';

const SignUp: React.FC<{ onSignUp: (name: string, email: string, pass: string, company: string) => Promise<void> }> = ({ onSignUp }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'idle' | 'encrypting' | 'provisioning' | 'syncing'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Password mismatch. Identity verification failed.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      setStep('encrypting');
      await new Promise(resolve => setTimeout(resolve, 800));

      setStep('provisioning');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStep('syncing');
      await onSignUp(formData.name, formData.email, formData.password, formData.company);
    } catch (err) {
      setError('Infrastructure error. Workspace could not be provisioned.');
      setStep('idle');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mesh-gradient-bg p-6 relative overflow-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-3xl relative z-10 animate-fade-in py-12">
        <div className="glass-effect rounded-[4rem] shadow-[0_48px_128px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="p-12 md:p-16">
            <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white font-black text-2xl border border-white/20">B</div>
                  <span className="text-2xl font-black tracking-tighter text-white">BizFlow<span className="text-indigo-400">.</span></span>
                </div>
                <h1 className="text-5xl xl:text-6xl font-black text-white tracking-tighter leading-none shimmer-text">Join the Network</h1>
                <p className="text-slate-400 text-lg font-medium">Provision your dedicated executive workspace in seconds.</p>
              </div>
              <Link to="/login" className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-slate-300 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all active:scale-95">
                Establish Login
              </Link>
            </div>

            {error && (
              <div className="mb-10 p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center gap-4 text-rose-400 animate-fade-in">
                <div className="w-10 h-10 bg-rose-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-900/40">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <p className="text-sm font-black uppercase tracking-tight">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-3 col-span-1 md:col-span-2 group/input">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-4 group-focus-within/input:text-indigo-400 transition-colors">Global Signature</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    autoComplete="name"
                    className="w-full px-8 py-6 bg-white/[0.04] border border-white/10 rounded-[2rem] outline-none focus:ring-[12px] focus:ring-indigo-500/5 focus:border-indigo-500/40 transition-all text-white font-bold text-lg placeholder-slate-600"
                    placeholder="Full Name"
                  />
                </div>

                <div className="space-y-3 group/input">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-4 group-focus-within/input:text-indigo-400 transition-colors">Executive Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    autoComplete="email"
                    className="w-full px-8 py-6 bg-white/[0.04] border border-white/10 rounded-[2rem] outline-none focus:ring-[12px] focus:ring-indigo-500/5 focus:border-indigo-500/40 transition-all text-white font-bold text-lg placeholder-slate-600"
                    placeholder="name@company.com"
                  />
                </div>

                <div className="space-y-3 group/input">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-4 group-focus-within/input:text-indigo-400 transition-colors">Entity Authority</label>
                  <input
                    required
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    autoComplete="organization"
                    className="w-full px-8 py-6 bg-white/[0.04] border border-white/10 rounded-[2rem] outline-none focus:ring-[12px] focus:ring-indigo-500/5 focus:border-indigo-500/40 transition-all text-white font-bold text-lg placeholder-slate-600"
                    placeholder="Organization Name"
                  />
                </div>

                <div className="space-y-3 group/input">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-4 group-focus-within/input:text-indigo-400 transition-colors">Access Cipher</label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      autoComplete="new-password"
                      className="w-full px-8 py-6 bg-white/[0.04] border border-white/10 rounded-[2rem] outline-none focus:ring-[12px] focus:ring-indigo-500/5 focus:border-indigo-500/40 transition-all text-white font-bold text-lg placeholder-slate-600"
                      placeholder="Access CIPHER"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-3 group/input">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-4 group-focus-within/input:text-indigo-400 transition-colors">Verify Cipher</label>
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    autoComplete="new-password"
                    className="w-full px-8 py-6 bg-white/[0.04] border border-white/10 rounded-[2rem] outline-none focus:ring-[12px] focus:ring-indigo-500/5 focus:border-indigo-500/40 transition-all text-white font-bold text-lg placeholder-slate-600"
                    placeholder="Repeat Cipher"
                  />
                </div>
              </div>

              <div className="pt-8">
                <button
                  disabled={isProcessing}
                  type="submit"
                  className="w-full bg-white text-slate-950 hover:bg-indigo-400 hover:text-white font-black py-8 rounded-[2.5rem] transition-all duration-500 shadow-3xl shadow-black/40 relative overflow-hidden flex items-center justify-center gap-4 group active:scale-[0.98] disabled:opacity-50"
                >
                  <div className={`flex items-center gap-4 transition-all duration-500 ${isProcessing ? 'opacity-0 scale-90 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
                    <span className="text-sm uppercase tracking-[0.5em] font-black">Provision Workspace</span>
                    <ICONS.Bolt className="w-6 h-6 group-hover:rotate-12 transition-transform duration-500" />
                  </div>

                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center gap-4 animate-fade-in text-slate-950">
                      <div className="w-7 h-7 border-4 border-slate-200 border-t-slate-950 rounded-full animate-spin"></div>
                      <span className="text-xs font-black uppercase tracking-[0.3em]">
                        {step === 'encrypting' ? 'Encrypting Identity' : step === 'provisioning' ? 'Allocating Resources' : 'Syncing Nodes'}
                      </span>
                    </div>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-16 text-center border-t border-white/5 pt-10">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] max-w-lg mx-auto leading-relaxed group-hover:text-slate-400 transition-colors">
                By initializing this link, you agree to the <span className="text-indigo-400 cursor-pointer hover:underline">BizFlow Sovereign Data Protocol</span> and <span className="text-indigo-400 cursor-pointer hover:underline">Enterprise Service Agreement</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8 opacity-40 group hover:opacity-100 transition-opacity">
          <div className="flex gap-8">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Terms of Service</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Compliance</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-slate-800"></div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">&copy; 2025 BIZFLOW EXECUTIVE HQ</span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
