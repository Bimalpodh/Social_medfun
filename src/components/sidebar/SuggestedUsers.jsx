import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuggestions } from '../../hooks/useSuggestions';
import { useFollow } from '../../hooks/useFollow';

const SuggestionItem = ({ user, onFollowComplete }) => {
  const navigate = useNavigate();
  const { isFollowing, isFollower, handleFollowToggle, loading } = useFollow(user.uid);

  const handleFollow = async (e) => {
    e.stopPropagation();
    await handleFollowToggle();
    // After following, visually remove them from suggestions list
    if (!isFollowing) {
     onFollowComplete(user.uid);
    }
  };

  return (
    <div 
      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors group"
      onClick={() => navigate(`/profile/${user.uid}`)}
    >
      <img 
        src={user.profileImage || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || 'Ghost'}`} 
        alt="avatar" 
        className="w-9 h-9 rounded-full border border-slate-700 object-cover bg-slate-800"
      />
      <div className="flex-1 overflow-hidden">
        <p className="text-[13px] font-bold text-slate-300 truncate group-hover:text-cyan-400">{user.name || "User"}</p>
        <p className="text-[11px] text-slate-500 truncate">@{user.username || "username"}</p>
      </div>
      <button 
        onClick={handleFollow}
        disabled={loading}
        className={`text-[11px] px-3 py-1.5 rounded-full font-bold transition-all ${
          isFollowing 
            ? "bg-slate-700 text-slate-300" 
            : isFollower
              ? "bg-purple-500 hover:bg-purple-400 text-white shadow-[0_0_8px_rgba(168,85,247,0.4)]"
              : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_8px_rgba(34,211,238,0.4)]"
        }`}
      >
        {isFollowing ? "Following" : isFollower ? "Follow Back" : "Follow"}
      </button>
    </div>
  );
};

export default function SuggestedUsers() {
  const { suggestions, loading, removeSuggestion } = useSuggestions();

  if (loading) return null;
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="px-4 py-2 mt-4 border-t border-slate-800/50 pt-4">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 pl-2">Suggestions</p>
      <div className="space-y-1">
        {suggestions.map(user => (
          <SuggestionItem 
            key={user.uid} 
            user={user} 
            onFollowComplete={removeSuggestion}
          />
        ))}
      </div>
    </div>
  );
}
