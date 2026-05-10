import React, { useState, useEffect } from "react";
import { Bell, PlusSquare, Menu, X, Search, Heart, MessageSquare, UserPlus, Camera } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CreatePostModal from "../post/CreatePostModal";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useSearch } from "../../hooks/useSearch";
import { useNotifications } from "../../hooks/useNotifications";
import { useDispatch } from "react-redux";
import { setStoryCreateModal } from "../../store/slices/uiSlice";
import ProfileDropdown from "./ProfileDropdown";
import { getAvatarFallback } from "../../services/userService";

export default function Header() {
  const { currentUser, logout } = useAuth();
  const { searchTerm, setSearchTerm, results, loading, clearSearch } = useSearch(300);
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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
          <div className="hidden md:flex justify-center w-2/4 sm:w-1/3 relative z-50">
            <div className="flex items-center bg-slate-800/60 hover:bg-slate-800 focus-within:bg-slate-900 backdrop-blur-md rounded-full px-4 py-2 border border-slate-700 shadow-sm transition-all duration-300 w-full max-w-sm focus-within:ring-2 focus-within:ring-cyan-500/50 focus-within:border-cyan-400 group focus-within:shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Search size={18} className="text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              <input
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent ml-2 text-sm outline-none w-full text-slate-100 placeholder-slate-500 font-medium"
              />
              {loading && <div className="ml-2 w-3 h-3 border-2 border-t-cyan-400 rounded-full animate-spin border-slate-600"></div>}
            </div>

            {/* Dropdown Results */}
            <AnimatePresence>
              {searchTerm && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-14 w-full max-w-sm bg-slate-900/95 backdrop-blur-xl border border-cyan-900/50 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-[100] ring-1 ring-white/5"
                >
                  <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                    {results.length > 0 ? (
                      results.map(user => (
                        <div 
                          key={user.uid || user.id} 
                          onClick={() => {
                            clearSearch();
                            // Right now routes to profile, but eventually /profile/:id
                            navigate(`/profile`); 
                          }}
                          className="p-3 border-b border-slate-800/30 hover:bg-slate-800/50 transition-colors flex items-center gap-3 cursor-pointer group"
                        >
                          <img 
                            src={user.profileImage || user.avatar || getAvatarFallback(user.username || user.uid)} 
                            alt={user.username} 
                            className="w-10 h-10 rounded-full border border-slate-700/50 group-hover:border-cyan-500/50 transition-colors object-cover" 
                          />
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{user.username}</p>
                            <p className="text-xs text-slate-400">{user.name}</p>
                          </div>
                        </div>
                      ))
                    ) : !loading && (
                      <div className="p-4 text-center text-slate-500 text-sm">No players found</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

           {/* Right: Actions */}
           <div className="flex items-center justify-end gap-2 sm:gap-4 w-3/4 sm:w-1/3">
            <button 
              onClick={() => dispatch(setStoryCreateModal(true))}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-slate-800 text-cyan-400 text-xs sm:text-sm font-bold border border-cyan-500/30 hover:bg-slate-700 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all uppercase tracking-wider group"
              title="Broadcast Signal"
            >
              <Camera size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="hidden lg:inline">Broadcast</span>
            </button>

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
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-2 sm:top-2 sm:right-2.5 w-2.5 h-2.5 rounded-full bg-cyan-400 border-2 border-slate-900 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse"></span>
                )}
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
                      {notifications.length > 0 ? notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 border-b border-slate-800/30 hover:bg-slate-800/50 transition-colors flex gap-3 cursor-pointer group ${!notif.read ? 'bg-cyan-950/20' : ''}`}>
                          <div className="relative">
                            <img src={notif.avatar || "https://i.pravatar.cc/150"} alt={notif.user} className="w-10 h-10 rounded-full border border-slate-700/50 group-hover:border-cyan-500/50 transition-colors object-cover" />
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
                            <p className="text-xs text-slate-500 mt-1 font-medium">{notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString() : 'Just now'}</p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                          )}
                        </div>
                      )) : (
                        <div className="p-6 text-center text-slate-500 text-sm">No new notifications</div>
                      )}
                    </div>
                    <div className="p-3 text-center border-t border-slate-800/60 bg-slate-900/50 hover:bg-slate-800/80 transition-colors cursor-pointer">
                      <span className="text-sm text-cyan-400 font-medium">View All Alerts</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Redesigned Profile Section */}
            <div className="flex items-center">
              <ProfileDropdown />
            </div>

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
        <div className="md:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl p-4 space-y-2 shadow-xl absolute w-full top-16 left-0">
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-cyan-400 font-bold bg-slate-800/80 shadow-[inset_4px_0_0_rgba(34,211,238,1)]"
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-cyan-300"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              logout();
              navigate('/login');
            }}
            className="w-full text-left px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 font-medium transition-all duration-200 flex items-center gap-2"
          >
            Logout
          </button>
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
