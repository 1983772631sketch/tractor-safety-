import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, KeyRound, Terminal, Lock } from 'lucide-react';

export function Login() {
  const [key, setKey] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    // Mock Auth Delay
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-deep-space flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-neon-cyan/20 blur-[150px] animate-pulse" />
      </div>
      <div className="absolute inset-0 z-10 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="hud-card w-full max-w-md p-8 relative z-20"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-neon-cyan/10 rounded-2xl border border-neon-cyan/20 neon-glow-cyan mb-6">
            <Lock className="text-neon-cyan" size={40} />
          </div>
          <h1 className="text-3xl font-black tracking-[0.2em] italic text-white mb-2">SECURE_ACCESS</h1>
          <p className="text-[10px] font-black tracking-[0.4em] text-slate-500 uppercase">Tractor OS Core Systems</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="data-label">OPERATOR_ID / AUTHORIZATION_KEY</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <KeyRound size={16} />
              </div>
              <input 
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full bg-carbon-800/50 border border-glass-border rounded-xl py-4 pl-12 pr-4 text-white font-mono tracking-widest focus:outline-none focus:border-neon-cyan/50 focus:bg-neon-cyan/5 transition-all"
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isAuthenticating}
            className={`cyber-button w-full mt-4 flex items-center justify-center gap-3 ${isAuthenticating ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isAuthenticating ? (
              <>
                <Terminal size={18} className="animate-pulse" />
                VERIFYING_CREDENTIALS...
              </>
            ) : (
              <>
                <ShieldAlert size={18} />
                INITIATE_HANDSHAKE
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-glass-border text-center">
          <p className="text-[8px] font-black tracking-[0.3em] text-neon-danger uppercase">
            WARNING: UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
