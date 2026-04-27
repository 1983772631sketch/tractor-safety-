import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Wrench, Phone, FileText } from 'lucide-react';

export function Support() {
  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl font-black tracking-[0.2em] italic bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-neon-cyan/50">
              SYSTEM_SUPPORT
            </h1>
            <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 mt-2">DIAGNOSTICS & EMERGENCY PROTOCOLS</p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="hud-card p-8 col-span-1 md:col-span-2 bg-neon-danger/5 border-neon-danger/20">
            <div className="flex items-center gap-4 mb-4">
              <Phone size={24} className="text-neon-danger animate-pulse" />
              <h2 className="text-xl font-black tracking-widest text-white uppercase">EMERGENCY_OVERRIDE_CONTACT</h2>
            </div>
            <p className="text-sm font-mono text-slate-300 mb-6">In the event of total system failure or critical safety hazard, contact central command immediately.</p>
            <div className="text-3xl font-black tracking-[0.2em] text-neon-danger drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">
              +1-800-TRACTOR-X
            </div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="hud-card p-8">
             <div className="flex items-center gap-4 mb-6 pb-4 border-b border-glass-border">
              <Wrench size={24} className="text-neon-cyan" />
              <h2 className="text-lg font-black tracking-widest text-white uppercase">Diagnostics Tools</h2>
            </div>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 bg-carbon-800/50 hover:bg-neon-cyan/10 border border-transparent hover:border-neon-cyan/30 rounded-xl transition-all font-mono text-xs text-slate-300 flex justify-between items-center group">
                RUN_SENSOR_CALIBRATION
                <span className="text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity">EXECUTE</span>
              </button>
              <button className="w-full text-left px-4 py-3 bg-carbon-800/50 hover:bg-neon-cyan/10 border border-transparent hover:border-neon-cyan/30 rounded-xl transition-all font-mono text-xs text-slate-300 flex justify-between items-center group">
                REBOOT_TELEMETRY_LINK
                <span className="text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity">EXECUTE</span>
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="hud-card p-8">
             <div className="flex items-center gap-4 mb-6 pb-4 border-b border-glass-border">
              <FileText size={24} className="text-neon-cyan" />
              <h2 className="text-lg font-black tracking-widest text-white uppercase">Manuals & Docs</h2>
            </div>
            <div className="space-y-4">
              <a href="#" className="block px-4 py-3 bg-carbon-800/50 hover:bg-neon-cyan/10 border border-transparent hover:border-neon-cyan/30 rounded-xl transition-all font-mono text-xs text-slate-300">
                &gt; TRACTOR_OS_MANUAL_V4.pdf
              </a>
              <a href="#" className="block px-4 py-3 bg-carbon-800/50 hover:bg-neon-cyan/10 border border-transparent hover:border-neon-cyan/30 rounded-xl transition-all font-mono text-xs text-slate-300">
                &gt; SAFETY_PROTOCOLS_2026.pdf
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
