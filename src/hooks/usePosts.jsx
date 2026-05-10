import { useState, useEffect, useCallback } from 'react';
import { getPaginatedPosts } from '../services/postService';

/**
 * Hook to manage infinite scroll post fetching.
 * Supports manual re-fetch and paginated 'load more'.
 */
export const usePosts = (pageSize = 5) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (isInitial = true) => {
    try {
      if (isInitial) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const { posts: newPosts, lastVisible } = await getPaginatedPosts(
        isInitial ? null : lastDoc,
        pageSize
      );

      setPosts(prev => isInitial ? newPosts : [...prev, ...newPosts]);
      setLastDoc(lastVisible);
      setHasMore(newPosts.length === pageSize);
    } catch (err) {
      console.error("Transmission Error:", err);
      setError("Failed to synchronize signals.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [lastDoc, pageSize]);

  // Initial Fetch
  useEffect(() => {
    fetchPosts(true);
  }, []); // Only once on mount

  return { 
    posts, 
    loading, 
    loadingMore, 
    error, 
    hasMore, 
    loadMore: () => !loadingMore && hasMore && fetchPosts(false),
    refresh: () => fetchPosts(true)
  };
};
