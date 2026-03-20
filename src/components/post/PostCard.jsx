import React, { useCallback, useMemo, useState } from "react";
import { Heart, MessageSquare, Share2, Bookmark } from "lucide-react";
import { useSavedPosts } from "../../hooks/useSavedPosts";

/**
 * PostCard
 * - Reusable post component (mobile-first)
 * - Props: { post } where post = { id, author: { name, avatar }, timestamp, text, imageUrl, likes }
 *
 * Notes:
 * - Uses Tailwind classes only
 * - Accessible buttons with aria-labels
 * - Memoized internal handlers for performance in lists
 */
import { formatDistanceToNowStrict } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

function PostCard({ post }) {
  const { isSaved, toggleSave } = useSavedPosts();
  const saved = isSaved(post.id);

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes ?? 0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Mock comments data injected on first render to simulate a fetched timeline
  const [comments, setComments] = useState(() => [
    { id: 1, user: { name: "NeonRider", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NeonRider" }, text: "That is insane! Nice run.", time: "1h ago", liked: false },
    { id: 2, user: { name: "PixelDust", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PixelDust" }, text: "Could use some better anti-aliasing but cool concept.", time: "45m ago", liked: true }
  ]);

  const onToggleLike = useCallback(() => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikes(nextLiked ? (post.likes ?? 0) + 1 : (post.likes ?? 0));
  }, [liked, post.likes]);

  const onCommentToggle = useCallback(() => {
    setIsCommentsOpen(prev => !prev);
  }, []);

  const handlePostComment = useCallback((e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      user: { name: "CurrentPlayer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
      text: newComment,
      time: "Just now",
      liked: false
    };

    setComments(prev => [comment, ...prev]);
    setNewComment("");
  }, [newComment]);

  const toggleCommentLike = useCallback((commentId) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, liked: !c.liked } : c
    ));
  }, []);

  const onShare = useCallback(() => {
    // placeholder: integrate share dialog or navigator.share
    console.log("share", post.id);
  }, [post.id]);

  const formattedTime = useMemo(() => {
    try {
      return formatDistanceToNowStrict(new Date(post.timestamp), { addSuffix: true });
    } catch {
      return "just now";
    }
  }, [post.timestamp]);

  return (
    <article className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden group/card hover:border-slate-700 transition-colors">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <img
            src={post.author.avatar}
            alt={`${post.author.name} avatar`}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            loading="lazy"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <div className="truncate">
                <div className="text-sm font-bold text-slate-100 truncate flex items-center gap-1.5">
                  {post.author.name}
                  {post.author.name.includes("Neon") && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_5px_rgba(34,211,238,0.8)]"></span>
                  )}
                </div>
                <div className="text-xs text-cyan-500/80 font-medium">{formattedTime}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-3 text-sm text-slate-300 leading-relaxed">
          <p>{post.text}</p>
        </div>

        {/* Optional image */}
        {post.imageUrl && (
          <div className="mt-3">
            <img
              src={post.imageUrl}
              alt={post.alt ?? "Post image"}
              className="w-full h-60 md:h-72 rounded-lg object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 border-t border-slate-800/80 pt-3">
          <div className="flex items-center justify-between gap-2 z-10 relative">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-pressed={liked}
                aria-label={liked ? "Unlike post" : "Like post"}
                onClick={onToggleLike}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 focus:outline-none border ${
                  liked
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                    : "text-slate-400 hover:bg-slate-800 hover:text-rose-400 border-transparent hover:border-slate-700 hover:shadow-[0_0_8px_rgba(244,63,94,0.1)]"
                }`}
              >
                <motion.div
                  initial={false}
                  animate={liked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className={`w-4 h-4 ${liked ? "text-rose-600 fill-rose-600" : "text-slate-500"}`} />
                </motion.div>
                <span className="hidden sm:inline">{likes}</span>
              </button>

              <button
                type="button"
                aria-label="Comment"
                onClick={onCommentToggle}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none border ${
                  isCommentsOpen 
                  ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]" 
                  : "text-slate-400 border-transparent hover:bg-slate-800 hover:text-cyan-400 hover:border-cyan-500/20 hover:shadow-[0_0_8px_rgba(34,211,238,0.1)]"
                }`}
              >
                <MessageSquare className={`w-4 h-4 transition-colors ${isCommentsOpen ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400'}`} />
                <span className="hidden sm:inline">{post.comments ?? comments.length}</span>
              </button>

              <button
                type="button"
                aria-label="Share"
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
              aria-label={saved ? "Remove from saved" : "Save post"}
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

      {/* Expandable Comments Section - Gaming/Cyberpunk Theme */}
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
              
              {/* Existing Comments List */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {comments.map((comment) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={comment.id} 
                    className="flex gap-3 group"
                  >
                    <img 
                      src={comment.user.avatar} 
                      alt={comment.user.name} 
                      className="w-8 h-8 rounded-full border border-cyan-500/30 group-hover:border-cyan-400 group-hover:shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 bg-slate-800/50 rounded-2xl rounded-tl-none p-3 border border-slate-700/50 group-hover:border-cyan-900/50 transition-colors">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-200 tracking-wide">{comment.user.name}</span>
                        <span className="text-xs text-slate-500">{comment.time}</span>
                      </div>
                      <p className="text-sm text-slate-300">{comment.text}</p>
                    </div>
                    
                    {/* Comment Like Button */}
                    <button 
                      onClick={() => toggleCommentLike(comment.id)}
                      className="self-center p-2 rounded-full text-slate-500 hover:text-rose-500 hover:bg-slate-800 transition-colors"
                    >
                      <motion.div
                        initial={false}
                        animate={comment.liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Heart className={`w-4 h-4 ${comment.liked ? "text-rose-500 fill-rose-500 drop-shadow-[0_0_5px_rgba(244,63,94,0.6)]" : ""}`} />
                      </motion.div>
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handlePostComment} className="flex gap-3 items-center pt-2">
                 <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                    alt="Current user" 
                    className="w-8 h-8 rounded-full border border-purple-500/50 shadow-[0_0_5px_rgba(168,85,247,0.4)] flex-shrink-0"
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
    </article>
  );
}

export default React.memo(PostCard);