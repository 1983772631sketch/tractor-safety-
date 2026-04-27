import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap } from 'lucide-react';

export const PowerGraph = ({ value }) => {
  const [data, setData] = useState(Array.from({ length: 50 }, (_, i) => ({ time: i, value: 0 })));

  useEffect(() => {
    setData(prev => {
      const newData = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, value }];
      return newData;
    });
  }, [value]);

  const isPowerDetected = value > 10;
  const color = isPowerDetected ? '#f87171' : '#38bdf8'; // red or blue

  return (
    <div className="glass-card flex flex-col p-8 h-full relative overflow-hidden group">
      
      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-10 transition-colors duration-500 blur-3xl pointer-events-none"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-center justify-between mb-6 z-10">
        <h3 className="text-gray-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-2">
          <Zap size={16} className={isPowerDetected ? "text-brand-danger animate-pulse" : "text-brand-primary"} />
          Power Line Monitor
        </h3>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${isPowerDetected ? 'bg-brand-danger/20 text-brand-danger' : 'bg-brand-primary/20 text-brand-primary'}`}>
          {isPowerDetected ? 'DANGER: POWER DETECTED' : 'CLEAR'}
        </div>
      </div>
      
      <div className="flex-grow w-full h-48 z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ display: 'none' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 z-10">
        <div className="text-3xl font-mono font-bold text-white tracking-tighter">
          {value.toFixed(1)} <span className="text-sm font-sans text-gray-500">Raw</span>
        </div>
      </div>
    </div>
  );
};
