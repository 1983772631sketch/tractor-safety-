import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquareWarning } from 'lucide-react';

export function Feedback() {
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('sent'), 1500);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl font-black tracking-[0.2em] italic bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-text-heading)] via-[var(--color-text-heading)] to-neon-cyan/50">
              OPERATOR_FEEDBACK
            </h1>
            <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 mt-2">SUBMIT LOGS DIRECTLY TO COMMAND_CENTER</p>
          </motion.div>
        </header>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="hud-card p-8">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-glass-border">
            <MessageSquareWarning size={32} className="text-neon-amber" />
            <div>
              <h2 className="text-xl font-black tracking-widest text-[var(--color-text-heading)] uppercase">Field Report Log</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">All transmissions are encrypted</p>
            </div>
          </div>

          {status === 'sent' ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-neon-emerald/20 border border-neon-emerald/50 flex items-center justify-center mx-auto mb-6 neon-glow-emerald">
                <Send className="text-neon-emerald" size={24} />
              </div>
              <h3 className="text-2xl font-black text-[var(--color-text-heading)] tracking-widest uppercase mb-2">Transmission Successful</h3>
              <p className="text-slate-500 text-xs font-mono uppercase">Log recorded in central database.</p>
              <button onClick={() => setStatus('idle')} className="mt-8 cyber-button text-[10px]">SUBMIT_ANOTHER_REPORT</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="data-label">REPORT_CATEGORY</label>
                <select className="w-full bg-carbon-800/50 border border-glass-border rounded-xl p-4 text-[var(--color-text-main)] font-mono focus:outline-none focus:border-neon-cyan/50 focus:bg-neon-cyan/5 transition-all">
                  <option value="hardware">Hardware Malfunction</option>
                  <option value="software">Software / UI Bug</option>
                  <option value="safety">Safety Hazard</option>
                  <option value="general">General Suggestion</option>
                </select>
              </div>

              <div>
                <label className="data-label">DETAILED_DESCRIPTION</label>
                <textarea 
                  required
                  rows="6"
                  className="w-full bg-carbon-800/50 border border-glass-border rounded-xl p-4 text-[var(--color-text-main)] font-mono focus:outline-none focus:border-neon-cyan/50 focus:bg-neon-cyan/5 transition-all resize-none"
                  placeholder="Enter logs here..."
                ></textarea>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={status === 'sending'}
                  className={`cyber-button w-full flex items-center justify-center gap-3 ${status === 'sending' ? 'opacity-50 cursor-wait' : ''}`}
                >
                  <Send size={18} className={status === 'sending' ? 'animate-pulse' : ''} />
                  {status === 'sending' ? 'UPLOADING_LOGS...' : 'TRANSMIT_REPORT'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
