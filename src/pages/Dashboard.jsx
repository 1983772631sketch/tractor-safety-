import React, { useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { DashboardLayout } from '../components/DashboardLayout';
import { StatusRing } from '../components/StatusRing';
import { PowerGraph } from '../components/PowerGraph';
import { GpsCard } from '../components/GpsCard';
import { AlertSystem } from '../components/AlertSystem';
import { Plug, Unplug, AlertCircle, Cpu, Settings, Power, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Dashboard() {
  const { mode, setMode, isConnected, data, error, connect, disconnect } = useDashboardData();
  
  // Sensor Toggle State
  const [sensors, setSensors] = useState({
    backLoader: true,
    frontLoader: true,
    power: true
  });

  const toggleSensor = (key) => setSensors(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      <AlertSystem loader={data.loader} obstacle={data.obstacle} zmpt={data.zmpt} />
      
      <DashboardLayout mode={mode} setMode={setMode}>
        {{
          headerActions: (
            <div className="flex items-center gap-4">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 text-neon-danger text-[10px] font-black bg-neon-danger/10 px-6 py-3 rounded-xl border border-neon-danger/30 animate-pulse tracking-[0.2em] uppercase"
                >
                  <AlertCircle size={14} />
                  SYNC_ERR: {error}
                </motion.div>
              )}
              
              {/* Sensor Visibility Controls */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-carbon-800/50 backdrop-blur-md rounded-xl border border-glass-border">
                <span className="text-[8px] font-black text-slate-500 tracking-[0.3em] uppercase mr-2">SENSOR_VIS:</span>
                
                <button 
                  onClick={() => toggleSensor('backLoader')}
                  className={`p-1.5 rounded-lg transition-colors ${sensors.backLoader ? 'text-neon-cyan bg-neon-cyan/10' : 'text-slate-600 hover:text-slate-400'}`}
                  title="Toggle Back Loader"
                >
                  {sensors.backLoader ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button 
                  onClick={() => toggleSensor('frontLoader')}
                  className={`p-1.5 rounded-lg transition-colors ${sensors.frontLoader ? 'text-neon-cyan bg-neon-cyan/10' : 'text-slate-600 hover:text-slate-400'}`}
                  title="Toggle Front Loader"
                >
                  {sensors.frontLoader ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button 
                  onClick={() => toggleSensor('power')}
                  className={`p-1.5 rounded-lg transition-colors ${sensors.power ? 'text-neon-cyan bg-neon-cyan/10' : 'text-slate-600 hover:text-slate-400'}`}
                  title="Toggle Power Monitor"
                >
                  {sensors.power ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>

              <button
                onClick={isConnected ? disconnect : connect}
                disabled={mode !== 'serial'}
                className={`
                  cyber-button flex items-center gap-4
                  ${mode !== 'serial' ? 'opacity-30 cursor-not-allowed grayscale' : ''}
                  ${isConnected 
                    ? 'bg-carbon-800 text-slate-400 border-white/5' 
                    : 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40 shadow-[0_0_30px_rgba(34,211,238,0.2)]'
                  }
                `}
              >
                {isConnected ? <Power size={16} /> : <Plug size={16} />}
                <span>{isConnected ? 'DISCONNECT' : 'INITIALIZE'}</span>
              </button>
            </div>
          ),
          main: (
            <AnimatePresence mode="popLayout">
              {/* Loader Height Visualizer */}
              {sensors.backLoader && (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="col-span-1"
                >
                  <StatusRing 
                    label="BACK LOADER" 
                    value={data.loader} 
                    max={400} 
                    unit="mm"
                    warningThreshold={200}
                    criticalThreshold={100}
                  />
                </motion.div>
              )}

              {/* Obstacle Distance Visualizer */}
              {sensors.frontLoader && (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="col-span-1"
                >
                  <StatusRing 
                    label="FRONT LOADER" 
                    value={data.obstacle} 
                    max={500} 
                    unit="cm"
                    warningThreshold={200}
                    criticalThreshold={50}
                  />
                </motion.div>
              )}

              {/* GPS Status (Always Visible) */}
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="col-span-1"
              >
                <GpsCard 
                  lat={data.lat} 
                  lng={data.lng} 
                  fix={data.fix} 
                  sats={data.sats} 
                />
              </motion.div>

              {/* Power Line Monitor */}
              {sensors.power && (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  transition={{ duration: 0.5 }}
                  className="col-span-1 md:col-span-2 lg:col-span-3 min-h-[400px]"
                >
                  <PowerGraph value={data.zmpt} />
                </motion.div>
              )}
            </AnimatePresence>
          )
        }}
      </DashboardLayout>
    </>
  );
}
