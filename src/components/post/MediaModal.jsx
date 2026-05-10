import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, Heart, MessageSquare, Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNowStrict } from "date-fns";
import { getAvatarFallback } from "../../services/userService";

export default function MediaModal({ isOpen, onClose, post }) {
  const videoRef = useRef(null);
  const heartTimeoutRef = useRef(null);
  const lastTapRef = useRef(0);
  
  const [mounted, setMounted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);

  // Mount check for safe SSR/Next.js portal usage
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll lock & pause video on close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      if (videoRef.current) videoRef.current.pause();
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (heartTimeoutRef.current) clearTimeout(heartTimeoutRef.current);
    };
  }, []);

  // Optimized double-tap
  const handleMediaInteraction = useCallback(() => {
    const now = Date.now();
    if (now - lastTapRef.current < 350) {
      setLiked(true);
      setShowHeartBurst(true);
      
      if (heartTimeoutRef.current) clearTimeout(heartTimeoutRef.current);
      heartTimeoutRef.current = setTimeout(() => setShowHeartBurst(false), 900);
    }
    lastTapRef.current = now;
  }, []);

  // Memoize derived data
  const formattedTime = useMemo(() => {
    try {
      if (!post?.createdAt) return "";
      const date = post.createdAt?.toDate ? post.createdAt.toDate() : new Date(post.createdAt);
      return formatDistanceToNowStrict(date, { addSuffix: true });
    } catch {
      return "";
    }
  }, [post?.createdAt]);

  if (!mounted || !post) return null;

  const authorAvatar = post?.userAvatar || post?.author?.avatar || getAvatarFallback(post?.username || post?.userId);
  const authorName = post?.username || post?.author?.name || "Player";
  const likesCount = (post?.likes?.length || 0) + (liked ? 1 : 0);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center pointer-events-none md:p-6 xl:p-10">
          
          {/* ── Backdrop ── */}
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 pointer-events-auto bg-black/95 backdrop-blur-xl md:backdrop-blur-2xl"
            onClick={onClose}
          />

          {/* ── Unified Layout Container ── */}
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.8 }}
            className="relative pointer-events-auto flex flex-col md:flex-row w-full h-full md:h-auto md:max-h-[88vh] md:max-w-6xl xl:max-w-7xl md:rounded-3xl overflow-hidden md:shadow-[0_0_0_1px_rgba(255,255,255,0.07),0_30px_80px_rgba(0,0,0,0.9)] bg-transparent md:bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Mobile Close Button (Floating) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-[50] p-2 rounded-full bg-black/50 backdrop-blur-md text-white/70 hover:text-white md:hidden"
            >
              <X size={22} />
            </button>

            {/* ── Media Area (Expands) ── */}
            <div
              className="relative flex-1 bg-black flex items-center justify-center overflow-hidden cursor-pointer w-full h-full max-h-[100dvh] md:max-h-[88vh]"
              onClick={handleMediaInteraction}
            >
              {/* Ambient Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.06)_0%,transparent_70%)] pointer-events-none z-[1]" />

              {post.mediaType === "video" ? (
                <motion.video
                  ref={videoRef}
                  src={post.mediaUrl}
                  controls
                  autoPlay
                  preload="metadata"
                  initial={{ scale: 1.02 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full h-full object-contain z-[2] relative"
                />
              ) : (
                <motion.img
                  src={post.mediaUrl}
                  alt={post.caption || "Media"}
                  initial={{ scale: 1.02 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full h-full object-contain z-[2] relative"
                  loading="lazy"
                  draggable={false}
                />
              )}

              {/* Bottom vignette */}
              <div className="absolute bottom-0 left-0 right-0 h-32 md:h-40 bg-gradient-to-t from-black/80 md:from-black/60 via-transparent to-transparent pointer-events-none z-[3]" />

              {/* Heart Burst */}
              <AnimatePresence>
                {showHeartBurst && (
                  <motion.div
                    key="heart-burst"
                    initial={{ scale: 0.3, opacity: 1 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.75, ease: "easeOut" }}
                    className="absolute z-[10] pointer-events-none"
                  >
                    <Heart size={90} className="text-rose-500 fill-rose-500 drop-shadow-[0_0_30px_rgba(244,63,94,0.9)]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Info Panel (Sidebar on Desktop, Sheet on Mobile) ── */}
            <div className="w-full md:w-[340px] xl:w-[400px] flex-shrink-0 flex flex-col bg-slate-950/95 md:bg-white/[0.03] md:backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/[0.08] rounded-t-3xl md:rounded-none absolute bottom-0 md:relative z-[20] max-h-[50vh] md:max-h-none">
              
              {/* Mobile Drag Handle */}
              <div className="w-10 h-1 rounded-full bg-slate-700 mx-auto mt-3 mb-1 md:hidden" />

              {/* Header */}
              <div className="flex items-center justify-between gap-3 p-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-slate-700 md:border-2 md:border-slate-900 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{authorName}</p>
                    {formattedTime && <p className="text-xs text-slate-500 truncate">{formattedTime}</p>}
                  </div>
                </div>
                
                {/* Desktop controls */}
                <div className="hidden md:flex items-center gap-1 flex-shrink-0">
                  <button className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                    <MoreHorizontal size={18} />
                  </button>
                  <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Caption + Comments Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {post.caption && (
                  <div className="text-sm text-slate-300 leading-relaxed md:flex md:gap-3">
                    <span className="font-bold text-white mr-2 md:hidden">{authorName}</span>
                    <span className="md:hidden">{post.caption}</span>
                    
                    {/* Desktop layout for caption */}
                    <div className="hidden md:block text-sm text-slate-300 leading-relaxed">
                       <span className="font-bold text-white mr-2">{authorName}</span>
                       {post.caption}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-center py-6 md:py-8">
                  <div className="text-center">
                    <MessageSquare className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Comments visible in feed</p>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="border-t border-white/[0.06] p-4 md:bg-black/20 pb-6 md:pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 md:gap-2">
                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => setLiked(l => !l)} className={`p-2 rounded-full transition-all ${liked ? "text-rose-500" : "text-slate-300 md:hover:text-rose-400"}`}>
                      <Heart size={24} className={liked ? "fill-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" : ""} />
                    </motion.button>
                    <span className="text-sm font-semibold text-white md:hidden mr-2">{likesCount}</span>
                    <motion.button whileTap={{ scale: 0.85 }} className="p-2 rounded-full text-slate-300 md:hover:text-cyan-400 transition-colors">
                      <MessageSquare size={24} />
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.85 }} className="p-2 rounded-full text-slate-300 md:hover:text-green-400 transition-colors">
                      <Share2 size={22} />
                    </motion.button>
                  </div>
                  <motion.button whileTap={{ scale: 0.85 }} className="p-2 rounded-full text-slate-300 md:hover:text-amber-400 transition-colors">
                    <Bookmark size={22} />
                  </motion.button>
                </div>
                <p className="hidden md:block text-sm font-bold text-white px-2">
                  {likesCount.toLocaleString()} {likesCount === 1 ? "like" : "likes"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}