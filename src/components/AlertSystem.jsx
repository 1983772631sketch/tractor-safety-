import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, Zap, Skull } from 'lucide-react';

export const AlertSystem = ({ loader, obstacle, zmpt }) => {
  const alerts = [];

  if (zmpt > 10) {
    alerts.push({ id: 'power', msg: 'ELECTROMAGNETIC_INTERFERENCE: HIGH_VOLTAGE', type: 'critical', icon: Zap });
  }
  if (loader < 150) {
    alerts.push({ id: 'loader', msg: 'PAYLOAD_ELEVATION_FAILURE: STABILITY_AT_RISK', type: 'warning', icon: AlertTriangle });
  }
  if (obstacle < 150) {
    alerts.push({ id: 'obstacle', msg: 'PROXIMITY_COLLISION_IMMINENT: AUTO_BRAKE_READY', type: 'critical', icon: Skull });
  }

  const isCritical = alerts.some(a => a.type === 'critical');

  return (
    <>
      {/* Full Screen Hazard Strobe */}
      <AnimatePresence>
        {isCritical && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="fixed inset-0 z-[60] bg-neon-danger pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-[70] flex flex-col gap-4 w-full max-w-2xl px-6 pointer-events-none">
        <AnimatePresence>
          {alerts.map(alert => {
            const Icon = alert.icon;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
                className={`
                  relative overflow-hidden flex items-center gap-6 px-8 py-5 rounded-2xl border-2
                  ${alert.type === 'critical' 
                    ? 'bg-neon-danger/20 border-neon-danger text-white shadow-[0_0_50px_rgba(244,63,94,0.3)]' 
                    : 'bg-neon-amber/20 border-neon-amber text-white shadow-[0_0_50px_rgba(251,191,36,0.2)]'
                  }
                  backdrop-blur-2xl
                `}
              >
                {/* HUD Decorative Elements */}
                <div className="absolute top-0 left-0 w-2 h-full bg-current opacity-50" />
                
                <div className={`p-3 rounded-xl ${alert.type === 'critical' ? 'bg-neon-danger/20' : 'bg-neon-amber/20'}`}>
                  <Icon size={28} className={alert.type === 'critical' ? 'animate-pulse' : ''} />
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-[0.5em] opacity-50 mb-1 uppercase">
                    SYSTEM_ALERT_{alert.id.toUpperCase()}
                  </span>
                  <span className="text-lg font-black tracking-widest uppercase italic">
                    {alert.msg}
                  </span>
                </div>

                {/* Animated Scanline in Alert */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1/2 w-full"
                  animate={{ y: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
};

