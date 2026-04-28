import { motion } from 'framer-motion';
import { User, Shield, Activity, Key } from 'lucide-react';
import { useAuth } from '../components/AuthContext';

export function Profile() {
  const { user } = useAuth();
  const displayName = user?.username?.toUpperCase() || 'UNKNOWN';
  const operatorId = `OP-${String(user?.id || 0).padStart(4, '0')}-X`;

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl font-black tracking-[0.2em] italic bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-text-heading)] via-[var(--color-text-heading)] to-neon-cyan/50">
              OPERATOR_PROFILE
            </h1>
            <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 mt-2">ID: {operatorId} | CLEARANCE: ALPHA</p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="hud-card p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-carbon-800 border-2 border-neon-cyan/30 flex items-center justify-center neon-glow-cyan overflow-hidden relative">
                <User size={40} className="text-neon-cyan" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.2)_1px,transparent_1px)] bg-[size:100%_4px] opacity-30" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-widest text-[var(--color-text-heading)]">{displayName}</h2>
                <div className="flex items-center gap-2 mt-2 text-[10px] font-black tracking-[0.2em] text-neon-emerald">
                  <Shield size={12} /> STATUS: ACTIVE_DUTY
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <span className="data-label">ASSIGNED_UNIT</span>
                <p className="text-lg font-mono font-bold text-[var(--color-text-main)]">TRACTOR_X1_HEAVY</p>
              </div>
              <div>
                <span className="data-label">TOTAL_HOURS_LOGGED</span>
                <p className="text-lg font-mono font-bold text-[var(--color-text-main)]">1,452.8 HRS</p>
              </div>
              <div>
                <span className="data-label">LAST_CERTIFICATION</span>
                <p className="text-lg font-mono font-bold text-[var(--color-text-main)]">2026.03.15</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col gap-8">
            <div className="hud-card p-6 flex items-center gap-4">
              <div className="p-3 bg-neon-amber/10 rounded-xl border border-neon-amber/30">
                <Key className="text-neon-amber" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-widest text-[var(--color-text-heading)] uppercase">Security Clearance</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Level 4 Autonomous Override</p>
              </div>
            </div>

            <div className="hud-card p-6 flex items-center gap-4">
              <div className="p-3 bg-neon-emerald/10 rounded-xl border border-neon-emerald/30">
                <Activity className="text-neon-emerald" size={24} />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-widest text-[var(--color-text-heading)] uppercase">Biometric Status</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Heart Rate: 72bpm | Stress: Low</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
