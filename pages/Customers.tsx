
import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { Customer } from '../types';
import { ICONS } from '../constants';

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', company: '', status: 'Lead' as const });
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'company' | 'createdAt'>('name');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setIsLoading(true);
    const data = await api.getCustomers();
    setCustomers(data);
    setIsLoading(false);
  };

  const filteredAndSortedCustomers = useMemo(() => {
    return customers
      .filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'createdAt') return b.createdAt.localeCompare(a.createdAt);
        return a[sortBy].localeCompare(b[sortBy]);
      });
  }, [customers, search, sortBy]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email) return;
    setIsLoading(true);
    await api.addCustomer(newCustomer);
    setNewCustomer({ name: '', email: '', company: '', status: 'Lead' });
    setIsModalOpen(false);
    await loadCustomers();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Verify Action: Permanent deletion of account record? This is irreversible.')) {
      setIsLoading(true);
      await api.deleteCustomer(id);
      await loadCustomers();
      if (selectedCustomer?.id === id) setSelectedCustomer(null);
    }
  };

  return (
    <div className="flex flex-col gap-12 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.4)]"></span>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Customer Database</span>
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">Customers</h1>
          <p className="text-slate-500 font-medium text-xl mt-4">Centralized CRM for high-tier account management and strategic lifecycle tracking.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-4 transition-all shadow-3xl shadow-indigo-100 group"
        >
          <ICONS.Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="bg-white rounded-[4rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-14 border-b border-slate-100 flex flex-col lg:flex-row gap-10 justify-between items-center bg-slate-50/20">
          <div className="relative w-full lg:w-[600px]">
            <ICONS.Search className="w-5 h-5 absolute left-7 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Search by name, company, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-10 py-5 bg-white border border-slate-200 rounded-[2rem] outline-none focus:ring-[15px] focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-black text-slate-800 placeholder-slate-300 shadow-sm"
            />
          </div>
          <div className="flex gap-5 flex-shrink-0">
            <div className="flex bg-white rounded-2xl p-1.5 border border-slate-200">
              {(['name', 'company', 'createdAt'] as const).map(key => (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === key ? 'bg-slate-950 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  {key.replace('createdAt', 'Date')}
                </button>
              ))}
            </div>
            <button className="px-8 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[10px] text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-3">
              <ICONS.Layout className="w-4 h-4" />
              View Config
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-[0.25em] border-b border-slate-100">
              <tr>
                <th className="px-14 py-8">Identity Trace</th>
                <th className="px-14 py-8">Organization</th>
                <th className="px-14 py-8 text-center">Lifecycle Stage</th>
                <th className="px-14 py-8">Registration</th>
                <th className="px-14 py-8 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && !customers.length ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-14 py-12"><div className="h-8 bg-slate-100 rounded-2xl w-full"></div></td>
                  </tr>
                ))
              ) : filteredAndSortedCustomers.length > 0 ? (
                filteredAndSortedCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => setSelectedCustomer(customer)}
                    className="group hover:bg-slate-50/50 transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-indigo-500"
                  >
                    <td className="px-14 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-[1.75rem] flex items-center justify-center font-black text-xl transition-all group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-indigo-100">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-none mb-1.5">{customer.name}</p>
                          <p className="text-xs text-slate-400 font-bold tracking-tight">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-14 py-8 text-base font-black text-slate-600">{customer.company}</td>
                    <td className="px-14 py-8 text-center">
                      <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${customer.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        customer.status === 'Inactive' ? 'bg-slate-100 text-slate-500 border border-slate-200' :
                          'bg-indigo-50 text-indigo-600 border border-indigo-100'
                        }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-14 py-8 text-sm font-black text-slate-400">{customer.createdAt}</td>
                    <td className="px-14 py-8 text-right">
                      <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-2xl shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                          <ICONS.Settings className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(customer.id); }}
                          className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-rose-600 rounded-2xl shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-14 py-32 text-center">
                    <div className="max-w-md mx-auto space-y-6">
                      <div className="w-28 h-28 bg-slate-50 rounded-[3rem] flex items-center justify-center mx-auto border-2 border-dashed border-slate-200">
                        <ICONS.Search className="w-12 h-12 text-slate-200" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900">No matching entities found.</h3>
                        <p className="text-slate-400 font-medium px-8">Verify the identity parameters or adjust your global search query.</p>
                      </div>
                      <button onClick={() => setSearch('')} className="text-indigo-600 font-black text-[11px] uppercase tracking-[0.3em] hover:underline underline-offset-8 decoration-2">Clear Parameters</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 z-[110] flex justify-end bg-slate-950/80 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-2xl bg-white h-full shadow-[-40px_0_100px_rgba(0,0,0,0.3)] animate-slide-right flex flex-col border-l border-white/10">
            <div className="p-14 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl shadow-indigo-200">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-3">{selectedCustomer.name}</h2>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedCustomer.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                      {selectedCustomer.status}
                    </span>
                    <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{selectedCustomer.company}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-6 bg-white hover:bg-slate-100 rounded-[2rem] transition-all shadow-sm border border-slate-100 text-slate-400 hover:text-slate-900"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-16 space-y-16 custom-scrollbar">
              <div className="grid grid-cols-2 gap-10">
                <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-sm">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Account LTV</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">$24,800.00</p>
                </div>
                <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-sm">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Ecosystem Pings</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none">128 Total</p>
                </div>
              </div>

              <div className="space-y-10">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 flex items-center gap-4">
                    <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
                    Operational History
                  </h4>
                  <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Full Log</button>
                </div>
                <div className="space-y-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex gap-6 p-8 hover:bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-slate-100 transition-all cursor-pointer group shadow-sm hover:shadow-xl hover:-translate-y-1">
                      <div className="w-14 h-14 bg-white border border-slate-200 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-all shadow-sm">
                        <ICONS.Bolt className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-800 leading-none mb-2">Internal Verification Event #{882 + i}</p>
                        <p className="text-sm text-slate-400 font-medium">System trace authorized via Tier {i} Node &bull; Mar {10 + i}, 2024</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-14 border-t border-slate-100 bg-slate-50/50 flex gap-6">
              <button className="flex-1 py-6 bg-white border border-slate-200 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-100 transition-all shadow-sm">Audit Download</button>
              <button className="flex-1 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-3xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Direct Engagement</button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-3xl p-10">
          <div className="bg-white rounded-[5rem] w-full max-w-2xl shadow-[0_0_120px_rgba(0,0,0,0.4)] overflow-hidden animate-scale-in border border-white/20">
            <div className="p-16 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2">Account Provisioning</h2>
                <p className="text-slate-500 font-medium text-lg">Onboard a new identity node to the corporate ecosystem.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-7 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-[2.5rem] transition-all shadow-sm border border-slate-100"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-20 space-y-12 text-left">
              <div className="grid grid-cols-2 gap-10">
                <div className="col-span-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Principal Identity</label>
                  <input required type="text" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-[15px] focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-black text-slate-800 placeholder-slate-300 text-xl" placeholder="Full Legal Name" />
                </div>
                <div className="col-span-2">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Digital Access Address</label>
                  <input required type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-[15px] focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-black text-slate-800 placeholder-slate-300 text-xl" placeholder="corporate@domain.com" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Parent Entity</label>
                  <input required type="text" value={newCustomer.company} onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })} className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-[15px] focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-black text-slate-800 placeholder-slate-300 text-xl" placeholder="Entity Group Ltd." />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Operational Status</label>
                  <div className="relative">
                    <select value={newCustomer.status} onChange={(e) => setNewCustomer({ ...newCustomer, status: e.target.value as any })} className="w-full px-10 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-[15px] focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-black text-slate-800 cursor-pointer appearance-none text-xl">
                      <option value="Lead">Lead Development</option>
                      <option value="Active">Operational Node</option>
                      <option value="Inactive">Dormant Account</option>
                    </select>
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-12 flex gap-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-7 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black text-xs uppercase tracking-[0.4em] rounded-[2.5rem] transition-all">Abort</button>
                <button type="submit" className="flex-1 py-7 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-[0.4em] rounded-[2.5rem] transition-all shadow-3xl shadow-indigo-100">Initialize Identity</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
