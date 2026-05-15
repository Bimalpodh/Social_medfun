import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Target, Lock, Mail, Cpu } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/feed');
    } catch (err) {
      setError('Failed to securely link: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0  opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute top-1/2 left-1/2  w-[800px] h-[800px]  rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className=" bg-cyan-800 backdrop-blur-xl border border-slate-700 p-8 sm:p-10 rounded-3xl w-full max-w-md relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Animated Cyberpunk Logo Assembly */}
        <div className="flex flex-col items-center justify-center mb-8 relative">
          <div className="relative flex items-center justify-center">
            {/* Spinning Outer Rings */}
            <div className="absolute w-20 h-20 rounded-full border-t-2 border-r-2 border-cyan-500 animate-[spin_3s_linear_infinite] shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
            <div className="absolute w-16 h-16 rounded-full border-b-2 border-l-2 border-purple-500 animate-[spin_2s_linear_infinite_reverse] shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
            
            {/* Core Icon */}
            <div className="w-14 h-14 rounded-full flex items-center justify-center relative z-10  shadow-[inset_0_0_15px_rgba(34,211,238,0.3)]">
             <img src="./Social-Nest-Logo.png" className='rounded-full' alt="logo" />
            </div>
          </div>
          
          {/* Brand Name */}
          <h1 className="text-4xl font-black mt-6 tracking-tighter bg-gradient-to-br from-cyan-300 via-cyan-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
            SOCIAL<span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">NEST</span>
          </h1>
          <div className="h-0.5 w-12 bg-cyan-500 mt-4 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
        </div>
        
        <h2 className="text-2xl font-black text-white text-center tracking-tight mb-2 uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Jack Into The Grid</h2>
        <p className="text-cyan-500/80 text-center text-sm font-medium mb-8 uppercase tracking-widest">Enter your coordinates. The neon realm awaits.</p>
        
        {error && <div className="bg-rose-500/10 border border-rose-500 text-rose-500 p-3 rounded-lg text-sm mb-6 font-medium text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
              placeholder="Email Address"
            />
          </div>
          
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium"
              placeholder="Password"
            />
          </div>
          
          <button 
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black tracking-widest uppercase py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Bypassing Security...' : 'Enter Arena'}
          </button>
        </form>
        
        <p className="text-center text-slate-400 mt-8 text-sm font-medium">
          No player profile yet? <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-bold ml-1 hover:underline uppercase tracking-wide">Spawn Here</Link>
        </p>
      </div>
    </div>
  );
}
