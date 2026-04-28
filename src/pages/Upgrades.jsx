import { motion } from 'framer-motion';
import { Rocket, Target, Eye, ShieldAlert, Activity, Users, Terminal, ChevronRight } from 'lucide-react';

const upgradePhases = [
  {
    phase: "Phase 1: Precision Navigation",
    title: "RTK GPS & Geofencing",
    description: "Upgrade to Real-Time Kinematic (RTK) GPS for centimeter-level accuracy and set virtual boundaries to keep the tractor within safe zones.",
    icon: Target,
    color: "neon-cyan",
    status: "PLANNED"
  },
  {
    phase: "Phase 2: Vision & AI",
    title: "Obstacle Classification",
    description: "Add an ESP32-CAM to distinguish between harmless debris and humans or livestock using simplified Edge AI models.",
    icon: Eye,
    color: "neon-blue",
    status: "R&D_STAGE"
  },
  {
    phase: "Phase 3: Active Safety",
    title: "Auto-Braking System",
    description: "Link the ESP32 to a relay or actuator to automatically cut power or apply brakes if a critical collision is imminent.",
    icon: ShieldAlert,
    color: "neon-danger",
    status: "CORE_PROTO"
  },
  {
    phase: "Phase 4: Structural Health",
    title: "Rollover Detection",
    description: "Integrate an MPU6050 Gyroscope to detect dangerous tilt angles and instantly alert the operator or emergency services.",
    icon: Activity,
    color: "neon-amber",
    status: "VALIDATING"
  },
  {
    phase: "Phase 5: Multi-Unit Fleet",
    title: "Multi-Tractor Sync",
    description: "Expand the dashboard to track and display live data (location, load, and health) from multiple tractors simultaneously on the owner's device.",
    icon: Users,
    color: "neon-cyan",
    status: "FUTURE_OS"
  },
  {
    phase: "Phase 6: Admin Protocol",
    title: "Communication Establishment",
    description: "Develop a secure two-way communication channel between the owner's device and the tractor to send remote commands or firmware updates.",
    icon: Terminal,
    color: "neon-emerald",
    status: "SECURITY_SYNC"
  }
];

export function Upgrades() {
  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
      <header className="mb-16">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-neon-cyan/10 rounded-2xl border border-neon-cyan/20 neon-glow-cyan">
              <Rocket className="text-neon-cyan" size={32} />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-[0.2em] italic bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-text-heading)] via-[var(--color-text-heading)] to-neon-cyan/50">
                SYSTEM_UPGRADES
              </h1>
              <div className="flex items-center gap-4 text-[10px] font-black tracking-[0.3em] text-[var(--color-text-dim)] mt-1 uppercase">
                <span>Core_Evolution_Roadmap</span>
                <span className="text-[var(--color-text-border)]">|</span>
                <span>V2.0_Development_Cycle</span>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {upgradePhases.map((phase, index) => {
          const Icon = phase.icon;
          const colorClass = {
            'neon-cyan': 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20 neon-glow-cyan',
            'neon-blue': 'text-neon-blue bg-neon-blue/10 border-neon-blue/20 neon-glow-blue',
            'neon-danger': 'text-neon-danger bg-neon-danger/10 border-neon-danger/20 neon-glow-danger',
            'neon-amber': 'text-neon-amber bg-neon-amber/10 border-neon-amber/20 neon-glow-amber',
            'neon-emerald': 'text-neon-emerald bg-neon-emerald/10 border-neon-emerald/20 neon-glow-emerald',
          }[phase.color];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="hud-card group p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl border ${colorClass}`}>
                    <Icon size={24} />
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] font-black tracking-widest text-[var(--color-text-dim)] uppercase mb-1">Status</div>
                    <div className={`text-[10px] font-mono font-bold tracking-tighter ${colorClass.split(' ')[0]}`}>{phase.status}</div>
                  </div>
                </div>


                <div className="text-[10px] font-black tracking-[0.4em] text-[var(--color-text-dim)] uppercase mb-2">
                  {phase.phase}
                </div>
                <h3 className="text-xl font-black tracking-widest text-[var(--color-text-heading)] mb-4 group-hover:text-neon-cyan transition-colors">
                  {phase.title}
                </h3>
                <p className="text-sm text-[var(--color-text-main)] leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity">
                  {phase.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-glass-border pt-6">
                <span className="text-[8px] font-black text-[var(--color-text-dim)] tracking-widest uppercase">Protocol_Locked</span>
                <ChevronRight size={16} className="text-[var(--color-text-dim)] group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <footer className="mt-20 border-t border-glass-border pt-10 text-center">
        <p className="text-[10px] font-black tracking-[0.5em] text-[var(--color-text-dim)] uppercase italic">
          Continuous_Improvement_Protocol_Engaged // Standing_By_For_v2.0_Rollout
        </p>
      </footer>
    </div>
  );
}
