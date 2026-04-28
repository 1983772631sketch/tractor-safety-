import { useMemo } from 'react';
import { MapPin, Satellite, Crosshair } from 'lucide-react';
import { motion } from 'framer-motion';

export const GpsCard = ({ lat, lng, fix, sats }) => {
  const satellitePositions = useMemo(() => {
    return [...Array(sats || 0)].map(() => ({
      // eslint-disable-next-line react-hooks/purity
      top: `${20 + Math.random() * 60}%`,
      // eslint-disable-next-line react-hooks/purity
      left: `${20 + Math.random() * 60}%`,
    }));
  }, [sats]);

  return (
    <div className="hud-card group p-8 flex flex-col min-h-[400px]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="data-label">Geospatial Link</span>
          <h3 className="text-2xl font-black tracking-widest text-[var(--color-text-heading)] italic flex items-center gap-3">
            <MapPin size={20} className="text-neon-cyan" />
            NAV_CORE
          </h3>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all duration-500 ${fix ? 'bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/30' : 'bg-glass-white text-[var(--color-text-dim)] border border-glass-border'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${fix ? 'bg-neon-emerald animate-pulse' : 'bg-[var(--color-text-border)]'}`} />
          {fix ? 'SIGNAL_LOCKED' : 'SEARCH_MODE'}
        </div>
      </div>

      <div className="flex-grow flex flex-col gap-6">
        {/* Radar Visualization */}
        <div className="relative w-full aspect-video bg-carbon-800/30 rounded-2xl border border-glass-border overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--color-text-dim)_1px,transparent_1px)] bg-[size:20px_20px]" />
          
          {/* Radar Sweep */}
          <motion.div 
            className="absolute w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(34,211,238,0.1)_180deg,transparent_200deg)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Concentric Circles */}
          <div className="absolute w-16 h-16 border border-glass-border rounded-full" />
          <div className="absolute w-32 h-32 border border-glass-border rounded-full" />
          <div className="absolute w-48 h-48 border border-glass-border rounded-full" />
          
          <Crosshair size={24} className={fix ? "text-neon-cyan neon-glow-cyan" : "text-[var(--color-text-dim)]"} />
          
          {/* Mock Satellite Dots */}
          {satellitePositions.map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-neon-cyan rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
              style={{
                top: pos.top,
                left: pos.left,
              }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-glass-white rounded-xl border border-glass-border">
            <span className="data-label">LATITUDE</span>
            <div className="text-xl font-mono font-bold text-[var(--color-text-heading)] tracking-tighter">
              {lat || '0.000000'}
            </div>
          </div>
          <div className="p-4 bg-glass-white rounded-xl border border-glass-border">
            <span className="data-label">LONGITUDE</span>
            <div className="text-xl font-mono font-bold text-[var(--color-text-heading)] tracking-tighter">
              {lng || '0.000000'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-glass-border pt-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${fix ? 'bg-neon-cyan/10 border border-neon-cyan/20' : 'bg-glass-white'}`}>
            <Satellite size={20} className={fix ? "text-neon-cyan" : "text-[var(--color-text-dim)]"} />
          </div>
          <div>
            <div className="text-2xl font-mono font-black text-[var(--color-text-heading)]">{sats}</div>
            <div className="data-label !mb-0">SAT_LINK_COUNT</div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-[8px] font-black tracking-[0.3em] text-[var(--color-text-dim)] mb-1">PROTO: NMEA_v4</div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-3 h-1 rounded-full ${i < (fix ? 4 : 1) ? 'bg-neon-cyan' : 'bg-[var(--color-text-border)]'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

