
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell 
} from 'recharts';
import { api } from '../services/mockApi';
import { getBusinessInsights } from '../services/gemini';
import { DashboardStats, Transaction } from '../types';
import { ICONS } from '../constants';

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max === min ? 1 : max - min;
  const width = 120;
  const height = 40;
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((d - min) / range) * height
  }));
  const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  
  return (
    <svg width={width} height={height} className="overflow-visible drop-shadow-[0_4px_4px_rgba(0,0,0,0.1)]">
      <path d={pathData} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const StatCard: React.FC<{ 
  title: string; 
  value: string | number; 
  change: string; 
  icon: React.ReactNode; 
  color: string;
  sparklineData: number[];
  sparklineColor: string;
  isPositive?: boolean;
}> = ({ title, value, change, icon, color, sparklineData, sparklineColor, isPositive = true }) => (
  <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden relative">
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] mb-3">{title}</p>
        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
      </div>
      <div className={`p-5 rounded-2xl ${color} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-slate-200/50`}>
        {icon}
      </div>
    </div>
    <div className="mt-12 flex items-end justify-between relative z-10">
      <div className="flex flex-col">
        <div className={`flex items-center gap-1.5 font-black text-sm ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          <span className="text-xs">{isPositive ? '↑' : '↓'}</span>
          {change}
        </div>
        <span className="text-slate-400 text-[10px] font-black uppercase tracking-tight mt-1 opacity-60">Prev. Cycle</span>
      </div>
      <div className="opacity-80 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110">
        <Sparkline data={sparklineData} color={sparklineColor} />
      </div>
    </div>
    <div className={`absolute -right-12 -bottom-12 w-48 h-48 rounded-full opacity-[0.04] blur-3xl ${color}`}></div>
  </div>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  const [revenueTab, setRevenueTab] = useState<'Live' | 'Forecast'>('Live');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  const [quickTx, setQuickTx] = useState({
    customerName: '',
    amount: '',
    category: 'Software',
    status: 'Completed' as Transaction['status']
  });

  const fetchData = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
      setIsLoading(false);
      
      setIsAiLoading(true);
      const insights = await getBusinessInsights(data);
      setAiInsights(insights);
      setIsAiLoading(false);
    } catch (err) {
      console.error("Dashboard Loading Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTx.customerName || !quickTx.amount) return;
    await api.addTransaction({
      customerId: 'm-1',
      customerName: quickTx.customerName,
      amount: parseFloat(quickTx.amount),
      date: new Date().toISOString().split('T')[0],
      category: quickTx.category,
      status: quickTx.status
    });
    showNotification("Liquidity event recorded successfully.");
    setIsQuickAddOpen(false);
    setQuickTx({ customerName: '', amount: '', category: 'Software', status: 'Completed' });
    fetchData();
  };

  const chartData = useMemo(() => {
    if (!stats) return [];
    if (revenueTab === 'Live') return stats.revenueChart;
    return stats.revenueChart.map(d => ({
      ...d,
      amount: d.amount * (1.18 + Math.random() * 0.12)
    }));
  }, [stats, revenueTab]);

  if (isLoading || !stats) {
    return (
      <div className="flex flex-col gap-12 animate-pulse">
        <div className="space-y-4">
           <div className="h-4 w-32 bg-slate-200 rounded-full"></div>
           <div className="h-16 w-[450px] bg-slate-200 rounded-3xl"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {[1,2,3,4].map(i => <div key={i} className="h-56 bg-slate-200 rounded-[3rem]"></div>)}
        </div>
        <div className="h-[600px] bg-slate-200 rounded-[4rem]"></div>
      </div>
    );
  }

  const pieData = [
    { name: 'Core SaaS', value: 68, color: '#4f46e5' },
    { name: 'Consulting', value: 22, color: '#10b981' },
    { name: 'On-Demand', value: 10, color: '#f43f5e' },
  ];

  return (
    <div className="max-w-[1700px] mx-auto space-y-12 pb-24 animate-fade-in">
      {notification && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] bg-slate-950 text-white px-10 py-5 rounded-[2rem] shadow-3xl flex items-center gap-5 border border-white/10 glow-indigo border-indigo-500/20">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
            <ICONS.Bolt className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-sm font-black tracking-[0.1em] uppercase">{notification}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse"></div>
             <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Ecosystem Status: High-Performance</span>
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">Command Center</h1>
          <p className="text-slate-500 font-medium text-xl max-w-2xl">Real-time synthesis of corporate capital, market reach, and strategic velocity.</p>
        </div>
        <div className="flex items-center gap-5 bg-white p-3 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
           <div className="flex bg-slate-50 rounded-[1.75rem] p-1.5 border border-slate-100">
             {['Overview', 'Analysis', 'Audit'].map(t => (
               <button key={t} className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${t === 'Overview' ? 'bg-slate-950 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>{t}</button>
             ))}
           </div>
           <button 
             onClick={() => setIsQuickAddOpen(true)}
             className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 flex items-center gap-4 group"
           >
             <ICONS.Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
             Execute Entry
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <StatCard 
          title="Revenue Pipeline" 
          value={`$${stats.totalRevenue.toLocaleString()}`} 
          change="24.8%" 
          icon={<ICONS.TrendingUp className="w-7 h-7 text-indigo-600" />} 
          color="bg-indigo-50"
          sparklineData={[30, 42, 38, 55, 62, 78, 85]}
          sparklineColor="#4f46e5"
        />
        <StatCard 
          title="Account Expansion" 
          value={stats.totalCustomers} 
          change="6.1%" 
          icon={<ICONS.Customers className="w-7 h-7 text-emerald-600" />} 
          color="bg-emerald-50"
          sparklineData={[40, 45, 42, 58, 55, 62, 68]}
          sparklineColor="#10b981"
        />
        <StatCard 
          title="Conversion Velocity" 
          value="58/hr" 
          change="18.2%" 
          icon={<ICONS.Bolt className="w-7 h-7 text-amber-600" />} 
          color="bg-amber-50"
          sparklineData={[20, 35, 28, 45, 52, 48, 58]}
          sparklineColor="#f59e0b"
        />
        <StatCard 
          title="Exit Frequency" 
          value="1.2%" 
          change="0.2%" 
          icon={<ICONS.Bell className="w-7 h-7 text-rose-600" />} 
          color="bg-rose-50"
          sparklineData={[15, 12, 18, 10, 8, 6, 4]}
          sparklineColor="#f43f5e"
          isPositive={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-white p-14 rounded-[4rem] shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8 relative z-10">
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Financial Trajectory</h3>
                <p className="text-slate-400 text-base font-medium mt-2">Historical accumulation vs intelligent forecasting.</p>
              </div>
              <div className="flex bg-slate-50 p-2.5 rounded-[2rem] border border-slate-100 shadow-inner">
                {['Live', 'Forecast'].map((tab: any) => (
                  <button 
                    key={tab} 
                    onClick={() => setRevenueTab(tab)}
                    className={`px-10 py-4 text-[11px] font-black uppercase tracking-[0.25em] rounded-2xl transition-all ${revenueTab === tab ? 'bg-white shadow-xl text-indigo-600 border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[550px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="dbGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 800}} dy={25} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 800}} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{borderRadius: '32px', border: 'none', boxShadow: '0 30px 60px -12px rgb(0 0 0 / 0.2)', padding: '24px', backgroundColor: '#0f172a', color: '#fff'}}
                    cursor={{ stroke: '#6366f1', strokeWidth: 3, strokeDasharray: '6 6' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke={revenueTab === 'Live' ? "#4f46e5" : "#10b981"} 
                    strokeWidth={8} 
                    fillOpacity={1} 
                    fill="url(#dbGlow)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-0 opacity-40"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Portfolio Mix</h3>
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Global Node</span>
              </div>
              <div className="h-72 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={95} outerRadius={120} paddingAngle={10} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" cornerRadius={16} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-5xl font-black text-slate-900 leading-none">94%</span>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-3 opacity-60">Engagement</span>
                </div>
              </div>
              <div className="mt-14 space-y-4">
                {pieData.map(d => (
                  <div key={d.name} className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl hover:bg-white hover:shadow-2xl hover:scale-[1.03] transition-all cursor-default border border-transparent hover:border-slate-100 group">
                    <div className="flex items-center gap-4">
                      <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{backgroundColor: d.color}}></div>
                      <span className="text-sm font-black text-slate-700">{d.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100 flex flex-col">
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Live Pulse</h3>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Real-time</span>
                </div>
              </div>
              <div className="space-y-10 flex-1">
                {[
                  { user: 'JS', text: 'Jane Smith upgraded to Enterprise', time: 'Just now', color: 'bg-emerald-100 text-emerald-600' },
                  { user: 'RD', text: 'Robert D. opened high-tier ticket #442', time: '14m ago', color: 'bg-indigo-100 text-indigo-600' },
                  { user: 'MM', text: 'Marcus M. requested strategy review', time: '1h ago', color: 'bg-amber-100 text-amber-600' },
                  { user: 'AL', text: 'Infrastructure Health Check: Stable', time: '4h ago', color: 'bg-slate-100 text-slate-600' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-5 group cursor-pointer">
                    <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-sm font-black transition-all group-hover:scale-110 group-hover:-rotate-6 ${item.color} shadow-lg shadow-slate-100`}>
                      {item.user}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-slate-800 leading-tight mb-1.5 group-hover:text-indigo-600 transition-colors">{item.text}</p>
                      <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/transactions" className="w-full mt-14 py-6 bg-slate-950 text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-[2rem] transition-all hover:bg-indigo-600 hover:shadow-3xl hover:shadow-indigo-200 text-center">
                Full Audit Trail
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 h-full">
          <div className="bg-slate-950 text-white rounded-[5rem] p-14 shadow-3xl relative overflow-hidden h-full flex flex-col min-h-[650px]">
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-6 mb-16">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center border border-white/20 glow-indigo">
                  <ICONS.Sparkles className={`w-10 h-10 text-indigo-400 ${isAiLoading ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black tracking-[0.5em] uppercase text-indigo-400 mb-2">Strategy Hub</h4>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${isAiLoading ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                    <span className="text-sm font-bold text-slate-300">BizFlow AI v3.2 Core</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/10 shadow-inner overflow-y-auto custom-scrollbar">
                {isAiLoading ? (
                  <div className="space-y-8 py-2">
                    <div className="h-4 bg-white/10 rounded-full w-full animate-pulse"></div>
                    <div className="h-4 bg-white/10 rounded-full w-[85%] animate-pulse"></div>
                    <div className="h-4 bg-white/10 rounded-full w-[95%] animate-pulse"></div>
                    <div className="h-4 bg-white/10 rounded-full w-[70%] animate-pulse"></div>
                  </div>
                ) : (
                  <p className="text-xl leading-relaxed text-slate-100 font-medium italic tracking-tight opacity-95">
                    "{aiInsights}"
                  </p>
                )}
              </div>

              <div className="mt-14 space-y-5">
                <button 
                  onClick={async () => {
                    setIsAiLoading(true);
                    const insights = await getBusinessInsights(stats!);
                    setAiInsights(insights);
                    setIsAiLoading(false);
                    showNotification("AI recalculating strategic nodes.");
                  }}
                  disabled={isAiLoading}
                  className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.4em] rounded-[2rem] transition-all shadow-2xl shadow-indigo-900/50 flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  <ICONS.Bolt className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  Synthesize Strategy
                </button>
                <div className="flex justify-center items-center gap-4 opacity-30">
                  <span className="w-10 h-px bg-slate-500"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">LLM Deep Integration</span>
                  <span className="w-10 h-px bg-slate-500"></span>
                </div>
              </div>
            </div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]"></div>
          </div>
        </div>
      </div>

      {isQuickAddOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-3xl p-10">
          <div className="bg-white w-full max-w-3xl rounded-[5rem] shadow-[0_0_120px_rgba(0,0,0,0.6)] overflow-hidden animate-scale-in border border-white/20">
            <div className="p-16 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="space-y-2">
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Record Flow</h2>
                <p className="text-slate-500 font-medium text-lg">Input a new financial activity into the global ledger.</p>
              </div>
              <button 
                onClick={() => setIsQuickAddOpen(false)}
                className="p-7 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-[2.5rem] transition-all shadow-sm border border-slate-100"
              >
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleQuickAdd} className="p-20 space-y-12">
              <div className="grid grid-cols-2 gap-12">
                <div className="col-span-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5">Beneficiary Identity</label>
                  <input 
                    required
                    type="text" 
                    value={quickTx.customerName}
                    onChange={(e) => setQuickTx({...quickTx, customerName: e.target.value})}
                    placeholder="Principal or Corporate Entity"
                    className="w-full px-10 py-7 bg-slate-50 border border-slate-100 rounded-[2.5rem] outline-none focus:ring-[15px] focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-black text-slate-900 placeholder-slate-300 text-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5">Capital Flow ($)</label>
                  <input 
                    required
                    type="number" 
                    value={quickTx.amount}
                    onChange={(e) => setQuickTx({...quickTx, amount: e.target.value})}
                    placeholder="0.00"
                    className="w-full px-10 py-7 bg-slate-50 border border-slate-100 rounded-[2.5rem] outline-none focus:ring-[15px] focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-black text-slate-900 placeholder-slate-300 text-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-5">Sector Category</label>
                  <div className="relative">
                    <select 
                      value={quickTx.category}
                      onChange={(e) => setQuickTx({...quickTx, category: e.target.value})}
                      className="w-full px-10 py-7 bg-slate-50 border border-slate-100 rounded-[2.5rem] outline-none focus:ring-[15px] focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-black text-slate-900 cursor-pointer text-xl appearance-none"
                    >
                      <option>Software</option>
                      <option>Infrastructure</option>
                      <option>Marketing</option>
                      <option>Advisory</option>
                      <option>Operations</option>
                    </select>
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-12 flex gap-8">
                <button 
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="flex-1 py-7 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black text-xs uppercase tracking-[0.4em] rounded-[2.5rem] transition-all"
                >
                  Discard Event
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-7 bg-slate-950 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.4em] rounded-[2.5rem] transition-all shadow-3xl shadow-slate-200"
                >
                  Commit to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
