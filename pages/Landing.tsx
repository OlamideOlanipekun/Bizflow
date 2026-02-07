
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ICONS } from '../constants';

const Landing: React.FC<{ isAuthenticated: boolean }> = ({ isAuthenticated }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Workflow', href: '#workflow' },
    { label: 'Benefits', href: '#benefits' },
  ];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const backToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900 scroll-smooth">
      {/* Back to Top Floating Button */}
      {showBackToTop && (
        <button
          onClick={backToTop}
          className="fixed bottom-10 right-10 z-50 p-5 bg-indigo-600 text-white rounded-2xl shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:bg-slate-950 hover:-translate-y-2 transition-all duration-300 animate-fade-in group flex items-center justify-center border border-indigo-500/20 backdrop-blur-sm"
          aria-label="Back to top"
        >
          <svg 
            className="w-6 h-6 group-hover:animate-bounce" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* Enhanced Sticky Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'h-20 bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 shadow-sm px-6 lg:px-20' 
          : 'h-24 bg-transparent px-6 lg:px-24'
      } flex items-center justify-between`}>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex items-center gap-3 group focus:outline-none"
          aria-label="BizFlow Home"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-600/20 group-hover:scale-110 group-hover:rotate-3 transition-transform">B</div>
          <span className="text-xl font-black tracking-tighter text-slate-900 group-hover:text-indigo-600 transition-colors">BizFlow</span>
        </button>
        
        <div className="hidden md:flex items-center gap-10 bg-slate-50 border border-slate-200/50 px-8 py-2.5 rounded-full shadow-inner">
          {navLinks.map(link => (
            <a 
              key={link.label}
              href={link.href} 
              onClick={(e) => { e.preventDefault(); scrollToSection(link.href.substring(1)); }}
              className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            {isAuthenticated ? (
              <Link to="/app" className="group flex items-center gap-3 px-6 py-3 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                <span>Command Center</span>
                <ICONS.Bolt className="w-4 h-4 group-hover:animate-pulse" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-6 py-3 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition-colors">Log In</Link>
                <Link to="/signup" className="px-7 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 hover:shadow-2xl hover:shadow-indigo-200 transition-all">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-600 hover:bg-slate-50 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        <div className={`absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-8 flex flex-col gap-6 shadow-2xl transition-all duration-300 md:hidden ${
          mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}>
          {navLinks.map(link => (
            <a 
              key={link.label}
              href={link.href} 
              onClick={(e) => { e.preventDefault(); scrollToSection(link.href.substring(1)); }}
              className="text-lg font-black text-slate-900 border-b border-slate-50 pb-4"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-4 pt-4">
            {isAuthenticated ? (
               <Link to="/app" className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-center font-black uppercase tracking-widest">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="w-full py-5 bg-slate-50 text-slate-900 rounded-2xl text-center font-black uppercase tracking-widest">Login</Link>
                <Link to="/signup" className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-center font-black uppercase tracking-widest">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-100/50 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50/50 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12 relative z-10 text-left">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em] animate-fade-in shadow-sm">
              <ICONS.Sparkles className="w-4 h-4" />
              Intelligence Driven Ops
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] animate-fade-in">
              The OS for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-800">High-Velocity</span> <br />
              Business.
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-500 font-medium max-w-xl leading-relaxed animate-fade-in">
              Track capital, unify customer relations, and synthesize strategic insights in one high-fidelity command center.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 animate-fade-in">
              <Link to={isAuthenticated ? "/app" : "/signup"} className="w-full sm:w-auto px-12 py-6 bg-slate-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-600 hover:-translate-y-1 transition-all shadow-2xl shadow-slate-300">
                {isAuthenticated ? "Enter Dashboard" : "Get Started Free"}
              </Link>
              <button 
                onClick={() => scrollToSection('features')}
                className="w-full sm:w-auto px-10 py-5 bg-white text-slate-600 border border-slate-200 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-slate-50 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 shadow-sm"
              >
                <ICONS.Layout className="w-5 h-5" />
                Live Demo
              </button>
            </div>

            <div className="pt-12 flex items-center gap-8 animate-fade-in opacity-50">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Card Required</span>
               <div className="h-4 w-px bg-slate-200"></div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Ready</span>
               <div className="h-4 w-px bg-slate-200"></div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">14-Day Full Access</span>
            </div>
          </div>

          <div className="relative group perspective-1000 hidden lg:block">
            <div className="absolute inset-0 bg-indigo-600/10 rounded-[4rem] blur-[100px] group-hover:bg-indigo-600/20 transition-all duration-700"></div>
            
            <div className="relative bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 p-8 transform rotate-x-6 rotate-y--12 group-hover:rotate-0 transition-transform duration-1000 ease-out overflow-hidden">
               <div className="space-y-8">
                 <div className="flex justify-between items-center pb-6 border-b border-slate-50">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 bg-rose-400 rounded-full"></div>
                     <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                     <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                   </div>
                   <div className="w-32 h-3 bg-slate-100 rounded-full"></div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6">
                    <div className="h-32 bg-indigo-50 rounded-3xl p-6 flex flex-col justify-between">
                       <div className="w-8 h-8 bg-white rounded-lg shadow-sm"></div>
                       <div className="space-y-2">
                          <div className="w-12 h-2 bg-indigo-200 rounded-full"></div>
                          <div className="w-20 h-4 bg-indigo-600 rounded-full"></div>
                       </div>
                    </div>
                    <div className="h-32 bg-emerald-50 rounded-3xl p-6 flex flex-col justify-between">
                       <div className="w-8 h-8 bg-white rounded-lg shadow-sm"></div>
                       <div className="space-y-2">
                          <div className="w-12 h-2 bg-emerald-200 rounded-full"></div>
                          <div className="w-20 h-4 bg-emerald-600 rounded-full"></div>
                       </div>
                    </div>
                 </div>

                 <div className="h-48 bg-slate-50 rounded-3xl p-8 space-y-4">
                    <div className="flex justify-between items-center">
                       <div className="w-32 h-4 bg-slate-200 rounded-full"></div>
                       <div className="w-16 h-2 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="w-full h-full pt-4 flex items-end gap-3">
                       {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                         <div key={i} className="flex-1 bg-indigo-100 rounded-t-lg transition-all duration-1000" style={{ height: `${h}%` }}></div>
                       ))}
                    </div>
                 </div>
               </div>

               <div className="absolute bottom-8 right-8 w-64 bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl animate-float border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <ICONS.Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">AI Strategy Insight</span>
                  </div>
                  <p className="text-xs font-medium text-slate-300 leading-relaxed italic">
                    "Growth markers detected in SaaS vertical. Adjusting pivot for Q2 expansion."
                  </p>
               </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-32 lg:pt-48">
           <div className="flex flex-col items-center gap-12">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Commanding Operations For</p>
              <div className="flex flex-wrap justify-center gap-12 lg:gap-24 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                 {['SYSTEMA', 'QUANTUM', 'VERTEX', 'NEXUS', 'APEX'].map(brand => (
                   <span key={brand} className="text-2xl font-black text-slate-900 tracking-tighter">{brand}</span>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-32 px-6 lg:px-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Business complexity <br /> 
              <span className="text-slate-400">shouldn't slow you down.</span>
            </h2>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">
              Most business owners lose hours every week toggling between spreadsheets and scattered software. BizFlow consolidates your operation into a single, high-fidelity pulse.
            </p>
            <div className="space-y-6">
              {[
                "No more hunting for customer history",
                "Automated revenue projection",
                "Instant status visibility for every transaction",
                "Clear, actionable growth metrics"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </div>
                  <span className="text-slate-700 font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-8 mt-12">
               <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm mb-6 flex items-center justify-center text-rose-500">
                    <ICONS.Transactions className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">Manual Audit Stress</h4>
                  <p className="text-sm text-slate-500 font-medium">Stop wasting hours on bookkeeping spreadsheets.</p>
               </div>
               <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm mb-6 flex items-center justify-center text-indigo-500">
                    <ICONS.Search className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">Data Blindness</h4>
                  <p className="text-sm text-slate-500 font-medium">Get the insights you need without the data noise.</p>
               </div>
            </div>
            <div className="space-y-8">
               <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm mb-6 flex items-center justify-center text-emerald-500">
                    <ICONS.Customers className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">Lost Leads</h4>
                  <p className="text-sm text-slate-500 font-medium">Never let a customer fall through the cracks again.</p>
               </div>
               <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm mb-6 flex items-center justify-center text-amber-500">
                    <ICONS.Bolt className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2">Sync Delays</h4>
                  <p className="text-sm text-slate-500 font-medium">Real-time status updates for everyone on your team.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Unified Operations Section */}
      <section id="features" className="py-40 lg:py-60 px-6 lg:px-20 bg-[#020617] text-white relative overflow-hidden scroll-mt-24">
        {/* Background Mesh Gradients */}
        <div className="absolute top-0 right-0 w-[60%] h-[80%] bg-indigo-600/5 rounded-full blur-[180px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-[-10%] w-[50%] h-[70%] bg-emerald-600/5 rounded-full blur-[150px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-40 space-y-8">
            <div className="inline-flex flex-col items-center">
               <span className="text-[10px] font-black uppercase tracking-[0.8em] text-indigo-500 mb-6 bg-indigo-500/10 px-6 py-2 rounded-full border border-indigo-500/20">The Foundation</span>
               <h2 className="text-6xl lg:text-9xl font-black tracking-tighter leading-none italic">Unified Ops.</h2>
            </div>
            <p className="text-xl lg:text-3xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed opacity-80">
              One ecosystem. Zero latency. <br className="hidden md:block" />
              <span className="text-slate-500">A singular environment to govern your entire corporate architecture.</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              { 
                title: "CRM Excellence", 
                tag: "CORE NODE",
                desc: "Full-lifecycle customer management with deep engagement history and real-time audit logs.", 
                icon: ICONS.Customers, 
                color: "indigo",
                preview: (
                  <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30"></div>
                      <div className="h-2 w-20 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full w-[70%] bg-indigo-500"></div>
                    </div>
                  </div>
                )
              },
              { 
                title: "Smart Ledgers", 
                tag: "LIQUIDITY v2.5",
                desc: "Automated transaction tracking with sector segmentation and instant multi-node verification.", 
                icon: ICONS.Transactions, 
                color: "emerald",
                preview: (
                  <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 flex items-end gap-1.5 h-16">
                    {[40, 70, 45, 90, 60, 85].map((h, i) => (
                      <div key={i} className="flex-1 bg-emerald-500/30 rounded-t-md" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                )
              },
              { 
                title: "AI Strategist", 
                tag: "SYNAPTIC-3",
                desc: "Leverage Gemini 3 Flash to synthesize business insights and execute dynamic market pivots.", 
                icon: ICONS.Sparkles, 
                color: "amber",
                preview: (
                  <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-2">
                    <div className="h-1.5 w-[60%] bg-amber-500/40 rounded-full"></div>
                    <div className="h-1.5 w-[90%] bg-white/10 rounded-full"></div>
                    <div className="h-1.5 w-[40%] bg-white/10 rounded-full"></div>
                  </div>
                )
              }
            ].map((f, i) => (
              <div 
                key={i} 
                className={`p-10 lg:p-14 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[4.5rem] hover:bg-white/[0.06] transition-all duration-700 group relative overflow-hidden hover:-translate-y-4 hover:shadow-[0_40px_100px_rgba(0,0,0,0.5)]`}
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-12">
                    <div className={`w-20 h-20 bg-slate-900 border border-white/10 rounded-[2rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[0_0_40px_rgba(79,70,229,0.2)]`}>
                      <f.icon className={`w-10 h-10 text-white transition-colors duration-500 group-hover:text-${f.color}-400`} />
                    </div>
                    <span className="text-[9px] font-black tracking-[0.3em] text-slate-500 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">{f.tag}</span>
                  </div>
                  
                  <h3 className="text-3xl lg:text-4xl font-black tracking-tight mb-6 group-hover:text-white transition-colors">{f.title}</h3>
                  <p className="text-slate-400 text-lg leading-relaxed font-medium opacity-70 group-hover:opacity-100 transition-opacity">{f.desc}</p>
                  
                  {f.preview}
                  
                  <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-between">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sync Active</span>
                     <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  </div>
                </div>

                {/* Inner Glow Decorative */}
                <div className={`absolute -right-20 -bottom-20 w-64 h-64 bg-${f.color}-500/5 rounded-full blur-[100px] group-hover:bg-${f.color}-500/10 transition-all duration-700`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Workflow */}
      <section id="workflow" className="py-40 px-6 lg:px-20 bg-white scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-5 space-y-10">
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">3 Steps to <br /> <span className="text-indigo-600">Total Clarity.</span></h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed">BizFlow is designed for speed. We stripped away the bloat to give you pure utility.</p>
              
              <div className="space-y-12">
                {[
                  { step: "01", title: "Provision Workspace", desc: "Sign up in 60 seconds and establish your dedicated secure business link." },
                  { step: "02", title: "Ingest Data", desc: "Add customers and transactions. Our system automatically segments them into industry sectors." },
                  { step: "03", title: "Synthesize Growth", desc: "Watch your dashboard come alive with real-time KPIs and AI-generated strategies." }
                ].map((s, i) => (
                  <div key={i} className="flex gap-8 group">
                    <span className="text-4xl font-black text-indigo-100 group-hover:text-indigo-600 transition-colors leading-none">{s.step}</span>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">{s.title}</h4>
                      <p className="text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7">
               <div className="bg-slate-100 rounded-[4rem] p-10 h-full flex items-center justify-center relative overflow-hidden">
                  <div className="bg-white rounded-[3rem] shadow-2xl w-full h-[500px] border border-slate-200 p-10 flex flex-col gap-8 transform hover:scale-105 transition-transform duration-700">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-rose-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                      </div>
                      <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">v2.5 Dashboard</div>
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="h-24 bg-slate-50 rounded-3xl"></div>
                        <div className="h-24 bg-slate-50 rounded-3xl"></div>
                      </div>
                      <div className="h-40 bg-slate-50 rounded-[2rem]"></div>
                      <div className="space-y-4">
                        <div className="h-3 bg-slate-100 rounded-full w-full"></div>
                        <div className="h-3 bg-slate-100 rounded-full w-[80%]"></div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-40 px-6 lg:px-20 bg-slate-50 scroll-mt-24">
        <div className="max-w-7xl mx-auto text-center mb-32 space-y-6">
          <h2 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">Velocity as a Service.</h2>
          <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto">Scale without the administrative overhead.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {[
            { title: "Save 12+ Hours Weekly", desc: "Automated reporting and centralized data entry eliminate manual consolidation work.", icon: ICONS.Bolt, id: 'time' },
            { title: "Data-Driven Decisions", desc: "Real-time KPI visualization means you stop guessing and start knowing.", icon: ICONS.TrendingUp, id: 'data' },
            { title: "Enterprise-Grade Security", desc: "Bank-level encryption and role-based access control keep your liquidity safe.", icon: ICONS.Settings, id: 'security' },
            { title: "Zero Learning Curve", desc: "Our premium interface is designed for humans, not database engineers.", icon: ICONS.Layout, id: 'ux' }
          ].map((b, i) => (
            <div key={i} id={`benefit-${b.id}`} className="flex gap-8 p-12 bg-white rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="w-16 h-16 bg-slate-950 text-white rounded-[1.75rem] flex items-center justify-center flex-shrink-0 shadow-xl">
                <b.icon className="w-8 h-8" />
              </div>
              <div className="space-y-4">
                <h4 className="text-2xl font-black text-slate-900 tracking-tight">{b.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Final CTA Section */}
      <section className="py-40 lg:py-60 px-6 lg:px-20 bg-[#020617] relative overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.08),transparent_50%)]"></div>
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-indigo-600/10 rounded-full blur-[180px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[60%] bg-emerald-600/5 rounded-full blur-[150px]"></div>
          
          {/* Animated Grid Lines */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[5rem] p-12 lg:p-24 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden text-center group">
            
            {/* Visual Flair Inside Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/[0.02] rounded-full blur-[100px] -z-10 group-hover:bg-indigo-600/[0.05] transition-all duration-1000"></div>
            
            <div className="space-y-12 relative">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
                Sovereign Infrastructure Active
              </div>

              <h2 className="text-6xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9] italic">
                Ready to <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Take Command?</span>
              </h2>
              
              <p className="text-xl lg:text-3xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                Join 2,500+ enterprises scaling high-velocity operations on the BizFlow ecosystem.
              </p>
              
              <div className="flex flex-col items-center gap-10 pt-10">
                <Link 
                  to={isAuthenticated ? "/app" : "/signup"} 
                  className="w-full sm:w-auto px-16 py-8 bg-indigo-600 text-white rounded-[2.5rem] font-black text-lg uppercase tracking-[0.2em] hover:bg-white hover:text-indigo-600 hover:-translate-y-2 transition-all shadow-[0_20px_60px_rgba(79,70,229,0.3)] hover:shadow-[0_40px_100px_rgba(79,70,229,0.4)] glow-indigo"
                >
                  {isAuthenticated ? "Enter Command Center" : "Provision Workspace Now"}
                </Link>
                
                <div className="flex flex-wrap justify-center gap-8 lg:gap-12 opacity-40">
                   {['Zero Setup Fee', 'Instant Provisioning', '24/7 Priority Support'].map((feat, i) => (
                     <div key={i} className="flex items-center gap-3">
                        <ICONS.Bolt className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{feat}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure Health Ticker */}
        <div className="max-w-7xl mx-auto mt-32 pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="flex items-center gap-10">
              <div className="space-y-1">
                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Global Status</p>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs font-bold text-white">99.9% Uptime</span>
                 </div>
              </div>
              <div className="h-8 w-px bg-white/5"></div>
              <div className="space-y-1">
                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Sync Nodes</p>
                 <p className="text-xs font-bold text-white">4,812 Active</p>
              </div>
           </div>
           
           <div className="flex items-center gap-10 text-right md:text-left">
              <div className="space-y-1">
                 <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Liquidity Flow</p>
                 <p className="text-xs font-bold text-white">$2.4B Processed</p>
              </div>
              <div className="h-8 w-px bg-white/5"></div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <img key={i} src={`https://picsum.photos/seed/${i + 20}/50/50`} className="w-8 h-8 rounded-full border-2 border-[#020617]" alt="User" />
                   ))}
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Joined Today</span>
              </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-24 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
          <div className="space-y-8">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="flex items-center gap-3 cursor-pointer group focus:outline-none"
              aria-label="Back to Top"
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl group-hover:scale-110 transition-transform">B</div>
              <span className="text-xl font-black tracking-tighter text-slate-900 group-hover:text-indigo-600 transition-colors">BizFlow</span>
            </button>
            <p className="text-slate-400 font-medium leading-relaxed">The high-velocity command center for modern executive leadership.</p>
          </div>
          
          <div className="space-y-8">
            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Platform</h5>
            <ul className="space-y-4 text-slate-400 font-bold text-sm">
              <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }} className="hover:text-indigo-600 transition-colors">Features</a></li>
              <li><a href="#workflow" onClick={(e) => { e.preventDefault(); scrollToSection('workflow'); }} className="hover:text-indigo-600 transition-colors">Workflow</a></li>
              <li><Link to="/app/reports" className="hover:text-indigo-600 transition-colors">Market Intel</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Corporate</h5>
            <ul className="space-y-4 text-slate-400 font-bold text-sm">
              <li><a href="#benefits" onClick={(e) => { e.preventDefault(); scrollToSection('benefits'); }} className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#benefits" onClick={(e) => { e.preventDefault(); scrollToSection('benefits'); }} className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              <li><a href="#benefits" onClick={(e) => { e.preventDefault(); scrollToSection('benefits'); }} className="hover:text-indigo-600 transition-colors">Security Audit</a></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Connect</h5>
            <ul className="space-y-4 text-slate-400 font-bold text-sm">
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">Twitter (X)</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">LinkedIn</a></li>
              <li><button onClick={() => alert('All systems operational.')} className="hover:text-indigo-600 transition-colors text-left focus:outline-none">System Status</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">&copy; 2025 BizFlow Executive Inc. All Rights Reserved.</p>
          <div className="flex gap-4">
             <button className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none" aria-label="Change Language to English">EN</button>
             <button className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none" aria-label="Change Region to US">US</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
