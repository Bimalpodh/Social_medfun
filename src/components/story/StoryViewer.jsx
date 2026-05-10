import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Loader2, Trash2, Heart, Send, Smile } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { sendStoryReply } from "../../services/chatService";
import { deleteStory } from "../../services/storyService";
import { useAuth } from "../../hooks/useAuth";

/**
 * StoryViewer Modal
 * Shows a full-screen image/video with progress bars at the top.
 */

const STORY_DURATION = 5000; // 5 seconds per story

const getAvatar = (user) => {
  return user?.avatar || user?.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username || 'Guest'}`;
};

export default function StoryViewer({ stories, initialUserIndex, onClose }) {
  const { currentUser } = useAuth();
  const currentUserId = currentUser?.uid || currentUser?.id;
  
  // Filter out users with no stories (like current user placeholders)
  const activeStories = stories.filter(u => u.items && u.items.length > 0);
  
  // Find the correct index in the filtered list
  const initialFilteredIndex = activeStories.findIndex(u => u.id === stories[initialUserIndex]?.id);
  
  const [currentUserIndex, setCurrentUserIndex] = useState(initialFilteredIndex === -1 ? 0 : initialFilteredIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [mediaError, setMediaError] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  const user = activeStories[currentUserIndex];
  
  // If no stories at all, close
  if (!user) {
    onClose();
    return null;
  }

  const story = user.items[currentStoryIndex];

  // Logic helpers
  const handleNext = useCallback(() => {
    setMediaError(false);
    setIsMediaLoading(true);
    if (currentStoryIndex < user.items.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else if (currentUserIndex < activeStories.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose(); // end of all stories
    }
  }, [currentStoryIndex, currentUserIndex, user.items.length, activeStories.length, onClose]);

  const handlePrev = useCallback(() => {
    setMediaError(false);
    setIsMediaLoading(true);
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(prev => prev - 1);
      setCurrentStoryIndex(activeStories[currentUserIndex - 1].items.length - 1);
    } else {
      setProgress(0);
    }
  }, [currentStoryIndex, currentUserIndex, activeStories]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, handleNext, handlePrev]);

  // Auto-advance progress
  useEffect(() => {
    if (isPaused || isMediaLoading) return;

    setProgress(0);
    let start = Date.now();
    let frame;

    const tick = () => {
      const elapsed = Date.now() - start;
      const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        frame = requestAnimationFrame(tick);
      } else if (!mediaError) {
        handleNext();
      }
    };
    
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [currentUserIndex, currentStoryIndex, isPaused, isMediaLoading, handleNext]);

  // REACTIVE SIGNAL TRACKING (Fix for Step 1)
  // If the stories data changes underneath us (e.g. via background deletion/expiry)
  // we need to ensure our indices still point to valid data.
  useEffect(() => {
    if (!activeStories[currentUserIndex]) {
      // The current user has no more stories or was deleted
      onClose();
      return;
    }
    
    // Check if the current story still exists in the list
    const currentUser = activeStories[currentUserIndex];
    if (currentStoryIndex >= currentUser.items.length) {
      // Story was deleted, attempt to go back to 0 or close
      if (currentUser.items.length > 0) {
        setCurrentStoryIndex(0);
        setProgress(0);
      } else {
        handleNext(); // Move to next user
      }
    }
  }, [stories, currentUserIndex, currentStoryIndex, onClose, handleNext, activeStories]);

  const handleDelete = async () => {
    if (!window.confirm("Terminate this broadcast?")) return;
    try {
      await deleteStory(story.id);
      handleNext();
    } catch (err) {
      console.error("Deletion failed:", err);
    }
  };

  const handleSendReply = async (textOverride) => {
    const text = textOverride || replyText;
    if (!text.trim() || !currentUserId || user.id === currentUserId) return;
    
    try {
      setIsSendingReply(true);
      await sendStoryReply(currentUserId, user.id, text, story.url);
      setReplyText("");
      // Visual feedback could be added here
    } catch (err) {
      console.error("Reply failed:", err);
    } finally {
      setIsSendingReply(false);
    }
  };

  const QUICK_REACTIONS = ["🔥", "❤️", "😂", "😮", "😢", "🙌"];

  const formatTimestamp = (ts) => {
    if (!ts) return "";
    try {
      const date = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
      return formatDistanceToNow(date, { addSuffix: true }).replace('about ', '');
    } catch (e) {
      return "";
    }
  };

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center text-white"
      >
        {/* Global Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-[220] flex items-center justify-center p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all border border-white/10 text-white shadow-2xl cursor-pointer active:scale-90"
        >
          <X size={24} />
        </button>

        {/* Desktop Controls (Chevrons) */}
        <div className="hidden lg:flex absolute inset-x-0 top-1/2 -translate-y-1/2 px-10 justify-between pointer-events-none z-[220]">
          <button 
            onClick={handlePrev} 
            className="p-4 bg-white/5 hover:bg-white/15 rounded-full backdrop-blur-md pointer-events-auto transition-all border border-white/10 active:scale-95"
          >
            <ChevronLeft size={40} />
          </button>
          <button 
            onClick={handleNext} 
            className="p-4 bg-white/5 hover:bg-white/15 rounded-full backdrop-blur-md pointer-events-auto transition-all border border-white/10 active:scale-95"
          >
            <ChevronRight size={40} />
          </button>
        </div>

        {/* Main Content Area */}
        <div 
          className="relative w-full max-w-md aspect-[9/16] bg-zinc-900 sm:rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          
          {/* Progress Bars */}
          <div className="absolute top-0 inset-x-0 p-3 pt-4 flex gap-1.5 z-[210]">
            {user.items.map((_, idx) => (
              <div key={idx} className="h-[3px] flex-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-white transition-all duration-100 ease-linear rounded-full`}
                  style={{ 
                    width: idx === currentStoryIndex ? `${progress}%` : (idx < currentStoryIndex ? '100%' : '0%') 
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header Info (Glassmorphism) */}
          <div className="absolute top-7 inset-x-0 px-4 flex justify-between items-center z-[210] bg-gradient-to-b from-black/60 to-transparent pb-10">
            <div className="flex items-center gap-3">
              <div className="p-0.5 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500">
                <img 
                  src={getAvatar(user)} 
                  onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=Fallback`; }}
                  alt="" 
                  className="w-9 h-9 rounded-full border border-black/20 object-cover bg-white" 
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight drop-shadow-md">{user.username}</span>
                <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">
                  {formatTimestamp(story.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user.id === currentUserId && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                  className="p-2 hover:bg-rose-500/20 rounded-full text-rose-400 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Main Content Render */}
          <div className="relative flex-1 flex items-center justify-center z-10 w-full h-full">
            {isMediaLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-50">
                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
              </div>
            )}
            
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentUserIndex}-${currentStoryIndex}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full h-full flex items-center justify-center bg-black"
              >
                {mediaError ? (
                  <div className="flex flex-col items-center gap-4 text-rose-400 p-8 text-center">
                    <div className="p-6 bg-rose-500/10 rounded-full border border-rose-500/20">
                      <X className="w-12 h-12" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">Signal Lost</h3>
                      <p className="text-sm text-white/50">Transmission failed from {user.username}</p>
                    </div>
                    <button 
                      onClick={handleNext}
                      className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      Skip Signal
                    </button>
                  </div>
                ) : story.type === 'video' ? (
                  <video 
                    src={story.url} 
                    autoPlay 
                    playsInline 
                    onLoadedData={() => setIsMediaLoading(false)}
                    onError={() => { setMediaError(true); setIsMediaLoading(false); }}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img 
                    src={story.url} 
                    alt="" 
                    onLoad={() => setIsMediaLoading(false)}
                    onError={() => { setMediaError(true); setIsMediaLoading(false); }}
                    className="w-full h-full object-contain shadow-2xl" 
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Background Adaptive Blur */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/40" />
            {story.type === 'image' && (
              <img 
                src={story.url} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover blur-[100px] opacity-40 scale-150" 
              />
            )}
          </div>

          {/* Interaction Bar (Step 6/7/Interaction) */}
          <div className="absolute bottom-0 inset-x-0 p-4 z-[225] bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            {user.id !== currentUserId ? (
              <div className="flex flex-col gap-4">
                {/* Quick Reactions */}
                <div className="flex justify-between items-center px-2">
                  {QUICK_REACTIONS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={(e) => { e.stopPropagation(); handleSendReply(emoji); }}
                      className="text-2xl hover:scale-125 active:scale-95 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Comment Input */}
                <div 
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-full px-4 py-2 backdrop-blur-md transition-all group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    placeholder="Send a Signal..."
                    className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-white/40"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onFocus={() => setIsPaused(true)}
                    onBlur={() => setIsPaused(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendReply();
                    }}
                  />
                  <button 
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || isSendingReply}
                    className="text-cyan-400 disabled:opacity-30 p-1"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
                  Transmitting to your allies
                </span>
              </div>
            )}
          </div>

          {/* Tap Navigation Areas */}
          <div 
            className="absolute inset-y-0 left-0 w-[40%] z-[215] cursor-pointer" 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }} 
          />
          <div 
            className="absolute inset-y-0 right-0 w-[60%] z-[215] cursor-pointer" 
            onClick={(e) => { e.stopPropagation(); handleNext(); }} 
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
