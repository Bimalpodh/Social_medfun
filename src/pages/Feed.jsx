import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "../components/post/PostCard";
import StoryBar from "../components/story/StoryBar";
import { usePosts } from "../hooks/usePosts";
import { PostSkeleton } from "../components/Utils/Skeleton";

export default function Feed() {
  const { posts, loading, loadingMore, error, hasMore, loadMore } = usePosts(5);
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  // Trigger load more when the observer element enters view
  useEffect(() => {
    if (inView && hasMore && !loading && !loadingMore) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadingMore, loadMore]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Stories Section */}
      <StoryBar />

      {/* Initial Loading State */}
      {loading && (
        <div className="space-y-6">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="py-8 text-center text-rose-500 font-bold uppercase tracking-widest text-sm drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">
          {error}
        </div>
      )}

      {/* Feed Posts */}
      {!loading && posts.map((post, index) => (
        <PostCard key={`${post.id}-${index}`} post={post} />
      ))}

      {/* Load More Trigger / Loading More State */}
      {hasMore && !error && (
        <div ref={ref} className="py-10  flex flex-col items-center gap-4">
          {loadingMore ? (
            <div className="w-full space-y-6">
              <PostSkeleton />
            </div>
          ) : (
            <div className="h-20 w-full" /> // Target for observer
          )}
        </div>
      )}

      {/* Empty Feed */}
      {!loading && posts.length === 0 && !error && (
        <div className="py-20 text-center flex flex-col items-center gap-4">
          <div className="p-6 bg-white rounded-full border border-slate-800 text-slate-800">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-cyan-500 font-bold uppercase tracking-widest text-sm drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            No signals found in this sector.
          </p>
        </div>
      )}

      {/* End of feed message */}
      {!hasMore && posts.length > 0 && !loading && (
        <div className="py-10 text-center flex flex-col items-center gap-2">
          <div className="h-[1px] w-20 bg-white mb-4" />
          <p className="text-slate-800 font-bold uppercase tracking-widest text-[10px] opacity-50">
            End of Transmission 🛑
          </p>
        </div>
      )}
    </div>
  );
}