import React, { useState, useEffect, useRef } from "react";
import { MoreVertical, Trash2, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteComment, hideComment } from "../../services/commentService";
import { formatDistanceToNowStrict } from "date-fns";
import { getAvatarFallback } from "../../services/userService";

export default function CommentItem({ comment, currentUser, postOwnerId, isPostOwner }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Safety/Auth validation
  const isCommentOwner = currentUser?.id === comment.userId;
  const canDelete = isCommentOwner || isPostOwner;
  const canHide = isPostOwner && !comment.isHidden;

  const handleDelete = async () => {
    if (!canDelete) return;
    try {
      await deleteComment(comment.id, comment.postId || postOwnerId);
      setShowMenu(false);
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleHide = async () => {
    if (!canHide) return;
    try {
      await hideComment(comment.id);
      setShowMenu(false);
    } catch (error) {
      console.error("Failed to hide", error);
    }
  };

  let commentTime = "just now";
  try {
    if (comment.createdAt) {
      const date = comment.createdAt.toDate ? comment.createdAt.toDate() : new Date(comment.createdAt);
      commentTime = formatDistanceToNowStrict(date, { addSuffix: true });
    }
  } catch (e) {}

  // ** Step 4 Logic: Conditional Rendering for Hidden Comments **
  // If a comment is hidden, non-owners shouldn't even see this component render (handled in parent).
  // But if that check fails, or for post owners, we render it conditionally.
  if (comment.isHidden && !isPostOwner) {
    return null; // Safety net
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex gap-3 group relative ${comment.isHidden ? 'opacity-50 grayscale' : ''}`}
    >
      <img 
        src={comment.user?.avatar || comment.user?.profileImage || getAvatarFallback(comment.user?.username || comment.userId)} 
        alt={comment.user?.name || "Player"} 
        className="w-8 h-8 rounded-full border border-cyan-500/30 group-hover:border-cyan-400 group-hover:shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all flex-shrink-0 object-cover"
      />
      
      <div className="flex-1 min-w-0 bg-slate-800/50 rounded-2xl rounded-tl-none p-3 border border-slate-700/50 group-hover:border-cyan-900/50 transition-colors">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-sm font-bold text-slate-200 tracking-wide">
            {comment.user?.name || "Player"}
            {comment.isHidden && (
              <span className="ml-2 text-[10px] uppercase font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                Hidden
              </span>
            )}
          </span>
          <span className="text-xs text-slate-500">{commentTime}</span>
        </div>
        <p className="text-sm text-slate-300">
          {comment.isHidden ? <span className="italic">This comment was hidden by the post owner.</span> : comment.text}
        </p>
      </div>
      
      {/* 3-Dot Menu */}
      {(canDelete || canHide) && (
        <div className="relative flex items-center" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-full text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="absolute right-0 top-8 w-32 bg-slate-800 border border-slate-700/80 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.8)] z-10 overflow-hidden ring-1 ring-black ring-opacity-5"
              >
                {canDelete && (
                  <button 
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-slate-700/50 flex items-center gap-2 transition-colors border-b border-slate-700/50"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                )}
                {canHide && (
                  <button 
                    onClick={handleHide}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-amber-400 hover:bg-slate-700/50 flex items-center gap-2 transition-colors"
                  >
                    <EyeOff className="w-4 h-4" /> Hide
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
