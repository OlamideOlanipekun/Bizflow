
import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { User } from '../../types';
import { ICONS } from '../../constants';

const UserManager: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await api.getAllUsers();
                setUsers(data);
            } catch (err) {
                console.error('Failed to fetch users:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (isLoading) return <div className="p-10 animate-pulse text-slate-400 font-black uppercase tracking-widest text-center">Syncing User Directory...</div>;

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <h1 className="text-5xl font-black tracking-tighter text-slate-950">Identity Management</h1>
                    <p className="text-slate-500 font-medium">Provision and manage platform-wide identity access.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <ICONS.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Filter identities..." className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold placeholder-slate-300 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all w-64" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="py-6 px-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Entity</th>
                                <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Access Rights</th>
                                <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System ID</th>
                                <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Active Status</th>
                                <th className="py-6 px-10 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-indigo-50/30 transition-all duration-300">
                                    <td className="py-8 px-10">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 text-lg leading-none mb-1.5">{user.name}</p>
                                                <p className="text-sm text-slate-400 font-bold">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-8 px-4">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.role === 'admin'
                                                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                                                : 'bg-slate-50 border-slate-200 text-slate-600'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-8 px-4 font-mono text-xs font-bold text-slate-400 tracking-tighter">
                                        #{user.id.padStart(6, '0')}
                                    </td>
                                    <td className="py-8 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Synchronized</span>
                                        </div>
                                    </td>
                                    <td className="py-8 px-10 text-right">
                                        <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-100 transition-all shadow-sm">
                                            <ICONS.Settings className="w-4 h-4" />
                                        </button>
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

export default UserManager;
