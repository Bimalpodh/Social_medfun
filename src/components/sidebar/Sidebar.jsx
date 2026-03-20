import React from "react";
import { Home, Compass, MessageCircle, Bookmark, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const SidebarItem = ({ icon: Icon, label, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
       ${
         isActive
           ? "text-cyan-400 font-bold bg-slate-800/80 shadow-[inset_4px_0_0_rgba(34,211,238,1)]"
           : "text-slate-400 hover:bg-slate-800/40 hover:text-cyan-300"
       }`
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none"></div>
        )}
        <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'group-hover:scale-110 group-hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]'}`} />
        <span className="text-md tracking-wide">{label}</span>
      </>
    )}
  </NavLink>
);

export default function Sidebar() {
  const menuItems = [
    { icon: Home, label: "Feed", to: "/feed" },
    { icon: Compass, label: "Explore", to: "/explore" },
    { icon: MessageCircle, label: "Messages", to: "/message" },
    { icon: Bookmark, label: "Saved", to: "/saved" },
    { icon: User, label: "Profile", to: "/profile" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64
                     h-[calc(100vh-64px)] sticky top-16 z-30
                     border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
      <div className="flex-1 p-4 space-y-2 mt-2">
        {menuItems.map(item => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </div>

      {/* User Shortcut */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/30 font-sans">
        <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-800 cursor-pointer transition-colors border border-transparent hover:border-slate-700/50 group">
          <div className="relative">
             <div className="absolute inset-0 bg-cyan-400 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
             <img 
               src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
               alt="User avatar" 
               className="relative w-11 h-11 rounded-full border-2 border-slate-900 shadow-lg object-cover bg-slate-800"
             />
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-bold text-slate-100 truncate group-hover:text-cyan-400 transition-colors">
              Player One
            </p>
            <p className="text-xs text-cyan-500/80 truncate font-mono tracking-wider">
              @player1_x
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
