import React from "react";
import { createPortal } from "react-dom";
import { X, UserPlus, UserCheck, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useFollowList } from "../../hooks/useFollowList";
import { getAvatarFallback } from "../../services/userService";
import { useFollow } from "../../hooks/useFollow";

/**
 * Individual User Row in the Follow List
 */
const UserRow = ({ user, onClose }) => {
  const navigate = useNavigate();
  const { isFollowing, handleFollowToggle, loading } = useFollow(user.uid);

  const handleClick = () => {
    navigate(`/profile/${user.uid}`);
    onClose();
  };

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-2xl hover:bg-slate-800/50 transition-all group">
      <div className="flex items-center gap-3 cursor-pointer min-w-0" onClick={handleClick}>
        <img 
          src={user.profileImage || user.avatar || getAvatarFallback(user.username || user.uid)}
          alt={user.username}
          className="w-10 h-10 rounded-full object-cover border border-slate-700 group-hover:border-cyan-500/50 transition-colors"
        />
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-100 truncate group-hover:text-cyan-400 transition-colors">{user.name || "Player"}</p>
          <p className="text-xs text-slate-500 truncate">@{user.username || "player"}</p>
        </div>
      </div>
      
      <button
        onClick={(e) => { e.stopPropagation(); handleFollowToggle(); }}
        disabled={loading}
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
          isFollowing 
            ? "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700" 
            : "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]"
        }`}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
};

export default function FollowListModal({ isOpen, onClose, title, uids = [] }) {
  const { users, loading, error } = useFollowList(uids);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredUsers = React.useMemo(() => {
    if (!searchTerm.trim()) return users;
    return users.filter(u => 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-slate-900 w-full max-w-md rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          {/* Search bar inside Modal */}
          <div className="p-4 border-b border-slate-800/50">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search in list..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-all"
              />
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Syncing Profiles...</p>
              </div>
            ) : error ? (
              <div className="p-10 text-center text-rose-500 text-sm font-medium">{error}</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-20 text-center">
                <p className="text-slate-500 text-sm italic">{searchTerm ? "No matches found." : "No signals yet."}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredUsers.map(user => (
                  <UserRow key={user.uid} user={user} onClose={onClose} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
