import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-deep-space relative overflow-hidden">
      {/* Background HUD Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-neon-cyan/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-neon-cyan/10 rounded-full animate-[spin_60s_linear_infinite]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="hud-card p-10 backdrop-blur-3xl border-neon-cyan/30">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-neon-cyan/10 rounded-2xl border border-neon-cyan/20 mb-6 neon-glow-cyan">
              <ShieldCheck size={40} className="text-neon-cyan" />
            </div>
            <h1 className="text-3xl font-black tracking-[0.2em] italic bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-text-heading)] to-neon-cyan/50">
              TRACTOR_SAFETY
            </h1>
            <p className="text-[10px] font-black tracking-[0.4em] text-[var(--color-text-dim)] uppercase mt-2">Secure Operator Uplink</p>
          </div>

          {message && (
            <div className="mb-6 p-3 bg-neon-emerald/10 border border-neon-emerald/30 rounded-lg text-neon-emerald text-[10px] font-black tracking-widest text-center uppercase">
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="data-label ml-1">USER_IDENTIFIER</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-cyan/50 group-focus-within:text-neon-cyan transition-colors" size={18} />
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-carbon-800/50 border border-glass-border rounded-xl py-4 pl-12 pr-4 text-[var(--color-text-main)] font-mono focus:outline-none focus:border-neon-cyan/50 focus:bg-neon-cyan/5 transition-all"
                  placeholder="USERNAME"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="data-label ml-1">ENCRYPTION_KEY</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neon-cyan/50 group-focus-within:text-neon-cyan transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-carbon-800/50 border border-glass-border rounded-xl py-4 pl-12 pr-4 text-[var(--color-text-main)] font-mono focus:outline-none focus:border-neon-cyan/50 focus:bg-neon-cyan/5 transition-all"
                  placeholder="PASSWORD"
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-neon-danger text-[10px] font-black tracking-widest uppercase bg-neon-danger/10 p-3 rounded-lg border border-neon-danger/20 text-center">
                ACCESS_DENIED: {error}
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="cyber-button w-full flex items-center justify-center gap-4 py-4 group"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              <span className="text-sm">{loading ? 'VERIFYING...' : 'INITIALIZE_SESSION'}</span>
            </button>
          </form>

          <div className="mt-8 text-center border-t border-glass-border pt-6">
            <p className="text-[10px] font-black tracking-widest text-[var(--color-text-dim)] uppercase">
              Need access? <Link to="/signup" className="text-neon-cyan hover:underline ml-2">REGISTER_OPERATOR</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
