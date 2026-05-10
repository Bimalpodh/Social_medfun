import { useState, useEffect, useCallback } from 'react';
import { getUserProfile, getUserPostsPaginated } from '../services/profileService';

export function useProfile(userId) {
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfileAndInitialPosts = useCallback(async () => {
    if (!userId) return;
    
    setLoadingProfile(true);
    setLoadingPosts(true);
    setError(null);
    setHasMore(true);

    try {
      const pData = await getUserProfile(userId);
      setProfileData(pData);

      if (pData) {
        const { posts, lastVisible } = await getUserPostsPaginated(userId, 9, null);
        setUserPosts(posts);
        setLastDoc(lastVisible);
        if (posts.length < 9) {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load profile data.");
    } finally {
      setLoadingProfile(false);
      setLoadingPosts(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileAndInitialPosts();
  }, [fetchProfileAndInitialPosts]);

  const loadMorePosts = useCallback(async () => {
    if (!hasMore || loadingMore || !userId || !lastDoc) return;
    
    setLoadingMore(true);
    try {
      const { posts, lastVisible } = await getUserPostsPaginated(userId, 9, lastDoc);
      
      setUserPosts(prev => [...prev, ...posts]);
      setLastDoc(lastVisible);
      
      if (posts.length < 9) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more posts:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loadingMore, userId, lastDoc]);

  return { 
    profileData, 
    userPosts, 
    loadingProfile, 
    loadingPosts, 
    loadingMore, 
    hasMore, 
    loadMorePosts, 
    error 
  };
}
