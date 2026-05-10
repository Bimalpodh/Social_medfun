import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";
import { getAvatarFallback } from "../../services/userService";
import { useFollow } from "../../hooks/useFollow";

const SearchResultRow = ({ user, onClick }) => {
  const { isFollowing, handleFollowToggle, loading } = useFollow(user.uid);
  
  return (
    <div 
      onClick={() => onClick(user.uid)}
      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-800/60 cursor-pointer transition-all duration-200 group border border-transparent hover:border-slate-700/50 hover:shadow-lg hover:shadow-cyan-900/10"
    >
      <img 
        src={user.profileImage || user.avatar || getAvatarFallback(user.username || user.uid)} 
        alt="avatar" 
        className="w-12 h-12 rounded-full border-2 border-slate-800 group-hover:border-slate-700 object-cover bg-slate-900 transition-colors"
      />
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-bold text-slate-200 truncate group-hover:text-cyan-400 transition-colors">{user.name}</p>
        <p className="text-xs text-slate-500 truncate mt-0.5">@{user.username}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); handleFollowToggle(); }}
        disabled={loading}
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
          isFollowing 
            ? "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700" 
            : "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
        }`}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
};

export default function SearchModal({ isOpen, onClose }) {
  const { searchTerm, setSearchTerm, results, loading, error, clearSearch } = useSearch(300);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleResultClick = (uid) => {
    navigate(`/profile/${uid}`);
    onClose(); // close modal after navigation
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed left-0 md:left-64 top-0 h-full w-full md:w-96 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/80 z-50 shadow-2xl flex flex-col animate-in slide-in-from-left-4 duration-300">
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Search</h2>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-full hover:bg-slate-800/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 rounded-xl py-3 pl-11 pr-10 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-slate-600"
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {loading && (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
              <p className="text-sm font-medium text-slate-400">Searching...</p>
            </div>
          )}

          {!loading && error && (
            <div className="text-center p-6 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400 text-sm">
              {error}
            </div>
          )}

          {!loading && !error && searchTerm && results.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-slate-700" />
              <p className="font-medium text-slate-400">No users found</p>
              <p className="text-sm mt-1">Try searching for a different username.</p>
            </div>
          )}

          {!loading && !error && !searchTerm && (
            <div className="text-center py-12 text-slate-600">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-10" />
              <p className="font-medium text-slate-500">Start typing to search</p>
              <p className="text-sm opacity-50 mt-1">Find friends and creators.</p>
            </div>
          )}

          {!loading && !error && results.length > 0 && (
            <div className="space-y-2">
              {results.map((user) => (
                <SearchResultRow 
                  key={user.uid}
                  user={user}
                  onClick={handleResultClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
