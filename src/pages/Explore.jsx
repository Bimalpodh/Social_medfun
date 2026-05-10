import React from "react";
import { MessageSquare, Heart, Search, TrendingUp, Flame, Gamepad2, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useExplorePosts } from "../hooks/useExplorePosts";

/**
 * Explore page (Gaming / Cyberpunk Edition)
 * - Renders a masonry-style grid of trending posts
 * - Implements category filters and immersive hover states
 */

const CATEGORIES = [
  { id: 'all', name: 'All Transmissions', icon: Search },
  { id: 'trending', name: 'Trending', icon: TrendingUp },
  { id: 'clips', name: 'Clips', icon: Play },
  { id: 'esports', name: 'E-Sports', icon: Gamepad2 },
  { id: 'hot', name: 'Hot', icon: Flame },
];

export default function Explore() {
  const { searchQuery, setSearchQuery, activeCategory, setActiveCategory, filteredPosts } = useExplorePosts();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-200 -m-6 lg:-m-10 p-6 lg:p-10 relative overflow-hidden">
      
      {/* Background Cyber Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-10 pointer-events-none mix-blend-overlay z-0"></div>

      <div className="max-w-6xl mx-auto pb-20 relative z-10 animate-in fade-in duration-500">
        
        {/* Header Section */}
        <div className="mb-8 pt-4">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            Explore 
            <span className="text-sm px-2 py-0.5 mt-2 rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase font-mono tracking-widest shadow-[0_0_8px_rgba(168,85,247,0.3)]">Network</span>
          </h1>
          <p className="text-cyan-400 text-sm md:text-base mt-2 font-medium">Discover trending content, new creators, and legendary drops across the net.</p>
        </div>

        {/* Search & Categories */}
        <div className="mb-8 space-y-6">
          <div className="max-w-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative flex items-center bg-slate-900/80 border border-slate-700 backdrop-blur-md rounded-full px-5 py-3 group-focus-within:border-cyan-500 group-focus-within:ring-1 group-focus-within:ring-cyan-500 transition-all">
              <Search className="w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors mr-3" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search records by caption or user..." 
                className="w-full bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none text-base"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex overflow-x-auto gap-3 pb-2 custom-scrollbar">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all whitespace-nowrap flex-shrink-0 ${
                    isActive 
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(34,211,238,0.5)] scale-105' 
                      : 'bg-slate-900/50 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800 hover:border-slate-600 hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : ''}`} />
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Masonry Layout using CSS Columns */}
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500 text-center">
            <Search className="w-12 h-12 text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No transmissions found</h3>
            <p className="text-slate-500">Adjust your search parameters or select a different category.</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filteredPosts.map((post, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: (index % 10) * 0.05 }}
                key={post.id} 
                className="group relative rounded-2xl overflow-hidden cursor-pointer break-inside-avoid bg-slate-900 border border-transparent hover:border-cyan-500/50 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
              >
                {/* Image with zoom effect on hover */}
                <img 
                  src={post.image} 
                  alt={post.caption} 
                  loading="lazy"
                  className={`w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1 ${post.aspect}`}
                />
                
                {/* Dark overlay with stats that fades in on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6 backdrop-blur-[1px]">
                  
                  <h3 className="text-white font-bold text-lg leading-tight mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-md">
                    {post.caption}
                  </h3>
                  <p className="text-cyan-400 text-xs mb-3 font-mono transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    @{post.user}
                  </p>
                  
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center text-white font-bold gap-1.5 drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                      <Heart className="w-5 h-5 fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center text-white font-bold gap-1.5 drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                      <MessageSquare className="w-5 h-5 fill-cyan-500 text-cyan-500 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
  
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
