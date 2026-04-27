import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export const AlertSystem = ({ loader, obstacle, zmpt }) => {
  const alerts = [];

  if (zmpt > 10) {
    alerts.push({ id: 'power', msg: 'HIGH VOLTAGE DETECTED PROXIMITY', type: 'danger' });
  }
  if (loader < 150) {
    alerts.push({ id: 'loader', msg: 'LOADER TOO LOW - RAISE IMMEDIATELY', type: 'warning' });
  }
  if (obstacle < 150) {
    alerts.push({ id: 'obstacle', msg: 'OBSTACLE DETECTED IN FORWARD PATH', type: 'danger' });
  }

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-3 w-full max-w-2xl px-4 pointer-events-none">
      <AnimatePresence>
        {alerts.map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`
              flex items-center gap-4 px-6 py-4 rounded-xl shadow-2xl border
              ${alert.type === 'danger' 
                ? 'bg-brand-danger/90 border-brand-danger text-white shadow-brand-danger/50' 
                : 'bg-brand-warning/90 border-brand-warning text-dark-bg shadow-brand-warning/50'
              }
              backdrop-blur-md
            `}
          >
            <AlertTriangle size={24} className={alert.type === 'danger' ? 'animate-pulse' : ''} />
            <span className="font-bold tracking-wide uppercase">{alert.msg}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
