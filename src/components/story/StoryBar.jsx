import React, { useState } from "react";
import StoryViewer from "./StoryViewer";
import StoryCreateModal from "./StoryCreateModal";
import { Plus } from "lucide-react";

import { useStories } from "../../hooks/useStories";
import { useAuth } from "../../hooks/useAuth";
import { StorySkeleton } from "../Utils/Skeleton";

const getAvatar = (user) => {
  return user?.avatar || user?.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'Guest'}`;
};

export default function StoryBar() {
  const { currentUser } = useAuth();
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { stories, loading } = useStories();

  const openStory = (index) => {
    const storyUser = stories[index];
    if (storyUser.isCurrentUser && storyUser.items.length === 0) {
      setIsCreateModalOpen(true);
      return;
    }
    setActiveStoryIndex(index);
  };

  const isCompletelyEmpty = !loading && 
    stories.length === 1 && 
    stories[0].isCurrentUser && 
    stories[0].items.length === 0;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm mb-4 p-4 overflow-hidden border border-slate-100">
        {isCompletelyEmpty ? (
          <div 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex flex-col items-center justify-center py-6 cursor-pointer group hover:bg-slate-50/50 rounded-lg transition-all"
          >
            <div className="relative mb-3">
               {/* Pulsing Halo */}
               <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping scale-125" />
               <div className="relative p-1 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-full shadow-lg">
                 <div className="bg-white p-1 rounded-full">
                   <img 
                    src={getAvatar(currentUser)} 
                    onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=Fallback`; }}
                    className="w-16 h-16 rounded-full object-cover" 
                    alt="Current User"
                   />
                 </div>
                 <div className="absolute bottom-1 right-0 bg-cyan-500 text-white rounded-full border-2 border-white p-1 shadow-lg group-hover:scale-110 transition-transform">
                   <Plus size={14} strokeWidth={3} />
                 </div>
               </div>
            </div>
            <p className="text-sm font-bold text-slate-800 tracking-tight">Broadcast a Signal</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">No stories currently active</p>
          </div>
        ) : (
          <ul className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide touch-pan-x snap-x momentum-scroll">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((n) => (
                <StorySkeleton key={n} />
              ))
            ) : (
              stories.map((storyUser, index) => (
                <li 
                  key={storyUser.id} 
                  className="flex flex-col items-center space-y-2 flex-shrink-0 cursor-pointer w-20 group snap-start" 
                  onClick={() => openStory(index)}
                >
                  <div className="relative">
                    {/* Premium Gradient Ring */}
                    <div className={`p-[2.5px] rounded-full transition-all duration-300 group-hover:scale-105 group-active:scale-95 ${
                      storyUser.items?.length > 0 
                        ? 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] shadow-lg shadow-rose-500/10' 
                        : 'bg-slate-200'
                    }`}>
                      <div className="bg-white p-[2px] rounded-full">
                        <img
                          src={getAvatar(storyUser)}
                          onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${storyUser?.username || 'Guest'}`; }}
                          alt={storyUser.username}
                          className="w-14 h-14 rounded-full object-cover ring-1 ring-slate-100"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Add Icon for Current User (Step 3) */}
                    {storyUser.isCurrentUser && storyUser.items?.length === 0 && (
                      <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full border-[3px] border-white p-1 shadow-md group-hover:bg-blue-600 transition-colors">
                        <Plus size={12} strokeWidth={4} />
                      </div>
                    )}
                  </div>
                  <span className={`text-[11px] font-bold truncate w-full text-center px-1 transition-colors ${
                    storyUser.isCurrentUser ? 'text-blue-500' : 'text-slate-600 group-hover:text-slate-900'
                  }`}>
                    {storyUser.isCurrentUser ? "Your Story" : storyUser.username?.toLowerCase()}
                  </span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {activeStoryIndex !== null && (
        <StoryViewer 
          stories={stories} 
          initialUserIndex={activeStoryIndex} 
          onClose={() => setActiveStoryIndex(null)} 
        />
      )}

      <StoryCreateModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
