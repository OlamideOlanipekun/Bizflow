
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
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>

      <div className="w-full max-w-2xl relative z-10 animate-fade-in">
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[4rem] shadow-[0_48px_128px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="p-16">
            <div className="flex justify-between items-start mb-16">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-indigo-900/40">B</div>
                <h1 className="text-5xl font-black text-white tracking-tighter leading-none">Initialize Link</h1>
                <p className="text-slate-400 text-lg font-medium">Provision your dedicated executive workspace.</p>
              </div>
              <Link to="/login" className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all">
                Login Instead
              </Link>
            </div>

            {error && (
              <div className="mb-10 p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center gap-4 text-rose-400 animate-fade-in">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                <p className="text-sm font-black uppercase tracking-tight">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4 col-span-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-4">Principal Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-8 py-6 bg-white/[0.04] border border-white/10 rounded-[2rem] outline-none focus:ring-[12px] focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all text-white font-bold text-lg"
                    placeholder="Alex Johnson"
                  />
                </div>
                
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-4">Entity Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-8 py-6 bg-white/[0.04] border border-white/10 rounded-[2rem] outline-none focus:ring-[12px] focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all text-white font-bold text-lg"
                    placeholder="alex@bizflow.io"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-4">Corporate Entity</label>
                  <input
                    required
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-8 py-6 bg-white/[0.04] border border-white/10 rounded-[2rem] outline-none focus:ring-[12px] focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all text-white font-bold text-lg"
                    placeholder="Global Systems Inc."
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-4">Access Token</label>
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-8 py-6 bg-white/[0.04] border border-white/10 rounded-[2rem] outline-none focus:ring-[12px] focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all text-white font-bold text-lg"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] px-4">Confirm Token</label>
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full px-8 py-6 bg-white/[0.04] border border-white/10 rounded-[2rem] outline-none focus:ring-[12px] focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all text-white font-bold text-lg"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  disabled={isProcessing}
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-8 rounded-[2.5rem] transition-all shadow-3xl shadow-indigo-900/40 relative overflow-hidden flex items-center justify-center gap-4 group"
                >
                  <div className={`flex items-center gap-4 transition-all duration-300 ${isProcessing ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                    <span className="text-sm uppercase tracking-[0.4em]">Initialize Workspace</span>
                    <ICONS.Bolt className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  </div>

                  {isProcessing && (
                    <div className="absolute inset-0 flex items-center justify-center gap-4 animate-fade-in">
                      <div className="w-7 h-7 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span className="text-xs font-black uppercase tracking-[0.3em]">
                        {step === 'encrypting' ? 'Encrypting Identity' : step === 'provisioning' ? 'Allocating Resources' : 'Syncing Nodes'}
                      </span>
                    </div>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-16 text-center">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em] max-w-md mx-auto leading-relaxed">
                By initializing this link, you agree to the BizFlow Sovereign Data Protocol and Enterprise Service Agreement.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-8 opacity-40">
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">v2.5 Stable Alpha</span>
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">TLS 1.3 Encryption</span>
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">SLA 99.99%</span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
