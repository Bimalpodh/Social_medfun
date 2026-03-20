import React, { useState } from 'react';
import { Grid, Bookmark, Tag, Heart, MessageSquare, Settings, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

const userProfile = {
  name: "NeonRider",
  username: "neon_rider99",
  bio: "Level 99 Cyber-Ninja | Streaming nightly at 8PM EST | Always chasing the next high score.",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NeonRider",
  coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
  stats: {
    posts: 42,
    followers: "12.5K",
    following: 420
  }
};

const mockPosts = [
  { id: 1, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=500&auto=format&fit=crop", likes: 120, comments: 45 },
  { id: 2, image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=500&auto=format&fit=crop", likes: 340, comments: 12 },
  { id: 3, image: "https://images.unsplash.com/photo-1493711662062-fa541abbe5de?q=80&w=500&auto=format&fit=crop", likes: 530, comments: 89 },
  { id: 4, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=500&auto=format&fit=crop", likes: 89, comments: 4 },
  { id: 5, image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=500&auto=format&fit=crop", likes: 451, comments: 22 },
  { id: 6, image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=500&auto=format&fit=crop", likes: 902, comments: 115 },
];

const TABS = [
  { id: 'posts', label: 'Quests', icon: Grid },
  { id: 'saved', label: 'Saved', icon: Bookmark },
  { id: 'tagged', label: 'Tagged', icon: Tag },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="-m-6 lg:-m-10 min-h-[calc(100vh-64px)] bg-slate-950 text-slate-200">
      <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
        {/* Cover Image */}
      <div className="h-48 md:h-72 w-full relative rounded-b-3xl overflow-hidden group">
        <img src={userProfile.coverImage} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
        {/* Animated Cyberpunk Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      {/* Profile Info Section */}
      <div className="px-4 sm:px-8 relative -mt-16 sm:-mt-24">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
          {/* Avatar (with glow and ring) */}
          <div className="relative group self-center sm:self-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-rose-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
            <img 
              src={userProfile.avatar} 
              alt="Avatar" 
              className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-slate-950 bg-slate-900 object-cover"
            />
            {/* Status Indicator */}
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-950 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
          </div>

          {/* Action Buttons (Desktop) */}
          <div className="hidden sm:flex flex-1 justify-end gap-3 mb-4">
            <button className="px-6 py-2 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white font-medium hover:bg-slate-700 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all flex items-center gap-2">
              <Edit3 size={16} />
              Edit Profile
            </button>
            <button className="p-2 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white hover:bg-slate-700 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* User Details */}
        <div className="mt-4 sm:mt-6 space-y-4 text-center sm:text-left">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center sm:justify-start gap-3">
              {userProfile.name}
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase font-mono tracking-wider shadow-[0_0_8px_rgba(34,211,238,0.2)]">Lvl 99</span>
            </h1>
            <p className="text-cyan-400 font-medium text-lg mt-1">@{userProfile.username}</p>
          </div>

          <p className="text-slate-300 max-w-2xl leading-relaxed mx-auto sm:mx-0 text-sm sm:text-base">
            {userProfile.bio}
          </p>

          {/* Stats */}
          <div className="flex gap-8 justify-center sm:justify-start pt-2">
             <div className="flex flex-col items-center sm:items-start group">
               <span className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">{userProfile.stats.posts}</span>
               <span className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-semibold">Quests</span>
             </div>
             <div className="flex flex-col items-center sm:items-start group">
               <span className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">{userProfile.stats.followers}</span>
               <span className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-semibold">Allies</span>
             </div>
             <div className="flex flex-col items-center sm:items-start group">
               <span className="text-xl sm:text-2xl font-bold text-white group-hover:text-rose-400 transition-colors">{userProfile.stats.following}</span>
               <span className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-semibold">Following</span>
             </div>
          </div>

          {/* Action Buttons (Mobile) */}
          <div className="sm:hidden flex gap-3 pt-4">
            <button className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white font-medium hover:bg-slate-700 hover:border-cyan-500 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all flex justify-center items-center gap-2">
              <Edit3 size={16} />
              Edit Profile
            </button>
            <button className="px-4 py-2.5 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white hover:bg-slate-700 hover:border-cyan-500 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 border-t border-slate-800/60 bg-slate-900/30 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex justify-center gap-6 sm:gap-16">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 relative font-semibold transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon size={18} className={isActive ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : ''} />
                <span className="hidden sm:block uppercase tracking-widest text-sm">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeProfileTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_-2px_15px_rgba(34,211,238,0.6)]"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-3 gap-1 sm:gap-4 mt-4 px-1 sm:px-4">
        {mockPosts.map((post, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            key={post.id} 
            className="relative aspect-square group overflow-hidden bg-slate-800 rounded-sm sm:rounded-2xl cursor-pointer border border-transparent hover:border-cyan-500/50 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            <img 
              src={post.image} 
              alt="Post thumbnail" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 backdrop-blur-[2px]">
              <div className="flex items-center gap-1 sm:gap-2 text-white font-bold drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                <span className="text-sm sm:text-lg">{post.likes}</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-white font-bold drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 fill-cyan-500 text-cyan-500 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                <span className="text-sm sm:text-lg">{post.comments}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </div>
  );
}
