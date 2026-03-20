import React, { useState, useEffect } from "react";
import { Bell, PlusSquare, Menu, X, Search, Heart, MessageSquare, UserPlus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CreatePostModal from "../post/CreatePostModal";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const mockNotifications = [
    { id: 1, type: "like", user: "PixelDust", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PixelDust", action: "liked your post", time: "2m ago", read: false },
    { id: 2, type: "comment", user: "NeonRider", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NeonRider", action: "commented: 'Nice run!'", time: "1h ago", read: false },
    { id: 3, type: "follow", user: "CyberPunk99", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cyber", action: "started following you", time: "2h ago", read: true },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Generate random digital particles instead of bubbles for a gaming feel
  const [particles] = useState(() => 
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2, // Tiny specs 2px to 6px
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 3 + 2, // Fast moving 2s to 5s
      delay: Math.random() * 5,
    }))
  );

  const navLinks = [
    { name: "Feed", to: "/feed" },
    { name: "Explore", to: "/explore" },
    { name: "Messages", to: "/messages" },
    { name: "Saved", to: "/saved" },
    { name: "Profile", to: "/profile" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 overflow-hidden ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-xl border-b border-cyan-900/50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-slate-900/90 backdrop-blur-md border-b border-slate-800"
      }`}
    >
      {/* Background Bubble Effect */}
      <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden opacity-40">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: 80, x: 0, opacity: 0 }}
            animate={{ 
              y: -80, 
              opacity: [0, 1, 0] 
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear"
            }}
            className="absolute rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
            style={{
              width: p.size,
              height: p.size,
              left: p.left,
              bottom: -20
            }}
          />
        ))}
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          
          {/* Left: Logo */}
          <div className="flex items-center w-1/4 sm:w-1/3">
            <NavLink
              to="/"
              className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent tracking-tight hover:opacity-100 transition-opacity drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]"
            >
              SocialNest
            </NavLink>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex justify-center w-2/4 sm:w-1/3">
            <div className="flex items-center bg-slate-800/60 hover:bg-slate-800 focus-within:bg-slate-900 backdrop-blur-md rounded-full px-4 py-2 border border-slate-700 shadow-sm transition-all duration-300 w-full max-w-sm focus-within:ring-2 focus-within:ring-cyan-500/50 focus-within:border-cyan-400 group focus-within:shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Search size={18} className="text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              <input
                placeholder="Search players, clans..."
                className="bg-transparent ml-2 text-sm outline-none w-full text-slate-100 placeholder-slate-500 font-medium"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-2 sm:gap-4 w-3/4 sm:w-1/3">
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wide border border-white/10"
            >
              <PlusSquare size={18} />
              Create
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 sm:p-2.5 rounded-full text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors relative"
              >
                <Bell size={22} className="sm:w-5 sm:h-5" />
                <span className="absolute top-1.5 right-2 sm:top-2 sm:right-2.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-slate-900 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse"></span>
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-[-60px] sm:right-0 mt-3 w-[320px] sm:w-[380px] bg-slate-900/95 backdrop-blur-xl border border-cyan-900/50 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 ring-1 ring-white/5"
                  >
                    <div className="p-4 border-b border-slate-800/60 flex justify-between items-center bg-slate-900/50">
                      <h3 className="text-white font-bold tracking-wide">Notifications</h3>
                      <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Mark all as read</button>
                    </div>
                    <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                      {mockNotifications.map((notif) => (
                        <div key={notif.id} className={`p-4 border-b border-slate-800/30 hover:bg-slate-800/50 transition-colors flex gap-3 cursor-pointer group ${!notif.read ? 'bg-cyan-950/20' : ''}`}>
                          <div className="relative">
                            <img src={notif.avatar} alt={notif.user} className="w-10 h-10 rounded-full border border-slate-700/50 group-hover:border-cyan-500/50 transition-colors" />
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 ${
                              notif.type === 'like' ? 'bg-rose-500' :
                              notif.type === 'comment' ? 'bg-cyan-500' :
                              'bg-purple-500'
                            }`}>
                              {notif.type === 'like' && <Heart size={10} className="text-white fill-white" />}
                              {notif.type === 'comment' && <MessageSquare size={10} className="text-white fill-white" />}
                              {notif.type === 'follow' && <UserPlus size={10} className="text-white" />}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-300 line-clamp-2">
                              <span className="font-bold text-white mr-1">{notif.user}</span>
                              {notif.action}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 font-medium">{notif.time}</p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="p-3 text-center border-t border-slate-800/60 bg-slate-900/50 hover:bg-slate-800/80 transition-colors cursor-pointer">
                      <span className="text-sm text-cyan-400 font-medium">View All Alerts</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink to="/profile" className="ml-1 transition-transform hover:scale-105 active:scale-95 group">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Avatar"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-slate-800 shadow-sm ring-2 ring-transparent group-hover:ring-purple-500 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all"
              />
            </NavLink>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-cyan-400 transition-colors ml-1"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white p-4 space-y-2">
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-indigo-100 text-indigo-600 font-semibold"
                    : "hover:bg-indigo-50"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </header>
  );
}
