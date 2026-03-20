import React, { useState } from "react";
import StoryViewer from "./StoryViewer";
import { Plus } from "lucide-react";

const MOCK_STORIES = [
  {
    id: "user-1",
    username: "your_story",
    avatar: "https://i.pravatar.cc/150?u=current",
    isCurrentUser: true,
    hasUnseen: false, // For "Add Story" button logic wrapper
    items: [],
  },
  {
    id: "user-2",
    username: "ashav",
    avatar: "ram1.jpg",
    hasUnseen: true,
    items: [
      { id: "s1", url: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80&w=800", time: "2h" },
      { id: "s2", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800", time: "1h" }
    ]
  },
  {
    id: "user-3",
    username: "johndoe",
    avatar: "ram2.jpg",
    hasUnseen: true,
    items: [
      { id: "s3", url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800", time: "4h" }
    ]
  },
  {
    id: "user-4",
    username: "priya_s",
    avatar: "jaishreeram.jpg",
    hasUnseen: false,
    items: [
      { id: "s4", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800", time: "6h" }
    ]
  },
  {
    id: "user-5",
    username: "travel_bug",
    avatar: "https://i.pravatar.cc/150?u=travel",
    hasUnseen: true,
    items: [
      { id: "s5", url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800", time: "12h" }
    ]
  },
  {
    id: "user-6",
    username: "foodie21",
    avatar: "https://i.pravatar.cc/150?u=food",
    hasUnseen: true,
    items: [
      { id: "s6", url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800", time: "14h" }
    ]
  }
];

export default function StoryBar() {
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);

  const openStory = (index) => {
    // Current user add story
    if (MOCK_STORIES[index].isCurrentUser) {
      console.log("Open create story dialog");
      return;
    }
    setActiveStoryIndex(index);
  };

  return (
    <>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg mb-4 p-4 overflow-hidden relative group/storybar">
        {/* Subtle background glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 blur-xl pointer-events-none opacity-0 group-hover/storybar:opacity-100 transition-opacity duration-700"></div>
        <ul className="flex space-x-4 overflow-x-auto pb-2 custom-scrollbar touch-pan-x relative z-10">
          {MOCK_STORIES.map((storyUser, index) => (
            <li key={storyUser.id} className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer w-16 group" onClick={() => openStory(index)}>
              <div className="relative">
                {/* Gradient Ring */}
                <div className={`p-[2px] rounded-full ${storyUser.hasUnseen ? 'bg-gradient-to-tr from-cyan-400 via-purple-500 to-rose-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-slate-700'} transition-transform duration-300 group-hover:scale-105`}>
                  <div className="bg-slate-900 p-[2px] rounded-full">
                    <img
                      src={storyUser.avatar}
                      alt={storyUser.username}
                      className="w-14 h-14 rounded-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Add Icon for Current User */}
                {storyUser.isCurrentUser && (
                  <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 rounded-full border-[3px] border-slate-900 p-0.5 shadow-[0_0_8px_rgba(34,211,238,0.8)] z-10">
                    <Plus className="w-3 h-3 font-bold" strokeWidth={3} />
                  </div>
                )}
              </div>
              <span className={`text-[11px] font-bold truncate w-full text-center mt-1 transition-colors ${storyUser.hasUnseen ? 'text-slate-200' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {storyUser.username}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {activeStoryIndex !== null && (
        <StoryViewer 
          stories={MOCK_STORIES} 
          initialUserIndex={activeStoryIndex} 
          onClose={() => setActiveStoryIndex(null)} 
        />
      )}
    </>
  );
}
