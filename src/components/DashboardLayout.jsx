import React from 'react';
import { Activity, ShieldCheck, Database } from 'lucide-react';

export const DashboardLayout = ({ children, mode, setMode }) => {
  return (
    <div className="min-h-screen selection:bg-brand-primary selection:text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="animate-float">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
                <ShieldCheck className="text-brand-primary" size={24} />
              </div>
              <h1 className="text-4xl font-black tracking-tighter glow-text italic">
                TRACTOR<span className="text-brand-primary">_OS</span>
              </h1>
            </div>
            <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
              <span className="flex items-center gap-1.5">
                <Activity size={14} className="text-brand-success" />
                SYSTEM LIVE
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span className="flex items-center gap-1.5">
                <Database size={14} />
                V4.2.0-STABLE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-1.5 bg-dark-surface/50 backdrop-blur-md rounded-2xl border border-white/5">
            {['demo', 'api', 'serial'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`
                  px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 uppercase tracking-widest
                  ${mode === m 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-105' 
                    : 'text-slate-500 hover:text-slate-300'
                  }
                `}
              >
                {m}
              </button>
            ))}
          </div>

          {children.headerActions}
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {children.main}
        </main>
        
        <footer className="mt-16 text-center text-slate-600 text-xs font-medium tracking-widest uppercase">
          © 2026 ANTIGRAVITY DEFENSE SYSTEMS • ALL SYSTEMS OPERATIONAL
        </footer>
      </div>
    </div>
  );
};
