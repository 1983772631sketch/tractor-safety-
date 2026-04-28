import { useEffect, useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Zap, Activity, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PowerGraph = ({ value }) => {
  const [data, setData] = useState(Array.from({ length: 60 }, (_, i) => ({ time: i, value: 0 })));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(prev => {
      const newData = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, value }];
      return newData;
    });
  }, [value]);

  // eslint-disable-next-line react-hooks/purity
  const barHeights = useMemo(() => [1, 2, 3, 4].map(() => Math.random() * 24 + 8), []);

  const isPowerDetected = value > 10;
  const color = isPowerDetected ? 'var(--color-neon-danger)' : 'var(--color-neon-cyan)';
  const textColor = isPowerDetected ? 'text-neon-danger' : 'text-neon-cyan';

  return (
    <div className="hud-card group p-8 h-full flex flex-col min-h-[400px]">
      <div className="flex items-center justify-between mb-10">
        <div>
          <span className="data-label">Electromagnetic Flux</span>
          <div className="flex items-center gap-4">
            <h3 className={`text-2xl font-black tracking-widest ${textColor} italic flex items-center gap-3`}>
              <Zap size={20} className={isPowerDetected ? "animate-pulse" : ""} />
              POWER_MONITOR
            </h3>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <AnimatePresence mode="wait">
            {isPowerDetected ? (
              <motion.div 
                key="danger"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 px-4 py-1.5 bg-neon-danger/10 border border-neon-danger/30 rounded-lg text-neon-danger text-[10px] font-black tracking-widest"
              >
                <AlertTriangle size={12} className="animate-bounce" />
                HIGH_VOLTAGE_DETECTED
              </motion.div>
            ) : (
              <motion.div 
                key="safe"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2 px-4 py-1.5 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg text-neon-cyan text-[10px] font-black tracking-widest"
              >
                <Activity size={12} />
                SIGNAL_CLEAR
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="flex-grow w-full relative">
        {/* Background Grid Decoration */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="h-full w-full bg-[linear-gradient(to_right,var(--color-text-dim)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-text-dim)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative z-10 w-full h-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-glass-border)" vertical={false} />
              <XAxis hide />
              <YAxis hide domain={[0, 1000]} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-carbon-900/90 backdrop-blur-md border border-glass-border p-3 rounded-xl shadow-2xl">
                        <div className="text-[10px] font-black text-[var(--color-text-dim)] uppercase tracking-widest mb-1">Signal Strength</div>
                        <div className={`text-xl font-mono font-bold ${textColor}`}>
                          {payload[0].value.toFixed(2)} <span className="text-[10px]">µV</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="stepAfter" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorWave)" 
                isAnimationActive={false}
                className={isPowerDetected ? "neon-glow-danger" : "neon-glow-cyan"}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 flex items-end justify-between border-t border-glass-border pt-6">
        <div>
          <div className="data-label">Live Amplitude</div>
          <div className={`text-5xl font-mono font-black tracking-tighter ${textColor} flex items-baseline gap-2`}>
            {value.toFixed(1)}
            <span className="text-sm font-sans text-[var(--color-text-dim)] font-bold tracking-widest uppercase">RAW_FLUX</span>
          </div>
        </div>
        
        <div className="hidden md:flex gap-4">
          {[1, 2, 3, 4].map((i, idx) => (
            <motion.div 
              key={i}
              className={`w-1 h-8 rounded-full ${isPowerDetected ? 'bg-neon-danger' : 'bg-neon-cyan'}`}
              animate={{ height: [8, barHeights[idx], 8] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              style={{ opacity: 0.2 + (i * 0.2) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

