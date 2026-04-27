import React from 'react';
import { useDashboardData } from './hooks/useDashboardData';
import { DashboardLayout } from './components/DashboardLayout';
import { StatusRing } from './components/StatusRing';
import { PowerGraph } from './components/PowerGraph';
import { GpsCard } from './components/GpsCard';
import { AlertSystem } from './components/AlertSystem';
import { Plug, Unplug, AlertCircle, Wifi, Cpu, Settings } from 'lucide-react';

function App() {
  const { mode, setMode, isConnected, data, error, connect, disconnect } = useDashboardData();

  return (
    <>
      <AlertSystem loader={data.loader} obstacle={data.obstacle} zmpt={data.zmpt} />
      
      <DashboardLayout mode={mode} setMode={setMode}>
        {{
          headerActions: (
            <div className="flex items-center gap-4">
              {error && (
                <div className="flex items-center gap-2 text-brand-danger text-xs font-bold bg-brand-danger/10 px-4 py-2 rounded-2xl border border-brand-danger/20 animate-pulse">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}
              
              <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                <Settings size={14} className="text-slate-500" />
                <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">Hardware Config</span>
              </div>

              <button
                onClick={isConnected ? disconnect : connect}
                disabled={mode !== 'serial'}
                className={`
                  premium-button flex items-center gap-3 px-8
                  ${mode !== 'serial' ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                  ${isConnected 
                    ? 'bg-slate-800 text-slate-300 border border-white/5 hover:text-white hover:border-white/20' 
                    : 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20'
                  }
                `}
              >
                {isConnected ? <Unplug size={18} /> : <Plug size={18} />}
                <span className="tracking-widest uppercase">{isConnected ? 'OFFLINE' : 'INITIATE LINK'}</span>
              </button>
            </div>
          ),
          main: (
            <>
              {/* Loader Height Visualizer */}
              <div className="col-span-1">
                <StatusRing 
                  label="Payload Elevation" 
                  value={data.loader} 
                  max={400} 
                  unit="mm"
                  warningThreshold={200}
                  criticalThreshold={100}
                />
              </div>

              {/* Obstacle Distance Visualizer */}
              <div className="col-span-1">
                <StatusRing 
                  label="Proximity Radar" 
                  value={data.obstacle} 
                  max={500} 
                  unit="cm"
                  warningThreshold={200}
                  criticalThreshold={50}
                />
              </div>

              {/* GPS Status */}
              <div className="col-span-1">
                <GpsCard 
                  lat={data.lat} 
                  lng={data.lng} 
                  fix={data.fix} 
                  sats={data.sats} 
                />
              </div>

              {/* Power Line Monitor */}
              <div className="col-span-1 md:col-span-2 lg:col-span-3 min-h-[350px]">
                <PowerGraph value={data.zmpt} />
              </div>
            </>
          )
        }}
      </DashboardLayout>
    </>
  );
}

export default App;
