import { motion } from 'framer-motion';
import { Terminal, Trash2, Clock, MapPin, Zap } from 'lucide-react';
import { useSerial } from '../components/SerialContext';

export function SerialHistory() {
  const { history, clearHistory } = useSerial();

  return (
    <div className="p-4 md:p-8 lg:p-12 h-full flex flex-col">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
          <h1 className="text-4xl font-black tracking-[0.2em] italic bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-neon-cyan/50">
            SERIAL_DATA_LOGS
          </h1>
          <p className="text-[10px] font-black tracking-[0.3em] text-slate-500 mt-2 uppercase flex items-center gap-2">
            <Terminal size={12} className="text-neon-cyan" />
            LIVE TELEMETRY STREAM ARCHIVE
          </p>
        </motion.div>

        <button 
          onClick={clearHistory}
          className="flex items-center gap-3 px-6 py-3 bg-neon-danger/10 border border-neon-danger/30 rounded-xl text-neon-danger text-[10px] font-black tracking-widest hover:bg-neon-danger/20 transition-all uppercase"
        >
          <Trash2 size={16} />
          WIPE_LOG_MEMORY
        </button>
      </header>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-grow hud-card overflow-hidden flex flex-col"
      >
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-carbon-900/90 backdrop-blur-md border-b border-glass-border">
              <tr>
                <th className="px-6 py-4 text-[8px] font-black tracking-[0.4em] text-slate-500 uppercase">TIMESTAMP</th>
                <th className="px-6 py-4 text-[8px] font-black tracking-[0.4em] text-slate-500 uppercase">LOADER_LVL</th>
                <th className="px-6 py-4 text-[8px] font-black tracking-[0.4em] text-slate-500 uppercase">OBSTACLE_DIST</th>
                <th className="px-6 py-4 text-[8px] font-black tracking-[0.4em] text-slate-500 uppercase">POWER_FLUX</th>
                <th className="px-6 py-4 text-[8px] font-black tracking-[0.4em] text-slate-500 uppercase">GPS_COORD</th>
                <th className="px-6 py-4 text-[8px] font-black tracking-[0.4em] text-slate-500 uppercase">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border/30">
              {history.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-[10px] font-black tracking-widest text-slate-600 uppercase">
                    NO_SERIAL_DATA_CAPTURED_IN_SESSION
                  </td>
                </tr>
              ) : (
                history.map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400 group-hover:text-neon-cyan transition-colors">
                        <Clock size={12} />
                        {entry.timestamp}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono font-bold text-white">
                        {entry.loader} <span className="text-[10px] text-slate-500 uppercase ml-1">cm</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-mono font-bold text-white">
                        {entry.obstacle} <span className="text-[10px] text-slate-500 uppercase ml-1">cm</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-2 text-sm font-mono font-bold ${entry.zmpt > 10 ? 'text-neon-danger' : 'text-neon-cyan'}`}>
                        <Zap size={12} className={entry.zmpt > 10 ? 'animate-pulse' : ''} />
                        {entry.zmpt.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <MapPin size={12} className={entry.fix ? 'text-neon-emerald' : 'text-slate-600'} />
                        {entry.lat}, {entry.lng}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex px-2 py-1 rounded text-[8px] font-black tracking-widest uppercase ${entry.fix ? 'bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/20' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                        {entry.fix ? 'SIGNAL_LOCKED' : 'SEARCH_MODE'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
