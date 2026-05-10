import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { ShieldAlert, Lock, Mail, User, Zap } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    
    try {
      setError('');
      setLoading(true);
      await register(email, password, name);
      navigate('/feed');
    } catch (err) {
      setError('Failed to establish identity: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-8 sm:p-10 rounded-3xl w-full max-w-md relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Animated Cyberpunk Logo Assembly */}
        <div className="flex flex-col items-center justify-center mb-6 relative">
          <div className="relative flex items-center justify-center">
            {/* Spinning Outer Rings */}
            <div className="absolute w-20 h-20 rounded-full border-t-2 border-r-2 border-purple-500 animate-[spin_3s_linear_infinite] shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
            <div className="absolute w-16 h-16 rounded-full border-b-2 border-l-2 border-rose-500 animate-[spin_2s_linear_infinite_reverse] shadow-[0_0_15px_rgba(244,63,94,0.5)]"></div>
            
            {/* Core Icon */}
            <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center relative z-10 border border-slate-700 shadow-[inset_0_0_15px_rgba(168,85,247,0.3)]">
              <Zap className="w-7 h-7 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            </div>
          </div>
          
          {/* Brand Name */}
          <h1 className="text-4xl font-black mt-6 tracking-tighter bg-gradient-to-br from-purple-400 via-purple-600 to-rose-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            SOCIAL<span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">NEST</span>
          </h1>
          <div className="h-0.5 w-12 bg-purple-500 mt-4 shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
        </div>
        
        <h2 className="text-2xl font-black text-white text-center tracking-tight mb-2 uppercase drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">Forge Your Avatar</h2>
        <p className="text-purple-400/80 text-center text-sm font-medium mb-6 uppercase tracking-widest">Synthesize your identity and enter the leaderboard.</p>
        
        {error && <div className="bg-rose-500/10 border border-rose-500 text-rose-500 p-3 rounded-lg text-sm mb-6 font-medium text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
              placeholder="Display Name"
            />
          </div>
          
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
              placeholder="Email Address"
            />
          </div>
          
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
              placeholder="Password"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium"
              placeholder="Confirm Password"
            />
          </div>
          
          <button 
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-400 text-white font-black tracking-widest uppercase py-3 rounded-xl transition-all mt-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Compiling DNA...' : 'Initialize Player'}
          </button>
        </form>
        
        <p className="text-center text-slate-400 mt-8 text-sm font-medium">
          Already in the database? <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold ml-1 hover:underline uppercase tracking-wide">Jack In</Link>
        </p>
      </div>
    </div>
  );
}
