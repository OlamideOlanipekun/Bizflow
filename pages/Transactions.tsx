
import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { Transaction } from '../types';
import { ICONS } from '../constants';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    const data = await api.getTransactions();
    setTransactions(data);
    setIsLoading(false);
  };

  const filteredTxs = useMemo(() => {
    return transactions.filter(t =>
      (filter === 'All' || t.status === filter) &&
      (t.customerName.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()))
    );
  }, [transactions, filter, search]);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Ledger exported successfully. Check your secure downloads directory.');
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-12 animate-fade-in pb-24">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]"></span>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Transaction History</span>
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">Transactions</h1>
          <p className="text-slate-500 font-medium text-xl mt-4">Transparent record of all ecosystem liquidity flows and corporate capital migrations.</p>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-white border border-slate-200 text-slate-700 px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-4 hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/50 disabled:opacity-50"
          >
            {isExporting ? (
              <div className="w-5 h-5 border-2 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            )}
            <span>{isExporting ? 'Generating Report...' : 'Export Data'}</span>
          </button>
          <button className="bg-slate-950 hover:bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-4 transition-all shadow-3xl shadow-slate-200 group">
            <ICONS.Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[4rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-14 border-b border-slate-100 flex flex-col xl:flex-row gap-12 justify-between items-center bg-slate-50/20">
          <div className="flex bg-white p-2.5 rounded-[2.5rem] shadow-sm border border-slate-100 flex-shrink-0">
            {['All', 'Completed', 'Pending', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-10 py-4 rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.25em] transition-all ${filter === status
                  ? 'bg-slate-950 text-white shadow-2xl shadow-indigo-200/20'
                  : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="relative w-full xl:w-[550px]">
            <ICONS.Search className="w-5 h-5 absolute left-7 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Search by ID, category, or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-10 py-5 bg-white border border-slate-200 rounded-[2rem] outline-none focus:ring-[15px] focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-black text-slate-800 placeholder-slate-300 text-lg shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] border-b border-slate-100">
              <tr>
                <th className="px-14 py-8">Trace Reference</th>
                <th className="px-14 py-8">Beneficiary Node</th>
                <th className="px-14 py-8">Industry Sector</th>
                <th className="px-14 py-8">Timestamp</th>
                <th className="px-14 py-8">Capital Flow</th>
                <th className="px-14 py-8 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && !transactions.length ? (
                [1, 2, 3, 4, 5, 6].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-14 py-12"><div className="h-8 bg-slate-100 rounded-2xl w-full"></div></td>
                  </tr>
                ))
              ) : filteredTxs.length > 0 ? (
                filteredTxs.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-all group border-l-4 border-l-transparent hover:border-l-indigo-500">
                    <td className="px-14 py-8 font-mono text-xs font-black text-slate-400 group-hover:text-indigo-600 tracking-widest">#{tx.id.toUpperCase()}</td>
                    <td className="px-14 py-8">
                      <p className="text-lg font-black text-slate-900 group-hover:translate-x-1 transition-transform">{tx.customerName}</p>
                    </td>
                    <td className="px-14 py-8">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-5 py-2 bg-slate-100 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">{tx.category}</span>
                    </td>
                    <td className="px-14 py-8 text-sm font-black text-slate-500">{tx.date}</td>
                    <td className="px-14 py-8">
                      <p className="text-2xl font-black text-slate-900 leading-none tracking-tighter">${tx.amount.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase mt-2 tracking-widest">Authorized Flow</p>
                    </td>
                    <td className="px-14 py-8 text-right">
                      <div className="flex items-center justify-end gap-4">
                        <div className={`w-3 h-3 rounded-full ${tx.status === 'Completed' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' :
                          tx.status === 'Pending' ? 'bg-amber-500 animate-pulse' : 'bg-rose-500'
                          }`}></div>
                        <span className={`text-[11px] font-black uppercase tracking-widest ${tx.status === 'Completed' ? 'text-emerald-600' :
                          tx.status === 'Pending' ? 'text-amber-600' : 'text-rose-600'
                          }`}>
                          {tx.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-14 py-32 text-center">
                    <div className="max-w-md mx-auto space-y-8">
                      <div className="w-32 h-32 bg-slate-50 rounded-[4rem] flex items-center justify-center mx-auto border-4 border-dashed border-slate-100">
                        <ICONS.Transactions className="w-16 h-16 text-slate-200" />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-black text-slate-900">No records discovered.</h3>
                        <p className="text-slate-400 font-medium px-10">Adjust your global query or status nodes to discover other ledger activities.</p>
                      </div>
                      <button onClick={() => { setFilter('All'); setSearch(''); }} className="text-indigo-600 font-black text-[12px] uppercase tracking-[0.4em] mt-6 hover:underline underline-offset-[12px] decoration-4">Reset Parameters</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
