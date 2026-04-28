import { ShieldCheck, Database, LayoutGrid, Terminal, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export const DashboardLayout = ({ headerActions, main, mode, setMode }) => {
  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-12 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-neon-cyan/10 rounded-2xl border border-neon-cyan/20 neon-glow-cyan">
                <ShieldCheck className="text-neon-cyan" size={32} />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-[0.2em] italic bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-text-heading)] via-[var(--color-text-heading)] to-neon-cyan/50">
                  TRACTOR SAFETY SYSTEM
                </h1>
                <div className="flex items-center gap-4 text-[10px] font-black tracking-[0.3em] text-[var(--color-text-dim)] mt-1">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-emerald animate-pulse" />
                    CORE_OS SYSTEM_LIVE
                  </span>
                  <span className="text-[var(--color-text-border)]">|</span>
                  <span className="flex items-center gap-2 uppercase">
                    <Database size={10} />
                    DB_V4.8.5_STABLE
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-6"
          >
            <div className="flex items-center gap-2 p-1.5 bg-carbon-900/60 backdrop-blur-xl rounded-2xl border border-glass-border">
              {['demo', 'serial'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`
                    px-6 py-2.5 rounded-xl text-[10px] font-black transition-all duration-300 uppercase tracking-[0.3em]
                    ${mode === m 
                      ? 'bg-neon-cyan text-deep-space shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-105' 
                      : 'text-[var(--color-text-dim)] hover:text-[var(--color-text-main)] hover:bg-white/5'
                    }
                  `}
                >
                  {m}
                </button>
              ))}
            </div>

            {headerActions}
          </motion.div>
        </header>

        <motion.main 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {main}
        </motion.main>
        
        <footer className="mt-20 flex flex-col md:flex-row items-center justify-between border-t border-glass-border pt-10 text-[10px] font-black tracking-[0.5em] text-[var(--color-text-dim)] uppercase pb-10">
          <div className="flex items-center gap-8 mb-4 md:mb-0">
            <span>© 2026 ANTIGRAVITY</span>
            <span className="hidden md:inline text-[var(--color-text-border)]">|</span>
            <span>SECURE_DATA_STREAM_ENCRYPTED</span>
          </div>
          <div className="flex items-center gap-4">
            <Cpu size={12} />
            <Terminal size={12} />
            <LayoutGrid size={12} />
          </div>
        </footer>
      </div>
    </div>
  );
};

