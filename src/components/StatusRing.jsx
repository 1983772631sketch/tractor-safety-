import React from 'react';
import { motion } from 'framer-motion';

export const StatusRing = ({ label, value, max = 300, unit = 'cm', warningThreshold = 150, criticalThreshold = 50 }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  // Determine color based on distance
  let color = '#4ade80'; // brand-success
  let status = 'Safe';
  
  if (value <= criticalThreshold) {
    color = '#f87171'; // brand-danger
    status = 'Danger';
  } else if (value <= warningThreshold) {
    color = '#facc15'; // brand-warning
    status = 'Warning';
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-card flex flex-col items-center justify-center p-8 relative overflow-hidden group">
      
      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-20 transition-colors duration-500 blur-3xl pointer-events-none"
        style={{ backgroundColor: color }}
      />

      <h3 className="text-gray-400 text-sm font-semibold tracking-wider uppercase mb-6 z-10">{label}</h3>
      
      <div className="relative w-40 h-40 z-10">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-dark-border"
            strokeWidth="12"
            fill="none"
          />
          {/* Animated value circle */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-4xl font-bold font-mono tracking-tighter"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            key={value}
          >
            {value.toFixed(0)}
          </motion.span>
          <span className="text-gray-500 text-xs mt-1 font-semibold uppercase">{unit}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center space-x-2 z-10">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-medium" style={{ color }}>{status}</span>
      </div>
    </div>
  );
};
