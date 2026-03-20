import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "../components/post/PostCard";
import StoryBar from "../components/story/StoryBar";

/**
 * Feed page
 * - Renders a list of PostCard components
 * - Implements infinite scroll with react-intersection-observer
 */

export const INITIAL_MOCK_POSTS = [
  {
    id: "1",
    author: { name: "Asha Varma", avatar: "ram1.jpg" },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    text: "Just finished a morning run — feeling energized! Who else is up for a weekend hike?",
    imageUrl: "download.jpg",
    likes: 12,
    comments: 3,
  },
  {
    id: "2",
    author: { name: "Jon Doe", avatar: "ram2.jpg" },
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    text: "Sharing a quick tip: Always prioritize readability over cleverness in your code.",
    likes: 5,
    comments: 1,
  },
  {
    id: "3",
    author: { name: "Priya Singh", avatar: "jaishreeram.jpg" },
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    text: "Excited to announce my new project — built with love and Tailwind CSS ❤️",
    imageUrl: "c.jpg",
    likes: 48,
    comments: 12,
  },
];

// Helper to generate more dummy posts
const generateMorePosts = (startIndex) => {
  return Array.from({ length: 3 }).map((_, i) => ({
    id: `generated-${startIndex + i}`,
    author: { 
      name: `User ${startIndex + i}`, 
      avatar: `https://i.pravatar.cc/150?u=${startIndex + i}` 
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 5 * (startIndex + i)).toISOString(),
    text: `This is a dynamically loaded post #${startIndex + i}. Infinite scrolling in action! 🚀`,
    likes: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 20),
  }));
};

export default function Feed() {
  const [posts, setPosts] = useState(INITIAL_MOCK_POSTS);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // useInView hook sets 'ref' to the element we want to observe, and 'inView' tells us if it's visible
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px", // triggers a bit before reaching the very bottom
  });

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      loadMorePosts();
    }
  }, [inView, isLoading, hasMore]);

  const loadMorePosts = () => {
    setIsLoading(true);
    // Simulate network request delay
    setTimeout(() => {
      // Stop after generating ~15 posts just as a limit for the mock
      if (posts.length > 15) {
        setHasMore(false);
        setIsLoading(false);
        return;
      }
      
      const newPosts = generateMorePosts(posts.length + 1);
      setPosts(prev => [...prev, ...newPosts]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-20">
      {/* Stories Section */}
      <StoryBar />

      {/* Feed Posts */}
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      
      {/* Loading trigger element */}
      {hasMore && (
        <div ref={ref} className="py-8 flex justify-center items-center">
          {isLoading ? (
            <div className="flex space-x-3">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping shadow-[0_0_10px_rgba(34,211,238,0.8)] [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping shadow-[0_0_10px_rgba(168,85,247,0.8)] [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping shadow-[0_0_10px_rgba(244,63,94,0.8)]"></div>
            </div>
          ) : (
            <div className="text-slate-500 text-sm font-semibold tracking-widest uppercase">Scanning for more signals...</div>
          )}
        </div>
      )}

      {/* End of feed message */}
      {!hasMore && (
        <div className="py-10 text-center text-cyan-500 font-bold uppercase tracking-widest text-sm drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
          End of Transmission. 🛑
        </div>
      )}
    </div>
  );
}