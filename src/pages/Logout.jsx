import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, ShieldOff, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

export function Logout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [phase, setPhase] = useState('confirm'); // confirm | processing | done
  const displayName = user?.username?.toUpperCase() || 'OPERATOR';

  const handleLogout = () => {
    setPhase('processing');

    // Simulate a brief secure teardown sequence for dramatic effect
    setTimeout(() => {
      setPhase('done');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 1200);
    }, 1500);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-deep-space relative overflow-hidden">
      {/* Background HUD Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-neon-danger/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-neon-danger/10 rounded-full animate-[spin_60s_linear_infinite]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="hud-card p-10 backdrop-blur-3xl border-neon-danger/20">
          <AnimatePresence mode="wait">
            {/* Phase 1: Confirmation */}
            {phase === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="text-center mb-10">
                  <div className="inline-flex p-4 bg-neon-danger/10 rounded-2xl border border-neon-danger/20 mb-6">
                    <ShieldOff size={40} className="text-neon-danger" />
                  </div>
                  <h1 className="text-3xl font-black tracking-[0.2em] italic bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-text-heading)] to-neon-danger/50">
                    SESSION_TERMINATE
                  </h1>
                  <p className="text-[10px] font-black tracking-[0.4em] text-[var(--color-text-dim)] uppercase mt-2">
                    Secure Disconnection Protocol
                  </p>
                </div>

                {/* User Info Card */}
                <div className="bg-carbon-800/50 border border-glass-border rounded-xl p-5 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                      <span className="text-lg font-black text-neon-cyan">{displayName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-black tracking-widest text-[var(--color-text-heading)]">{displayName}</p>
                      <p className="text-[10px] font-bold tracking-widest text-neon-emerald uppercase mt-0.5">● SESSION_ACTIVE</p>
                    </div>
                  </div>
                </div>

                <div className="bg-neon-amber/5 border border-neon-amber/20 rounded-xl p-4 mb-8">
                  <p className="text-[10px] font-black tracking-widest text-neon-amber uppercase text-center leading-relaxed">
                    ⚠ This action will revoke your authentication token and terminate all active sessions
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-4 py-4 bg-neon-danger/10 border border-neon-danger/30 rounded-xl text-neon-danger font-black tracking-[0.15em] text-sm uppercase hover:bg-neon-danger/20 hover:border-neon-danger/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] transition-all duration-300 cursor-pointer group"
                  >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    CONFIRM_LOGOUT
                  </button>

                  <button
                    onClick={handleCancel}
                    className="w-full flex items-center justify-center gap-4 py-4 bg-carbon-800/30 border border-glass-border rounded-xl text-[var(--color-text-dim)] font-black tracking-[0.15em] text-sm uppercase hover:text-[var(--color-text-main)] hover:bg-carbon-800/50 transition-all duration-300 cursor-pointer group"
                  >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    RETURN_TO_BASE
                  </button>
                </div>
              </motion.div>
            )}

            {/* Phase 2: Processing */}
            {phase === 'processing' && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-8"
              >
                <div className="inline-flex p-4 bg-neon-amber/10 rounded-2xl border border-neon-amber/20 mb-6">
                  <Loader2 size={40} className="text-neon-amber animate-spin" />
                </div>
                <h2 className="text-2xl font-black tracking-[0.2em] text-[var(--color-text-heading)] mb-4">
                  DISCONNECTING...
                </h2>
                <div className="space-y-3 text-left max-w-xs mx-auto">
                  <TerminalLine delay={0} text="Revoking JWT token..." />
                  <TerminalLine delay={0.4} text="Clearing session data..." />
                  <TerminalLine delay={0.8} text="Closing secure channel..." />
                  <TerminalLine delay={1.2} text="Session terminated ✓" />
                </div>
              </motion.div>
            )}

            {/* Phase 3: Done */}
            {phase === 'done' && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="inline-flex p-4 bg-neon-emerald/10 rounded-2xl border border-neon-emerald/20 mb-6">
                  <CheckCircle2 size={40} className="text-neon-emerald" />
                </div>
                <h2 className="text-2xl font-black tracking-[0.2em] text-neon-emerald mb-3">
                  DISCONNECTED
                </h2>
                <p className="text-[10px] font-black tracking-[0.3em] text-[var(--color-text-dim)] uppercase">
                  Redirecting to authentication...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function TerminalLine({ delay, text }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!visible) return <div className="h-5" />;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2"
    >
      <span className="text-neon-cyan font-mono text-xs">▸</span>
      <span className="text-[11px] font-mono text-[var(--color-text-dim)]">{text}</span>
    </motion.div>
  );
}
