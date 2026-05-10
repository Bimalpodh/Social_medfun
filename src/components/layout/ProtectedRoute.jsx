import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import Layout from './Layout';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-10 pointer-events-none mix-blend-overlay z-0"></div>
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
        <p className="text-cyan-500 mt-4 font-mono uppercase tracking-widest text-sm relative z-10 animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">Authenticating...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Wraps children directly in the Layout component 
  // ensuring the sidebar only appears exactly when someone is logged in!
  return <Layout>{children}</Layout>;
}
