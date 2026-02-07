
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { api } from '../services/api';

type SettingsTab = 'Profile' | 'Security' | 'Notifications' | 'Billing' | 'AI';

const Settings: React.FC = () => {
   const [activeTab, setActiveTab] = useState<SettingsTab>('Profile');
   const [isSaving, setIsSaving] = useState(false);
   const [toast, setToast] = useState<string | null>(null);
   const [user, setUser] = useState<any>(null);
   const [profile, setProfile] = useState({ name: '', email: '', orgUnit: 'Executive Leadership' });

   useEffect(() => {
      const fetchUserData = async () => {
         try {
            const data = await api.getMe();
            setUser(data);
            setProfile({
               name: data.name || '',
               email: data.email || '',
               orgUnit: data.orgUnit || 'Executive Leadership'
            });
         } catch (err) {
            console.error('Failed to fetch user:', err);
         }
      };
      fetchUserData();
   }, []);

   const showToast = (msg: string) => {
      setToast(msg);
      setTimeout(() => setToast(null), 3000);
   };

   const handleSave = async () => {
      setIsSaving(true);
      try {
         if (activeTab === 'Profile') {
            await api.updateProfile({ name: profile.name, email: profile.email });
            // Update local storage if needed, or just refresh
            const updatedUser = await api.getMe();
            localStorage.setItem('bizflow_user', JSON.stringify({ ...JSON.parse(localStorage.getItem('bizflow_user') || '{}'), ...updatedUser }));
         } else {
            // Other settings
            await api.updateSettings({
               company_name: 'BizFlow Enterprise',
               timezone: 'UTC'
            });
         }
         showToast('Settings successfully updated');
      } catch (err) {
         console.error('Failed to update settings:', err);
         showToast('Failed to save settings');
      } finally {
         setIsSaving(false);
      }
   };

   const tabs: { label: SettingsTab; icon: any }[] = [
      { label: 'Profile', icon: ICONS.Customers },
      { label: 'Security', icon: ICONS.Bolt },
      { label: 'Notifications', icon: ICONS.Bell },
      { label: 'Billing', icon: ICONS.Transactions },
      { label: 'AI', icon: ICONS.Sparkles },
   ];

   return (
      <div className="max-w-[1400px] mx-auto space-y-10 pb-20 animate-fade-in">
         {/* Toast Notification */}
         {toast && (
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10 glow-indigo">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
               <p className="text-sm font-black tracking-tight uppercase">{toast}</p>
            </div>
         )}

         {/* Header */}
         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-2">
               <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">System Configuration</span>
               </div>
               <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Settings</h1>
               <p className="text-slate-500 font-medium text-lg">Customize your experience and manage ecosystem parameters.</p>
            </div>
            <button
               onClick={handleSave}
               disabled={isSaving}
               className="px-8 py-4 bg-slate-950 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center gap-3 disabled:opacity-50"
            >
               {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
               ) : (
                  <ICONS.Bolt className="w-5 h-5" />
               )}
               {isSaving ? 'Processing...' : 'Apply Changes'}
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Settings Navigation */}
            <div className="lg:col-span-3 space-y-4">
               <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-1">
                  {tabs.map((tab) => (
                     <button
                        key={tab.label}
                        onClick={() => setActiveTab(tab.label)}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${activeTab === tab.label
                           ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100'
                           : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                           }`}
                     >
                        <tab.icon className={`w-5 h-5 ${activeTab === tab.label ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                        <span className="text-sm font-black tracking-tight">{tab.label}</span>
                        {activeTab === tab.label && (
                           <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                     </button>
                  ))}
               </div>

               <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Subscription</p>
                     <h4 className="text-2xl font-black tracking-tight leading-none">Enterprise Suite</h4>
                     <p className="text-sm font-medium opacity-80 leading-relaxed">Full access to AI Strategist, priority support, and multi-tenant ledger.</p>
                     <button className="text-xs font-black uppercase tracking-widest bg-white text-indigo-600 px-6 py-3 rounded-xl shadow-lg">Manage Plan</button>
                  </div>
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
               </div>
            </div>

            {/* Settings Content Area */}
            <div className="lg:col-span-9">
               <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 min-h-[600px] animate-fade-in" key={activeTab}>
                  {activeTab === 'Profile' && (
                     <div className="space-y-12">
                        <div className="flex flex-col md:flex-row items-center gap-10 pb-10 border-b border-slate-100">
                           <div className="relative group">
                              <img
                                 src="https://picsum.photos/seed/alex/300"
                                 alt="Profile"
                                 className="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-2xl group-hover:opacity-80 transition-opacity"
                              />
                              <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40 rounded-[2.5rem]">
                                 <ICONS.Plus className="w-8 h-8 text-white" />
                              </button>
                           </div>
                           <div className="text-center md:text-left space-y-3">
                              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Profile Details</h3>
                              <p className="text-slate-500 font-medium">Update your digital presence across the workspace.</p>
                              <div className="flex gap-3">
                                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">HQ Admin</span>
                                 <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">v2.4 Core</span>
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="space-y-4">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Legal Name</label>
                              <input
                                 type="text"
                                 defaultValue={profile.name} onChange={(e: any) => setProfile({ ...profile, name: e.target.value })}
                                 className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-[10px] focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-bold text-slate-900"
                              />
                           </div>
                           <div className="space-y-4">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                              <input
                                 type="email"
                                 defaultValue={profile.email} onChange={(e: any) => setProfile({ ...profile, email: e.target.value })}
                                 className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-[10px] focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-bold text-slate-900"
                              />
                           </div>
                           <div className="space-y-4">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Department / Company</label>
                              <input
                                 type="text"
                                 defaultValue={profile.orgUnit} onChange={(e: any) => setProfile({ ...profile, orgUnit: e.target.value })}
                                 className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-[10px] focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-bold text-slate-900"
                              />
                           </div>
                           <div className="space-y-4">
                              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Timezone</label>
                              <select className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none focus:ring-[10px] focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-bold text-slate-900 appearance-none">
                                 <option>(GMT-08:00) Pacific Time</option>
                                 <option>(GMT+00:00) UTC</option>
                                 <option>(GMT+01:00) Central Europe</option>
                              </select>
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'Security' && (
                     <div className="space-y-12">
                        <div className="pb-10 border-b border-slate-100">
                           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Security Settings</h3>
                           <p className="text-slate-500 font-medium mt-1">Manage authentication protocols and session security.</p>
                        </div>

                        <div className="space-y-8">
                           <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                                    <ICONS.Bolt className="w-7 h-7" />
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-slate-900">Multi-Factor Authentication</p>
                                    <p className="text-xs text-slate-500 font-medium">Add a secondary verification layer via Authenticator app.</p>
                                 </div>
                              </div>
                              <button className="relative inline-flex h-8 w-14 items-center rounded-full bg-emerald-500">
                                 <span className="translate-x-7 inline-block h-6 w-6 transform rounded-full bg-white transition" />
                              </button>
                           </div>

                           <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                                    <ICONS.Search className="w-7 h-7" />
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-slate-900">Audit Logs Tracking</p>
                                    <p className="text-xs text-slate-500 font-medium">Capture detailed session activity for compliance.</p>
                                 </div>
                              </div>
                              <button className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-200">
                                 <span className="translate-x-1 inline-block h-6 w-6 transform rounded-full bg-white transition" />
                              </button>
                           </div>

                           <div className="pt-8 space-y-6">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Credential Refresh</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <input type="password" placeholder="Current Token" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-bold text-slate-900" />
                                 <input type="password" placeholder="New Access Token" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-bold text-slate-900" />
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'Notifications' && (
                     <div className="space-y-12">
                        <div className="pb-10 border-b border-slate-100">
                           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Notification Settings</h3>
                           <p className="text-slate-500 font-medium mt-1">Configure automated alerts and system transmissions.</p>
                        </div>

                        <div className="space-y-10">
                           {[
                              { title: 'Liquidity Events', desc: 'Alerts for successful high-value transactions (> $1,000)', status: true },
                              { title: 'Lead Generation', desc: 'Real-time pings for new customer onboardings', status: true },
                              { title: 'Strategic Re-sync', desc: 'Weekly AI summary and market shift reports', status: false },
                              { title: 'Operational Status', desc: 'Ecosystem health and API uptime notifications', status: true }
                           ].map((item, i) => (
                              <div key={i} className="flex items-start justify-between">
                                 <div className="max-w-md">
                                    <p className="text-base font-black text-slate-900 tracking-tight">{item.title}</p>
                                    <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">{item.desc}</p>
                                 </div>
                                 <button className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${item.status ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                    <span className={`${item.status ? 'translate-x-6' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200`} />
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {activeTab === 'Billing' && (
                     <div className="space-y-12">
                        <div className="pb-10 border-b border-slate-100">
                           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Billing & Payments</h3>
                           <p className="text-slate-500 font-medium mt-1">Manage corporate billing details and payment infrastructure.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                           <div className="p-10 bg-slate-950 text-white rounded-[2.5rem] space-y-8 relative overflow-hidden">
                              <div className="flex justify-between items-start relative z-10">
                                 <div className="w-14 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-400/30">
                                    <div className="flex gap-1">
                                       <div className="w-4 h-4 bg-rose-500 rounded-full"></div>
                                       <div className="w-4 h-4 bg-amber-500/60 rounded-full -ml-2"></div>
                                    </div>
                                 </div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Primary Card</p>
                              </div>
                              <div className="relative z-10">
                                 <p className="text-xl font-mono tracking-widest">•••• •••• •••• 8842</p>
                                 <div className="flex justify-between mt-4">
                                    <p className="text-[10px] font-bold opacity-60 uppercase">Exp 12/28</p>
                                    <p className="text-xs font-black uppercase tracking-widest">VISA PLATINUM</p>
                                 </div>
                              </div>
                              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
                           </div>
                           <div className="p-10 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4 hover:bg-slate-50 transition-all cursor-pointer">
                              <div className="p-4 bg-slate-100 rounded-full text-slate-400">
                                 <ICONS.Plus className="w-6 h-6" />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-slate-900">Add Payment Method</p>
                                 <p className="text-xs text-slate-400 font-medium">Link a new credit card or treasury account.</p>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Billing History</h4>
                           <div className="divide-y divide-slate-100 border-t border-slate-100">
                              {[
                                 { id: 'INV-001', date: 'Mar 01, 2024', amount: '$499.00', status: 'Paid' },
                                 { id: 'INV-002', date: 'Feb 01, 2024', amount: '$499.00', status: 'Paid' },
                                 { id: 'INV-003', date: 'Jan 01, 2024', amount: '$499.00', status: 'Paid' }
                              ].map(inv => (
                                 <div key={inv.id} className="flex items-center justify-between py-6">
                                    <div className="flex items-center gap-4">
                                       <div className="p-3 bg-slate-50 rounded-xl text-slate-400"><ICONS.Layout className="w-4 h-4" /></div>
                                       <div>
                                          <p className="text-sm font-black text-slate-800">{inv.id}</p>
                                          <p className="text-xs text-slate-400 font-medium">{inv.date}</p>
                                       </div>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-sm font-black text-slate-900">{inv.amount}</p>
                                       <p className="text-[10px] text-emerald-500 font-black uppercase">{inv.status}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'AI' && (
                     <div className="space-y-12">
                        <div className="pb-10 border-b border-slate-100">
                           <h3 className="text-2xl font-black text-slate-900 tracking-tight">Intelligence Parameters</h3>
                           <p className="text-slate-500 font-medium mt-1">Refine the behavior of the Gemini Strategist engine.</p>
                        </div>

                        <div className="space-y-10">
                           <div className="space-y-6">
                              <div className="flex justify-between items-center">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Strategist Creativity</p>
                                 <span className="text-xs font-black text-indigo-600">Adaptive (0.7)</span>
                              </div>
                              <input type="range" className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                              <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                                 <span>Deterministic</span>
                                 <span>Conservative</span>
                                 <span>Creative</span>
                              </div>
                           </div>

                           <div className="p-10 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 space-y-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                                    <ICONS.Sparkles className="w-6 h-6" />
                                 </div>
                                 <h4 className="text-lg font-black text-slate-900 tracking-tight">Auto-Analysis Engine</h4>
                              </div>
                              <p className="text-sm text-slate-600 font-medium leading-relaxed">When enabled, BizFlow AI will proactively scan your transactions and market trends every 6 hours to surface potential optimizations before you log in.</p>
                              <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100">Toggle Deep-Scan</button>
                           </div>

                           <div className="space-y-6">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-2">Primary Model Interface</h4>
                              <div className="grid grid-cols-2 gap-4">
                                 <button className="p-6 bg-slate-950 text-white rounded-3xl border border-white/10 text-left space-y-2 ring-4 ring-indigo-500/20">
                                    <p className="text-sm font-black tracking-tight">Gemini 3 Flash</p>
                                    <p className="text-[10px] font-bold opacity-60 uppercase">Speed Optimized &bull; Default</p>
                                 </button>
                                 <button className="p-6 bg-white rounded-3xl border border-slate-100 text-left space-y-2 hover:bg-slate-50 transition-all">
                                    <p className="text-sm font-black text-slate-900 tracking-tight">Gemini 3 Pro</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Complex Reasoning &bull; Preview</p>
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Settings;
