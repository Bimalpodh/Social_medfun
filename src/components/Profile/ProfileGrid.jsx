import React, { useState } from 'react';
import { Heart, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MediaModal from '../post/MediaModal';

export default function ProfileGrid({ posts, loading, emptyStateIcon: Icon, emptyStateTitle, emptyStateMessage }) {
  const [selectedPost, setSelectedPost] = useState(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex space-x-3">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping shadow-[0_0_10px_rgba(34,211,238,0.8)] [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping shadow-[0_0_10px_rgba(168,85,247,0.8)] [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping shadow-[0_0_10px_rgba(244,63,94,0.8)]"></div>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.05)]">
          <Icon className="w-10 h-10 text-slate-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">{emptyStateTitle}</h3>
        <p className="text-slate-400 max-w-sm mx-auto">{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1 sm:gap-1.5 mt-4 px-1 sm:px-4">
        {posts.map((post, index) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="relative aspect-square group overflow-hidden bg-slate-900 rounded-sm sm:rounded-xl cursor-pointer"
          >
            {post.mediaType === 'video' ? (
              <>
                <video
                  src={post.mediaUrl}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  preload="metadata"
                  muted
                  playsInline
                />
                {/* Video badge */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5 text-white text-[10px] font-bold uppercase tracking-wider">
                  ▶
                </div>
              </>
            ) : (
              <img
                src={post.mediaUrl || "https://placehold.co/400x400/1e293b/38bdf8?text=No+Media"}
                alt="Post thumbnail"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center gap-4 sm:gap-6 opacity-0 group-hover:opacity-100">
              <div className="flex items-center gap-1.5 text-white font-bold drop-shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                <span className="text-sm">{post.likes?.length ?? 0}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white font-bold drop-shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                <MessageSquare className="w-5 h-5 fill-cyan-500 text-cyan-500 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                <span className="text-sm">{post.commentsCount ?? 0}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cinematic Media Viewer */}
      <MediaModal
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        post={selectedPost}
      />
    </>
  );
}

