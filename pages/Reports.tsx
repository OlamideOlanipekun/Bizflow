
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell
} from 'recharts';
import { api } from '../services/mockApi';
import { GoogleGenAI } from "@google/genai";
import { ICONS } from '../constants';

const Reports: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState('Q1 2024');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadData = async (timeframe: string) => {
    setIsUpdating(true);
    const stats = await api.getDashboardStats();
    
    // Simulate different data per quarter
    const multiplier = timeframe === 'Q1 2024' ? 1 : timeframe === 'Q4 2023' ? 0.85 : 0.7;
    
    setReportData({
      ...stats,
      categoryRevenue: [
        { name: 'Software', amount: 45000 * multiplier, color: '#4f46e5' },
        { name: 'Consulting', amount: 28000 * multiplier, color: '#10b981' },
        { name: 'Marketing', amount: 15000 * multiplier, color: '#f59e0b' },
        { name: 'Support', amount: 12000 * multiplier, color: '#f43f5e' },
      ],
      acquisitionData: [
        { month: 'Oct', organic: 400 * multiplier, paid: 150 * multiplier },
        { month: 'Nov', organic: 300 * multiplier, paid: 250 * multiplier },
        { month: 'Dec', organic: 200 * multiplier, paid: 210 * multiplier },
        { month: 'Jan', organic: 278 * multiplier, paid: 190 * multiplier },
        { month: 'Feb', organic: 189 * multiplier, paid: 350 * multiplier },
        { month: 'Mar', organic: 239 * multiplier, paid: 420 * multiplier },
      ]
    });
    
    setTimeout(() => setIsUpdating(false), 600);
  };

  useEffect(() => {
    loadData(activeTimeframe);
  }, []);

  const handleTimeframeChange = (q: string) => {
    setActiveTimeframe(q);
    loadData(q);
  };

  const generateAIAnalysis = async () => {
    if (!reportData) return;
    setIsAiLoading(true);
    setAiInsight('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        As a market analyst for BizFlow, analyze these category earnings for ${activeTimeframe}:
        ${reportData.categoryRevenue.map((c: any) => `${c.name}: $${c.amount.toLocaleString()}`).join(', ')}
        
        Total quarterly growth: ${reportData.monthlyGrowth}%
        
        Task: Provide a 3-sentence high-level market sentiment analysis. 
        Discuss which sector is leading and where the business should pivot next quarter.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      setAiInsight(response.text || "Market indicators show strong software performance. Recommend increasing marketing spend in consulting sectors.");
    } catch (error) {
      console.error(error);
      setAiInsight("Intelligence engine encountered an error. Manual projection required based on existing liquidity trends.");
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!reportData) return <div className="p-12 text-slate-400 font-black uppercase tracking-widest">Initialising Reports...</div>;

  return (
    <div className={`max-w-[1600px] mx-auto space-y-12 pb-20 transition-opacity duration-300 ${isUpdating ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-indigo-600/10 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Strategy Engine</span>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Data Synced</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">Market Intelligence</h1>
          <p className="text-slate-500 font-medium text-lg mt-2">Deep-dive segmentation of revenue channels and acquisition funnels.</p>
        </div>
        <div className="flex bg-white p-2 rounded-[1.75rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          {['Q3 2023', 'Q4 2023', 'Q1 2024'].map(q => (
            <button 
              key={q}
              onClick={() => handleTimeframeChange(q)}
              className={`px-8 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all ${activeTimeframe === q ? 'bg-slate-950 text-white shadow-lg shadow-indigo-200/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100 relative group overflow-hidden">
            <div className="flex justify-between items-center mb-16 relative z-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Revenue Segmentation</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">Cross-category capital flow for {activeTimeframe}.</p>
              </div>
              <button className="p-5 bg-slate-50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all text-slate-400 group/btn">
                <ICONS.Bolt className="w-5 h-5 transition-transform group-hover/btn:rotate-12" />
              </button>
            </div>
            
            <div className="h-[450px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.categoryRevenue}>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 800}} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc', radius: 10}}
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px', backgroundColor: '#0f172a', color: '#fff'}}
                  />
                  <Bar dataKey="amount" radius={[15, 15, 0, 0]} barSize={80}>
                    {reportData.categoryRevenue.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-slate-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          </div>

          <div className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Growth Archetypes</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">Acquisition channels performance over the quarter.</p>
              </div>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportData.acquisitionData}>
                  <defs>
                    <linearGradient id="repOrg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="repPaid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                     contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)', padding: '20px'}}
                  />
                  <Area type="monotone" dataKey="organic" stroke="#4f46e5" strokeWidth={5} fillOpacity={1} fill="url(#repOrg)" />
                  <Area type="monotone" dataKey="paid" stroke="#f59e0b" strokeWidth={5} fillOpacity={1} fill="url(#repPaid)" strokeDasharray="10 10" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 h-full">
          <div className="bg-slate-950 text-white rounded-[4rem] p-12 shadow-3xl relative overflow-hidden h-full flex flex-col min-h-[700px]">
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-6 mb-16">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center border border-white/20 glow-indigo">
                  <ICONS.Sparkles className={`w-10 h-10 text-indigo-400 ${isAiLoading ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight leading-none">Market Analyst</h3>
                  <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Synthesized Reasoning</p>
                </div>
              </div>

              <div className="flex-1 bg-white/5 border border-white/10 rounded-[3rem] p-10 overflow-y-auto custom-scrollbar shadow-inner backdrop-blur-lg">
                {isAiLoading ? (
                  <div className="space-y-8 py-4">
                    <div className="h-4 bg-white/10 rounded-full w-full animate-pulse"></div>
                    <div className="h-4 bg-white/10 rounded-full w-[90%] animate-pulse"></div>
                    <div className="h-4 bg-white/10 rounded-full w-[95%] animate-pulse"></div>
                    <div className="h-4 bg-white/10 rounded-full w-[80%] animate-pulse"></div>
                    <div className="h-4 bg-white/10 rounded-full w-[85%] animate-pulse"></div>
                  </div>
                ) : aiInsight ? (
                  <div className="space-y-8">
                    <p className="text-xl leading-relaxed text-indigo-50 font-medium italic opacity-95 tracking-tight">
                      "{aiInsight}"
                    </p>
                    <div className="flex flex-wrap gap-3 pt-6">
                       <span className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">Sector Alpha</span>
                       <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Pivot Ready</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center h-full flex flex-col items-center justify-center space-y-6">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                       <ICONS.Layout className="w-8 h-8 text-slate-600" />
                    </div>
                    <p className="text-slate-500 font-bold px-8 leading-relaxed">No strategic projection generated for {activeTimeframe} yet.</p>
                  </div>
                )}
              </div>

              <div className="mt-12 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                    <p className="text-3xl font-black text-indigo-400">99.1%</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Accuracy</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                    <p className="text-3xl font-black text-emerald-400">Low</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Risk Bias</p>
                  </div>
                </div>

                <button 
                  onClick={generateAIAnalysis}
                  disabled={isAiLoading || isUpdating}
                  className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[2rem] transition-all shadow-2xl shadow-indigo-900/50 flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  <ICONS.Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Generate Strategic Pivot
                </button>
              </div>
            </div>

            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
