
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthState, User } from './types';
import { api } from './services/mockApi';
import { ICONS } from './constants';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import SignUp from './pages/SignUp';

const Sidebar: React.FC<{ user: User | null; onLogout: () => void; isOpen: boolean; onClose: () => void }> = ({ user, onLogout, isOpen, onClose }) => {
  const location = useLocation();

  const sections = [
    {
      title: 'Main Menu',
      items: [
        { label: 'Dashboard', path: '/app', icon: ICONS.Dashboard },
        { label: 'Market Reports', path: '/app/reports', icon: ICONS.Layout },
      ]
    },
    {
      title: 'Operations',
      items: [
        { label: 'Customers', path: '/app/customers', icon: ICONS.Customers },
        { label: 'Transactions', path: '/app/transactions', icon: ICONS.Transactions, badge: 3 },
      ]
    },
    {
      title: 'Configuration',
      items: [
        { label: 'System Settings', path: '/app/settings', icon: ICONS.Settings },
      ]
    }
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      
      <div className={`w-72 bg-slate-950 text-white h-screen fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 shadow-2xl border-r border-white/5 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-8 flex items-center justify-between">
          <Link to="/" className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-[1.5rem] cursor-pointer hover:bg-white/10 transition-all group flex-1">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">B</div>
              <div className="overflow-hidden text-left">
                <p className="text-[10px] font-black tracking-widest text-indigo-400 uppercase leading-none mb-1">BizFlow</p>
                <p className="text-sm font-bold text-white truncate">HQ Workspace</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-y-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
          <button onClick={onClose} className="lg:hidden ml-4 p-2 text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 px-5 py-2 space-y-8 overflow-y-auto custom-scrollbar">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="px-5 text-[9px] font-black uppercase tracking-[0.25em] text-slate-600 mb-5">{section.title}</p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                      className={`group relative flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-4 transition-transform duration-300 group-hover:translate-x-1">
                        <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                        <span className={`font-bold text-sm tracking-tight ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                      </div>
                      
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isActive ? 'bg-indigo-50 text-white' : 'bg-indigo-500/20 text-indigo-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-slate-900/40">
          <div className="bg-slate-950 border border-white/5 rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={user?.avatar} alt="Avatar" className="w-11 h-11 rounded-2xl border-2 border-white/10 bg-slate-800 object-cover" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
                </div>
                <div className="overflow-hidden text-left">
                  <p className="text-sm font-black text-white truncate leading-none mb-1">{user?.name}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{user?.role}</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center justify-center gap-3 w-full px-5 py-3 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-white/5 hover:border-rose-400/20"
            >
              <ICONS.Logout className="w-4 h-4" />
              End Session
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Navbar: React.FC<{ user: User | null; onOpenSidebar: () => void }> = ({ user, onOpenSidebar }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 2000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-20 bg-white/70 backdrop-blur-2xl border-b border-slate-100 fixed top-0 left-0 lg:left-72 right-0 z-40 flex items-center justify-between px-6 lg:px-10 transition-all duration-300">
      <div className="flex items-center gap-4 lg:gap-8 flex-1">
        <button 
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className={`flex items-center bg-slate-100/60 border border-slate-200/50 rounded-2xl px-5 py-2.5 transition-all duration-300 ${
          isSearchFocused ? 'w-full lg:w-[550px] bg-white ring-4 ring-indigo-500/5 border-indigo-500/30' : 'w-full max-w-[450px]'
        }`}>
          <ICONS.Search className={`w-4 h-4 mr-3 transition-colors ${isSearchFocused ? 'text-indigo-500' : 'text-slate-400'}`} />
          <input 
            type="text" 
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search records (⌘K)..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-800 placeholder-slate-400 font-bold"
          />
          <div className="hidden sm:flex items-center gap-1 ml-2">
             <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-black text-slate-400">⌘</kbd>
             <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-black text-slate-400">K</kbd>
          </div>
        </div>
        
        <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-indigo-50/50 rounded-full border border-indigo-100/50">
           <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></div>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
             {isSyncing ? 'Syncing...' : 'Stable'}
           </span>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="hidden sm:flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
          <button className="px-3 py-1.5 bg-white shadow-sm border border-slate-200 rounded-xl text-[10px] font-black text-indigo-600 uppercase tracking-tight">EN</button>
          <button className="px-3 py-1.5 hover:bg-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-tight transition-colors">FR</button>
        </div>

        <div className="hidden sm:block h-10 w-px bg-slate-100 mx-1 lg:mx-2"></div>

        <button className="relative p-2 lg:p-3 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-2xl transition-all group">
          <ICONS.Bell className="w-5 h-5 lg:w-6 lg:h-6 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2 right-2 lg:top-3 lg:right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-500/20"></span>
        </button>

        <button className="flex items-center justify-center p-2 lg:p-3 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 hover:-translate-y-0.5 transition-all shadow-lg shadow-slate-200 group">
           <ICONS.Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        </button>
      </div>
    </header>
  );
};

const Layout: React.FC<{ user: User | null; onLogout: () => void; children: React.ReactNode }> = ({ user, onLogout, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar user={user} onLogout={onLogout} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Navbar user={user} onOpenSidebar={() => setIsSidebarOpen(true)} />
      <main className="lg:ml-72 pt-20 min-h-screen transition-all">
        <div className="p-4 sm:p-6 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('bizflow_user');
    if (savedUser) {
      setAuth({
        user: JSON.parse(savedUser),
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const handleLogin = async (email: string, pass: string) => {
    try {
      const user = await api.login(email, pass);
      localStorage.setItem('bizflow_user', JSON.stringify(user));
      setAuth({ user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      console.error(err);
      alert('Login failed. Ensure credentials match the environment settings.');
    }
  };

  const handleSignUp = async (name: string, email: string, pass: string, company: string) => {
    try {
      const user = await api.signup(name, email, pass, company);
      localStorage.setItem('bizflow_user', JSON.stringify(user));
      setAuth({ user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      console.error(err);
      alert('Sign up failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bizflow_user');
    setAuth({ user: null, isAuthenticated: false, isLoading: false });
  };

  if (auth.isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-indigo-500"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-8 h-8 bg-indigo-600 rounded-xl animate-pulse"></div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-white text-xl font-black tracking-widest uppercase">Initializing BizFlow</p>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em]">Establishing Secure Connection</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing isAuthenticated={auth.isAuthenticated} />} />
        <Route 
          path="/login" 
          element={!auth.isAuthenticated ? <Auth onLogin={handleLogin} /> : <Navigate to="/app" />} 
        />
        <Route 
          path="/signup" 
          element={!auth.isAuthenticated ? <SignUp onSignUp={handleSignUp} /> : <Navigate to="/app" />} 
        />
        <Route
          path="/app/*"
          element={
            auth.isAuthenticated ? (
              <Layout user={auth.user} onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/app" />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
