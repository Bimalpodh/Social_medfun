import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Image as ImageIcon, Smile, Send } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreatePostModal({ isOpen, onClose }) {
  const [caption, setCaption] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const pickerContainerRef = useRef(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) &&
        (!pickerContainerRef.current || !pickerContainerRef.current.contains(event.target))
      ) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleEmojiClick = (emojiData) => {
    setCaption(prev => prev + emojiData.emoji);
  };

  const handlePost = () => {
    console.log("Posting new content:", { caption, hasImage: !!selectedImage });
    // Reset state and close
    setCaption("");
    setSelectedImage(null);
    setShowEmojiPicker(false);
    onClose();
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md">
        <style>{`
          .emoji-picker-container aside.EmojiPickerReact {
            overscroll-behavior: contain !important;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(203, 213, 225, 0.4);
            border-radius: 20px;
          }
          .custom-scrollbar:hover::-webkit-scrollbar-thumb {
            background-color: rgba(203, 213, 225, 0.8);
          }
        `}</style>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className={`bg-white rounded-[2rem] shadow-2xl flex flex-row max-h-[90vh] ring-1 ring-slate-900/5 relative z-50 will-change-transform transition-[max-width] duration-300 ease-in-out w-full overflow-hidden ${showEmojiPicker ? 'max-w-[850px]' : 'max-w-[550px]'}`}
        >
          {/* Left Side: Post Content */}
          <div className="flex flex-col flex-1 w-full relative z-20 bg-white min-h-[550px]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-20">
              <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight">Create Post</h2>
              <button 
                onClick={onClose}
                className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200 hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto transition-all duration-300 custom-scrollbar flex-1 flex flex-col">
            
            {/* User info mock */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-full blur-sm opacity-50"></div>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Your avatar" className="w-12 h-12 rounded-full border-2 border-white shadow-sm relative z-10" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-lg leading-tight">John Doe</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">@johndoe</span>
                  <span className="text-xs text-slate-400 font-medium">• Public</span>
                </div>
              </div>
            </div>

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's on your mind? Share your thoughts..."
              className="w-full text-[1.1rem] border-none focus:ring-0 resize-none placeholder-slate-300 min-h-[220px] bg-transparent outline-none text-slate-700 leading-relaxed font-medium flex-1"
              autoFocus
            />

            {/* Image Preview Area */}
            <AnimatePresence>
              {selectedImage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative mt-4 rounded-xl overflow-hidden border-2 border-slate-100 bg-slate-50 group shadow-sm"
                >
                  <img 
                    src={selectedImage} 
                    alt="Upload preview" 
                    className="w-full max-h-80 object-contain"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer / Toolbar */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-md sticky bottom-0 z-20">
            
            <div className="flex items-center gap-2 relative">
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleImageSelect}
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-full transition-all duration-200 hover:scale-110"
                title="Add Image"
              >
                <ImageIcon className="w-6 h-6" />
              </button>

              <div className="relative" ref={emojiPickerRef}>
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${showEmojiPicker ? 'bg-amber-100 text-amber-600' : 'text-slate-400 hover:bg-amber-50 hover:text-amber-500'}`}
                  title="Add Emoji"
                >
                  <Smile className="w-6 h-6" />
                </button>
              </div>
            </div>

            <button
              onClick={handlePost}
              disabled={!caption.trim() && !selectedImage}
              className="group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-full font-bold shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:shadow-md disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all duration-300"
            >
              <span className="tracking-wide">Post</span>
              <Send className="w-4 h-4 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
          </div>

          {/* Right Side: Emoji Picker */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                ref={pickerContainerRef}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="border-l border-slate-100 bg-slate-50 relative z-10 flex flex-col m-0 p-0 overflow-hidden"
              >
                <div className="w-[320px] h-full emoji-picker-container bg-white">
                  <EmojiPicker 
                    onEmojiClick={handleEmojiClick}
                    autoFocusSearch={false}
                    theme="light"
                    width={320}
                    height="100%"
                    lazyLoadEmojis={true}
                    style={{ border: 'none', borderRadius: 0 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
