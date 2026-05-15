import React, { useCallback, useMemo, useState, useEffect } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Heart, MessageSquare, Share2, Bookmark, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSavedPosts } from "../../hooks/useSavedPosts";
import { useAuth } from "../../hooks/useAuth.jsx";
import { likePost, addComment, subscribeToComments } from "../../services/postService";
import CommentItem from "./CommentItem";
import { useModal } from "../../hooks/useModal";
import MediaModal from "./MediaModal";
import { getAvatarFallback } from "../../services/userService";

function PostCard({ post }) {
  const { currentUser } = useAuth();
  const { isSaved, toggleSave } = useSavedPosts();
  const saved = isSaved(post.id);
  const { isOpen, openModal, closeModal } = useModal();

  // Derive from Firestore data directly
  const isLiked = post.likes?.includes(currentUser?.id || currentUser?.uid) || false;
  const likesCount = post.likes?.length || 0;
  
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (isCommentsOpen) {
      unsubscribe = subscribeToComments(post.id, (data) => {
        setComments(data);
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    }
  }, [isCommentsOpen, post.id]);

  const onToggleLike = useCallback(async () => {
    if (!currentUser) return;
    try {
      await likePost(post.id, currentUser.id || currentUser.uid, isLiked);
    } catch (e) {
      console.error("Failed to toggle like:", e);
    }
  }, [post.id, currentUser, isLiked]);

  const onCommentToggle = useCallback(() => {
    setIsCommentsOpen(prev => !prev);
  }, []);

  const handlePostComment = useCallback(async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser || isPostingComment) return;

    try {
      setIsPostingComment(true);
      await addComment(post.id, {
        userId: currentUser.id || currentUser.uid,
        user: { 
          name: currentUser.name || "Player", 
          avatar: currentUser.profileImage || currentUser.avatar || getAvatarFallback(currentUser.username || currentUser.id || currentUser.uid)
        },
        text: newComment
      });
      setNewComment("");
    } catch(err) {
      console.error("Failed to post comment", err);
    } finally {
      setIsPostingComment(false);
    }
  }, [newComment, currentUser, post.id, isPostingComment]);

  const toggleCommentLike = useCallback((commentId) => {
    // Phase 4 only requested likePost and addComment, but we can log this for now
    console.log("Toggle comment like:", commentId);
  }, []);

  const onShare = useCallback(() => {
    console.log("share", post.id);
  }, [post.id]);

  const formattedTime = useMemo(() => {
    try {
      if (!post.createdAt && !post.timestamp) return "just now";
      const date = post.createdAt?.toDate ? post.createdAt.toDate() : new Date(post.createdAt || post.timestamp);
      return formatDistanceToNowStrict(date, { addSuffix: true });
    } catch {
      return "just now";
    }
  }, [post.createdAt, post.timestamp]);

  const authorName = post.username || post.author?.name || "Anonymous";
  const authorAvatar = post.userAvatar || post.userProfileImage || post.avatar || post.author?.avatar || getAvatarFallback(post.username || post.userId);

  return (
    <article className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden group/card hover:border-slate-700 transition-colors">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <img
            src={authorAvatar}
            alt={`${authorName} avatar`}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div className="truncate">
                <div className="text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                  {authorName}
                  {authorName.includes("Neon") && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_5px_rgba(34,211,238,0.8)]"></span>
                  )}
                </div>
                <div className="text-xs text-cyan-500/80 font-medium">{formattedTime}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-3 text-sm text-slate-900 leading-relaxed break-words">
          <p>{post.caption || post.text}</p>
        </div>

        {/* Media */}
        {post.mediaUrl && (
          <div 
             className="mt-4 relative rounded-2xl overflow-hidden bg-white border border-gray-300 group/media cursor-pointer z-0 max-h-[600px] flex items-center justify-center"
             onClick={() => openModal()}
          >
            {post.mediaType === 'video' ? (
              <>
                <video
                  src={post.mediaUrl}
                  preload="metadata"
                  className="w-full h-auto max-h-[600px] object-cover md:object-contain transition-transform duration-700 ease-out group-hover/media:scale-[1.01]"
                />
                {/* Play Button Indicator for Video */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 group-hover/media:bg-cyan-500/80 group-hover/media:border-cyan-400 group-hover/media:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </>
            ) : (
              <img
                src={post.mediaUrl}
                alt={post.caption || "Post content"}
                className="w-full h-auto max-h-[600px] object-cover md:object-contain transition-transform duration-700 ease-out group-hover/media:scale-[1.01]"
                loading="lazy"
              />
            )}
            
            {/* Subtle interactive darkened overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover/media:bg-black/10 transition-colors duration-300 pointer-events-none" />
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 border-t border-slate-800/80 pt-3">
          <div className="flex items-center justify-between gap-2 z-10 relative">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-pressed={isLiked}
                onClick={onToggleLike}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 focus:outline-none border ${
                  isLiked
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                    : "text-slate-400 hover:bg-slate-800 hover:text-rose-400 border-transparent hover:border-slate-700 hover:shadow-[0_0_8px_rgba(244,63,94,0.1)]"
                }`}
              >
                <motion.div
                  initial={false}
                  animate={isLiked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "text-rose-600 fill-rose-600" : "text-slate-500"}`} />
                </motion.div>
                <span className="hidden sm:inline">{likesCount}</span>
              </button>

              <button
                type="button"
                onClick={onCommentToggle}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none border ${
                  isCommentsOpen 
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]" 
                  : "text-slate-400 border-transparent hover:bg-slate-800 hover:text-cyan-400 hover:border-cyan-500/20 hover:shadow-[0_0_8px_rgba(34,211,238,0.1)]"
                }`}
              >
                <MessageSquare className={`w-4 h-4 transition-colors ${isCommentsOpen ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                <span className="hidden sm:inline">{post.commentsCount ?? 0}</span>
              </button>

              <button
                type="button"
                onClick={onShare}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-slate-400 border border-transparent transition-all duration-300 hover:bg-slate-800 hover:text-green-400 hover:border-green-500/20 hover:scale-105 active:scale-95 focus:outline-none hover:shadow-[0_0_10px_rgba(74,222,128,0.1)]"
              >
                <Share2 className="w-4 h-4 text-slate-400 group-hover:text-green-400" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={() => toggleSave(post.id)}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500/50 border border-transparent ${
                saved 
                  ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" 
                  : "text-slate-400 hover:text-amber-400 hover:bg-slate-800 hover:border-slate-700/50 hover:shadow-[0_0_10px_rgba(251,191,36,0.1)]"
              }`}
            >
              <Bookmark className={`w-5 h-5 transition-colors ${saved ? "fill-amber-400 text-amber-400" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Comments Section */}
      <AnimatePresence>
        {isCommentsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-slate-900 border-t border-cyan-900/50"
          >
            <div className="p-4 space-y-4">
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {comments
                  // Filter out hidden comments unless the current user is the post owner
                  .filter(comment => {
                    const isPostOwner = currentUser?.id === post.userId;
                    return !comment.isHidden || isPostOwner;
                  })
                  .map((comment) => (
                    <CommentItem 
                      key={comment.id}
                      comment={comment}
                      currentUser={currentUser}
                      postOwnerId={post.userId}
                      isPostOwner={currentUser?.id === post.userId}
                    />
                ))}
              </div>

              <form onSubmit={handlePostComment} className="flex gap-3 items-center pt-2">
                 <img 
                    src={currentUser?.profileImage || currentUser?.avatar || getAvatarFallback(currentUser?.username || currentUser?.id || currentUser?.uid)} 
                    alt="Current user" 
                    className="w-8 h-8 rounded-full border border-purple-500/50 shadow-[0_0_5px_rgba(168,85,247,0.4)] flex-shrink-0 object-cover"
                  />
                  <div className="flex-1 relative group">
                    <input 
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Transmit your message..."
                      className="w-full bg-slate-950/50 border border-slate-700/50 text-cyan-50 text-sm rounded-full py-2 pl-4 pr-10 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all placeholder-slate-600"
                    />
                    <button 
                      type="submit"
                      disabled={!newComment.trim()}
                      className="absolute right-1.5 top-1.5 p-1.5 rounded-full text-cyan-500 hover:bg-cyan-500/10 hover:shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Modal Viewer */}
      <MediaModal 
        isOpen={isOpen} 
        onClose={closeModal} 
        post={post} 
      />
    </article>
  );
}

// React.memo to prevent unnecessary re-renders in large feeds
export default React.memo(PostCard);