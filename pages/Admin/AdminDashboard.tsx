
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ICONS } from '../../constants';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    BarChart, Bar
} from 'recharts';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getAdminStats();
                setStats(data);
            } catch (err) {
                console.error('Failed to fetch admin stats:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (isLoading) return <div className="p-10 animate-pulse text-slate-400 font-black uppercase tracking-widest text-center">Initializing Platform Core...</div>;

    const cards = [
        { title: 'Total Registered Users', value: stats?.totalUsers || 0, icon: <ICONS.Customers className="w-6 h-6 text-indigo-600" />, color: 'bg-indigo-50' },
        { title: 'Portfolio Customers', value: stats?.totalCustomers || 0, icon: <ICONS.Layout className="w-6 h-6 text-emerald-600" />, color: 'bg-emerald-50' },
        { title: 'Global Transactions', value: stats?.totalTransactions || 0, icon: <ICONS.Transactions className="w-6 h-6 text-amber-600" />, color: 'bg-amber-50' },
        { title: 'Gross Platform Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: <ICONS.Bolt className="w-6 h-6 text-rose-600" />, color: 'bg-rose-50' },
    ];

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter text-slate-950">Platform Intelligence</h1>
                    <p className="text-slate-500 font-medium">Real-time global oversight of the BizFlow ecosystem.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                        <ICONS.Bell className="w-4 h-4" /> Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${card.color} group-hover:scale-110 transition-transform`}>
                                {card.icon}
                            </div>
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{card.title}</p>
                        <h3 className="text-3xl font-black text-slate-950 tracking-tighter">{card.value}</h3>
                    </div>
                ))}
            </div>

            {/* Platform Activity Chart */}
            <div className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden h-[400px]">
                <div className="relative z-10 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Live Throughput</p>
                            <h3 className="text-2xl font-bold tracking-tight">System-Wide Metric Sync</h3>
                        </div>
                    </div>

                    <div className="flex-1 -mx-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.throughput || [{ n: 'Mon', v: 10 }, { n: 'Tue', v: 25 }, { n: 'Wed', v: 15 }, { n: 'Thu', v: 40 }, { n: 'Fri', v: 30 }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="adminGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="n" hide />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#adminGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Users Table */}
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="text-2xl font-black tracking-tight text-slate-950">New Entity Provisions</h3>
                    <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">View User Directory</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Identity</th>
                                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Access Tier</th>
                                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Provision Date</th>
                                <th className="pb-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.recentUsers?.map((user: any) => (
                                <tr key={user.id} className="group hover:bg-slate-50 transition-colors">
                                    <td className="py-6 pr-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500">{user.name[0]}</div>
                                            <div>
                                                <p className="font-black text-slate-900 text-sm leading-none mb-1">{user.name}</p>
                                                <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-6 px-4 text-xs font-bold text-slate-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="py-6 pl-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Active</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
