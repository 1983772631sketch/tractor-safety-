import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, Map, User, MessageSquare, HelpCircle, Sun, Moon, Rocket, Siren, Terminal } from 'lucide-react';
import { useTheme, ThemeProvider } from './ThemeContext';
import { useAuth } from './AuthContext';
import { useSos } from './SosContext';

export function AppLayout({ children }) {
  return (
    <ThemeProvider>
      <LayoutContent>{children}</LayoutContent>
    </ThemeProvider>
  );
}

function LayoutContent({ children }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { isSosActive, toggleSos } = useSos();
  const location = useLocation();
  const navItems = [
    { path: '/', icon: LayoutGrid, label: 'DASHBOARD' },
    { path: '/history', icon: Map, label: 'GPS_HISTORY' },
    { path: '/serial-history', icon: Terminal, label: 'SERIAL_LOGS' },
    { path: '/profile', icon: User, label: 'OPERATOR' },
    { path: '/feedback', icon: MessageSquare, label: 'FEEDBACK' },
    { path: '/support', icon: HelpCircle, label: 'SUPPORT' },
    { path: '/upgrades', icon: Rocket, label: 'UPGRADES' },
  ];

  return (
    <div className="flex h-screen bg-deep-space text-[var(--color-text-main)] selection:bg-neon-cyan/30 selection:text-white overflow-hidden">
      {/* Animated Mesh Gradient Background (Global) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-cyan/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-neon-blue/20 blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>
      <div className="absolute inset-0 z-10 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%]" />

      {/* Side Navigation */}
      <nav className="relative z-20 w-24 border-r border-glass-border bg-carbon-900/60 backdrop-blur-xl flex flex-col items-center py-8 justify-between">
        <div className="flex flex-col gap-8 w-full items-center">
          <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center neon-glow-cyan mb-8">
            <span className="text-xl font-black italic text-neon-cyan tracking-tighter">T</span>
          </div>

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className="relative group w-full flex justify-center">
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-neon-cyan rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                  />
                )}
                <div className={`p-3 rounded-xl transition-all duration-300 ${isActive ? 'text-neon-cyan bg-neon-cyan/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                  <Icon size={24} />
                </div>
                {/* Tooltip */}
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-carbon-800 border border-glass-border rounded text-[10px] font-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 items-center">
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-xl text-slate-500 hover:text-neon-cyan hover:bg-neon-cyan/10 transition-colors group relative"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-carbon-800 border border-glass-border rounded text-[10px] font-black tracking-widest text-[var(--color-text-heading)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {theme === 'dark' ? 'LIGHT_MODE' : 'DARK_MODE'}
            </div>
          </button>

          <button 
            onClick={toggleSos}
            className={`p-3 rounded-xl transition-all duration-300 group relative ${isSosActive ? 'text-white bg-neon-danger shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse' : 'text-slate-500 hover:text-neon-danger hover:bg-neon-danger/10'}`}
          >
            <Siren size={24} className={isSosActive ? 'animate-bounce' : ''} />
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-carbon-800 border border-glass-border rounded text-[10px] font-black tracking-widest text-[var(--color-text-heading)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              {isSosActive ? 'DISABLE_SOS' : 'ENABLE_SOS'}
            </div>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-20 flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Decorative HUD Corners (Global) */}
      <div className="fixed top-4 left-28 w-8 h-8 border-t-2 border-l-2 border-neon-cyan/20 pointer-events-none z-50" />
      <div className="fixed top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-neon-cyan/20 pointer-events-none z-50" />
      <div className="fixed bottom-4 left-28 w-8 h-8 border-b-2 border-l-2 border-neon-cyan/20 pointer-events-none z-50" />
      <div className="fixed bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-neon-cyan/20 pointer-events-none z-50" />
    </div>
  );
}
