import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth.jsx';
import { savePost, unsavePost, subscribeToSavedPostIds, getPopulatedSavedPosts } from '../services/savedService';

export function useSavedPosts() {
  const { currentUser } = useAuth();
  const [savedIds, setSavedIds] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setSavedIds([]);
      setSavedPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToSavedPostIds(currentUser.id || currentUser.uid, async (ids) => {
      setSavedIds(ids);
      try {
        const fullPosts = await getPopulatedSavedPosts(ids);
        setSavedPosts(fullPosts);
      } catch (err) {
        console.error("Failed to populate saved posts", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const toggleSave = useCallback(async (postId) => {
    if (!currentUser) return;
    const uid = currentUser.id || currentUser.uid;
    const isSavedAlready = savedIds.includes(postId);
    
    try {
      // Optimistic UI update could be manually forced here, but returning real ids helps integrity
      if (isSavedAlready) {
        await unsavePost(uid, postId);
      } else {
        await savePost(uid, postId);
      }
    } catch (err) {
      console.error("Failed to toggle save", err);
    }
  }, [currentUser, savedIds]);

  const isSaved = useCallback((postId) => savedIds.includes(postId), [savedIds]);

  return { savedIds, savedPosts, toggleSave, isSaved, loading };
}
