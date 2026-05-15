import React from 'react';
import { Bookmark, FolderOpen } from 'lucide-react';
import PostCard from '../components/post/PostCard';
import { useSavedPosts } from '../hooks/useSavedPosts';
import { motion } from 'framer-motion';

export default function Saved() {
  const { savedPosts, loading } = useSavedPosts();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-white text-slate-800 -m-6 lg:-m-10 p-6 lg:p-10 relative overflow-hidden">
      {/* Background Cyber Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-10 pointer-events-none mix-blend-overlay z-0"></div>

      <div className="max-w-3xl mx-auto pb-20 relative z-10 animate-in fade-in duration-500">
        
        {/* Header Section */}
        <div className="mb-8 pt-4">
          <h1 className="text-3xl md:text-5xl font-black text-cyan-700 tracking-tight flex items-center gap-3 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <Bookmark className="w-8 h-8 md:w-10 md:h-10 text-emerald-500" />
            Saved 
            <span className="text-sm px-2 py-0.5 mt-2 rounded-md bg-amber-500/20 text-shadow-emerald-500 border border-amber-500/30 uppercase font-mono tracking-widest shadow-[0_0_8px_rgba(251,191,36,0.3)]">Archive</span>
          </h1>
          <p className="text-emerald-500 text-sm md:text-base mt-2 font-medium">Your personal vault of encrypted transmissions.</p>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="py-8 flex justify-center items-center">
            <div className="flex space-x-3">
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-ping shadow-[0_0_10px_rgba(251,191,36,0.8)] [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping shadow-[0_0_10px_rgba(245,158,11,0.8)] [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-amber-600 rounded-full animate-ping shadow-[0_0_10px_rgba(217,119,6,0.8)]"></div>
            </div>
          </div>
        ) : savedPosts.length === 0 ? (
           <div className="text-center mt-20 px-4">
            <div className="w-24 h-24 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(251,191,36,0.05)]">
              <FolderOpen className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">Vault Empty</h2>
            <p className="text-slate-400 max-w-sm mx-auto">You haven't archived any transmissions yet. Start exploring the grid to find content to save.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedPosts.map((post, index) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
