import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * StoryViewer Modal
 * Shows a full-screen image/video with progress bars at the top.
 */

const STORY_DURATION = 5000; // 5 seconds per story

export default function StoryViewer({ stories, initialUserIndex, onClose }) {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const user = stories[currentUserIndex];
  const story = user.items[currentStoryIndex];

  // Auto-advance progress
  useEffect(() => {
    setProgress(0);
    let start = Date.now();
    let frame;

    const tick = () => {
      const elapsed = Date.now() - start;
      const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        handleNext();
      }
    };
    
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [currentUserIndex, currentStoryIndex]);

  const handleNext = () => {
    if (currentStoryIndex < user.items.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else if (currentUserIndex < stories.length - 1) {
      setCurrentUserIndex(prev => prev + 1);
      setCurrentStoryIndex(0);
    } else {
      onClose(); // end of all stories
    }
  };

  const handlePrev = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex(prev => prev - 1);
      setCurrentStoryIndex(stories[currentUserIndex - 1].items.length - 1);
    } else {
      // First story of first user, restart or do nothing
      setProgress(0);
    }
  };

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[100] bg-black flex flex-col sm:p-4 text-white"
      >
        {/* Global Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[110] flex items-center justify-center p-3 sm:p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors border border-white/20 text-white shadow-xl cursor-pointer"
          title="Close"
        >
          <X className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Main Content Area */}
        <div className="relative flex-1 bg-zinc-900 sm:rounded-2xl overflow-hidden mx-auto w-full max-w-md shadow-2xl flex flex-col">
          
          {/* Progress Bars */}
          <div className="absolute top-0 inset-x-0 p-3 flex gap-1 z-20">
            {user.items.map((_, idx) => (
              <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-white transition-all duration-100 ease-linear rounded-full`}
                  style={{ 
                    width: idx === currentStoryIndex ? `${progress}%` : (idx < currentStoryIndex ? '100%' : '0%') 
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header Info */}
          <div className="absolute top-6 inset-x-0 px-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent pb-4">
            <div className="flex items-center gap-2">
              <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-white/50" />
              <span className="font-semibold text-sm drop-shadow-md">{user.username}</span>
              <span className="text-white/70 text-xs font-medium ml-1">{story.time}</span>
            </div>
          </div>

          {/* Story Background */}
          <div className="absolute inset-0 z-0">
             {/* Simple blur background matching the image */}
            <div className="absolute inset-0 bg-zinc-900" />
            <img src={story.url} alt="" className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110" />
          </div>

          {/* Story Image Area */}
          <div className="relative flex-1 flex items-center justify-center z-10 w-full h-full">
            <img 
              src={story.url} 
              alt="Story content" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Tap Areas */}
          <div className="absolute inset-y-0 left-0 w-1/3 z-20" onClick={handlePrev} />
          <div className="absolute inset-y-0 right-0 w-2/3 z-20" onClick={handleNext} />
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
