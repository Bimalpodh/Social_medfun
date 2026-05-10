import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Moon, 
  Sun,
  Shield,
  CreditCard,
  UserCircle
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Skeleton } from "../Utils/Skeleton";

/**
 * ProfileDropdown Component
 * A premium, glassmorphism-styled profile menu for the header.
 */
export default function ProfileDropdown() {
  const { currentUser, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Assuming dark mode by default for gaming aesthetic
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Escape") setIsOpen(false);
    if (e.key === "Enter" && !isOpen) setIsOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get user initials for fallback
  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 px-2 py-1">
        <Skeleton width="40px" height="40px" rounded="rounded-full" />
        <div className="hidden sm:block space-y-1">
          <Skeleton width="80px" height="12px" />
          <Skeleton width="60px" height="8px" />
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-800/50 transition-all duration-300 group outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="relative">
          {currentUser.profileImage ? (
            <img
              src={currentUser.profileImage}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-800 group-hover:border-cyan-500 transition-colors shadow-lg"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold border-2 border-slate-800 group-hover:border-cyan-500 transition-colors shadow-lg">
              {getInitials(currentUser.name || currentUser.username)}
            </div>
          )}
          {/* Online Indicator */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
        </div>
        
        <div className="hidden lg:flex flex-col items-start mr-1">
          <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors leading-none">
            {currentUser.name}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            @{currentUser.username}
          </span>
        </div>
        
        <ChevronDown 
          size={16} 
          className={`text-slate-400 group-hover:text-cyan-400 transition-transform duration-300 hidden sm:block ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-64 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100] ring-1 ring-white/5"
          >
            {/* User Header Info */}
            <div className="p-4 bg-gradient-to-br from-slate-800/50 to-transparent border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 overflow-hidden">
                   {currentUser.profileImage ? (
                    <img src={currentUser.profileImage} alt="" className="w-full h-full object-cover" />
                   ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-lg font-bold text-cyan-400">
                      {getInitials(currentUser.name)}
                    </div>
                   )}
                </div>
                <div className="overflow-hidden">
                  <p className="text-white font-bold truncate">{currentUser.name}</p>
                  <p className="text-xs text-slate-400 truncate">@{currentUser.username}</p>
                </div>
              </div>
              
              {/* Badge/Level - Adding extra flair */}
              <div className="mt-3 flex items-center gap-2 px-2 py-1 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <Shield size={12} className="text-cyan-400" />
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Pro Player</span>
                <span className="ml-auto text-[10px] text-slate-500">LVL 42</span>
              </div>
            </div>

            {/* Menu Links */}
            <div className="p-2">
              <MenuLink to="/profile" icon={<UserCircle size={18} />} label="My Profile" onClick={() => setIsOpen(false)} />
              <MenuLink to="/settings" icon={<Settings size={18} />} label="Account Settings" onClick={() => setIsOpen(false)} />
              <MenuLink to="/wallet" icon={<CreditCard size={18} />} label="Billing & Wallet" onClick={() => setIsOpen(false)} />
              
              <div className="my-2 border-t border-white/5"></div>
              
              {/* Dark Mode Toggle (Visual Only for now) */}
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                  <span className="text-sm font-medium">Dark Mode</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${isDarkMode ? "bg-cyan-500" : "bg-slate-700"}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isDarkMode ? "left-4.5" : "left-0.5"}`}></div>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all font-medium"
              >
                <LogOut size={18} />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
            
            {/* Footer Tip */}
            <div className="p-3 bg-slate-950/50 text-[10px] text-center text-slate-500 font-medium">
              SocialMedFun v1.2.4 • Production Ready
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group
        ${isActive 
          ? "bg-cyan-500/10 text-cyan-400 font-bold" 
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }
      `}
    >
      <span className={`${to === '/profile' ? 'text-purple-400' : 'text-slate-400'} group-hover:text-cyan-400 transition-colors`}>
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}
