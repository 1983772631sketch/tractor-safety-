import React from 'react';
import { MapPin, Satellite } from 'lucide-react';

export const GpsCard = ({ lat, lng, fix, sats }) => {
  return (
    <div className="glass-card flex flex-col p-8 relative overflow-hidden group">
      
      <div className="flex items-center justify-between mb-8 z-10">
        <h3 className="text-gray-400 text-sm font-semibold tracking-wider uppercase flex items-center gap-2">
          <MapPin size={16} className="text-brand-primary" />
          Location Status
        </h3>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${fix ? 'bg-brand-success/20 text-brand-success' : 'bg-gray-700/50 text-gray-400'}`}>
          <div className={`w-2 h-2 rounded-full ${fix ? 'bg-brand-success animate-pulse' : 'bg-gray-500'}`} />
          {fix ? '3D FIX ACQUIRED' : 'SEARCHING...'}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 flex-grow z-10">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 group-hover:bg-white/10 transition-colors">
          <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2">Navigation Coordinates</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">LAT</span>
              <span className="text-lg font-mono text-white tracking-tighter glow-text">{lat}</span>
            </div>
            <div className="flex justify-between items-center border-t border-white/5 pt-2">
              <span className="text-xs text-slate-400">LNG</span>
              <span className="text-lg font-mono text-white tracking-tighter glow-text">{lng}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-5 border border-white/5 group-hover:bg-white/10 transition-colors z-10">
          <div className={`p-3 rounded-xl ${fix ? 'bg-brand-primary/10' : 'bg-slate-800'}`}>
            <Satellite size={20} className={fix ? "text-brand-primary animate-pulse" : "text-slate-500"} />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">{sats}</p>
            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Active Satellites</p>
          </div>
        </div>
      </div>
    </div>
  );
};
