import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const StatusRing = ({ label, value, max = 300, unit = 'cm', warningThreshold = 150, criticalThreshold = 50 }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  // Determine color based on value
  let color = 'var(--color-neon-cyan)';
  let glowClass = 'neon-glow-cyan';
  let status = 'NOMINAL';
  let textColor = 'text-neon-cyan';
  
  if (value <= criticalThreshold) {
    color = 'var(--color-neon-danger)';
    glowClass = 'neon-glow-danger';
    status = 'CRITICAL';
    textColor = 'text-neon-danger';
  } else if (value <= warningThreshold) {
    color = 'var(--color-neon-amber)';
    glowClass = 'neon-glow-amber';
    status = 'WARNING';
    textColor = 'text-neon-amber';
  }

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="hud-card group p-8 flex flex-col items-center justify-between min-h-[300px]">
      <div className="w-full flex justify-between items-start mb-6">
        <div>
          <span className="data-label">{label}</span>
          <div className={`text-[10px] font-black tracking-[0.2em] ${textColor} flex items-center gap-2`}>
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'CRITICAL' ? 'animate-ping' : ''}`} style={{ backgroundColor: color }} />
            {status}
          </div>
        </div>
        <div className="p-2 bg-white/5 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
          <div className="text-[10px] font-mono text-slate-500">REF_VAL: {max}</div>
        </div>
      </div>
      
      <div className="relative w-48 h-48">
        <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.1)]">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            className="stroke-carbon-800"
            strokeWidth="8"
            fill="none"
            strokeDasharray="4 4"
          />
          
          {/* Subtle Outer Glow Ring */}
          <circle
            cx="96"
            cy="96"
            r={radius + 8}
            className="stroke-white/5"
            strokeWidth="1"
            fill="none"
          />

          {/* Value Ring */}
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ type: "spring", stiffness: 30, damping: 15 }}
            style={{ strokeDasharray: circumference }}
            className={glowClass}
          />
          
          {/* Internal Ticks */}
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1="96"
              y1="40"
              x2="96"
              y2="48"
              stroke="currentColor"
              strokeWidth="2"
              className="text-slate-800"
              transform={`rotate(${i * 30} 96 96)`}
            />
          ))}
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={value}
              initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
              className="flex flex-col items-center"
            >
              <span className={`data-value ${textColor} drop-shadow-2xl`}>
                {value.toFixed(0)}
              </span>
              <span className="text-[10px] font-black text-slate-500 tracking-[0.4em] uppercase -mt-1">
                {unit}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative HUD bar at bottom */}
      <div className="w-full h-1 bg-carbon-800 rounded-full mt-8 overflow-hidden relative">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-20"
          animate={{ x: ['-100%', '300%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="h-full"
          style={{ backgroundColor: color, width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

