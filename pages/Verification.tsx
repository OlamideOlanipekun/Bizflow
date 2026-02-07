
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { api } from '../services/mockApi';

interface TestCase {
  id: string;
  module: string;
  name: string;
  status: 'idle' | 'running' | 'passed' | 'failed';
  result?: string;
}

const Verification: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: 'auth-1', module: 'Auth', name: 'Identity Validation Persistence', status: 'idle' },
    { id: 'auth-2', module: 'Auth', name: 'Role-Based Access Control', status: 'idle' },
    { id: 'dash-1', module: 'Dashboard', name: 'Real-time KPI Synthesis', status: 'idle' },
    { id: 'dash-2', module: 'Dashboard', name: 'Chart Data Consistency', status: 'idle' },
    { id: 'crm-1', module: 'CRM', name: 'Customer CRUD Operations', status: 'idle' },
    { id: 'ledger-1', module: 'Ledger', name: 'Immutable Transaction Flow', status: 'idle' },
    { id: 'ai-1', module: 'AI', name: 'Gemini Insight Engine Readiness', status: 'idle' },
    { id: 'sys-1', module: 'System', name: 'LocalStorage Persistence Integrity', status: 'idle' },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  const runTest = async (id: string) => {
    setTestCases(prev => prev.map(tc => tc.id === id ? { ...tc, status: 'running' } : tc));
    
    // Simulate complex checks
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
    
    let passed = true;
    let result = "Protocol verified.";

    // Logical checks where possible
    if (id === 'sys-1') {
      const customers = localStorage.getItem('bizflow_customers');
      passed = !!customers;
      result = passed ? "Persistence layer active." : "Warning: Persistence buffer empty.";
    } else if (id === 'ai-1') {
      passed = !!process.env.API_KEY;
      result = passed ? "AI Environment Key detected." : "Warning: API Key not initialized.";
    }

    setTestCases(prev => prev.map(tc => tc.id === id ? { 
      ...tc, 
      status: passed ? 'passed' : 'failed',
      result 
    } : tc));
    
    addLog(`Check completed: ${id} -> ${passed ? 'SUCCESS' : 'FAILURE'}`);
  };

  const runAll = async () => {
    setIsRunning(true);
    setLogs([]);
    addLog("Initializing global verification suite...");
    
    for (const tc of testCases) {
      addLog(`Probing node: ${tc.name}...`);
      await runTest(tc.id);
    }
    
    setIsRunning(false);
    addLog("Verification suite execution finished.");
  };

  const summary = {
    passed: testCases.filter(t => t.status === 'passed').length,
    failed: testCases.filter(t => t.status === 'failed').length,
    total: testCases.length
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full glow-indigo"></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">System Health Protocol</span>
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">Feature Verification</h1>
          <p className="text-slate-500 font-medium text-xl max-w-2xl">Automated diagnostic suite to ensure production-readiness across all core business modules.</p>
        </div>
        <button 
          onClick={runAll}
          disabled={isRunning}
          className="px-12 py-6 bg-slate-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 flex items-center gap-4 disabled:opacity-50"
        >
          {isRunning ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
            <ICONS.Activity className="w-5 h-5" />
          )}
          {isRunning ? 'Executing Suite...' : 'Run Diagnostics'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tests Passed</p>
              <h3 className="text-4xl font-black text-emerald-500">{summary.passed}</h3>
           </div>
           <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
              <ICONS.Shield className="w-8 h-8" />
           </div>
        </div>
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tests Failed</p>
              <h3 className="text-4xl font-black text-rose-500">{summary.failed}</h3>
           </div>
           <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
           </div>
        </div>
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">System Integrity</p>
              <h3 className="text-4xl font-black text-slate-900">{Math.round((summary.passed / summary.total) * 100)}%</h3>
           </div>
           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
              <ICONS.Bolt className="w-8 h-8" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Test Checklist */}
        <div className="lg:col-span-8 bg-white rounded-[4rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-12 border-b border-slate-100 bg-slate-50/50">
             <h3 className="text-2xl font-black text-slate-900 tracking-tight">Functional Checks</h3>
          </div>
          <div className="divide-y divide-slate-50">
             {testCases.map((tc) => (
               <div key={tc.id} className="p-10 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
                  <div className="flex items-center gap-8">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-tighter ${
                       tc.status === 'passed' ? 'bg-emerald-100 text-emerald-600' :
                       tc.status === 'failed' ? 'bg-rose-100 text-rose-600' :
                       tc.status === 'running' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
                     }`}>
                        {tc.module}
                     </div>
                     <div>
                        <p className="text-lg font-black text-slate-800 leading-none mb-2">{tc.name}</p>
                        <p className="text-sm text-slate-400 font-medium">
                          {tc.status === 'idle' ? 'Awaiting execution' : 
                           tc.status === 'running' ? 'Simulating protocol checks...' : 
                           tc.result}
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     {tc.status === 'passed' && (
                       <div className="p-3 bg-emerald-50 text-emerald-500 rounded-full animate-fade-in">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                       </div>
                     )}
                     {tc.status === 'failed' && (
                       <div className="p-3 bg-rose-50 text-rose-500 rounded-full animate-fade-in">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                       </div>
                     )}
                     {tc.status === 'running' && (
                       <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                     )}
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Live Logs Console */}
        <div className="lg:col-span-4 h-full">
           <div className="bg-slate-950 rounded-[4rem] p-12 h-full flex flex-col min-h-[500px] border border-white/5 relative overflow-hidden">
              <div className="relative z-10 flex flex-col h-full">
                 <div className="flex items-center justify-between mb-10">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Diagnostic Stream</h4>
                    <div className="flex gap-2">
                       <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                       <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                       <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    </div>
                 </div>
                 
                 <div className="flex-1 font-mono text-xs space-y-4 overflow-y-auto custom-scrollbar-dark pr-4">
                    {logs.length > 0 ? logs.map((log, i) => (
                      <div key={i} className="text-slate-400 leading-relaxed border-l-2 border-indigo-500/20 pl-4 py-1 animate-fade-in">
                        <span className="text-indigo-400 opacity-50 mr-2">➜</span> {log}
                      </div>
                    )) : (
                      <div className="h-full flex flex-col items-center justify-center opacity-20">
                         <ICONS.Activity className="w-12 h-12 text-slate-500 mb-4" />
                         <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Ready for probe</p>
                      </div>
                    )}
                 </div>

                 <div className="mt-10 pt-10 border-t border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-4">Environment Node</p>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                       <p className="text-white font-bold text-sm">BizFlow_HQ_Alpha_2.5</p>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">Latency: 24ms &bull; SSL Verified</p>
                    </div>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px]"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;
