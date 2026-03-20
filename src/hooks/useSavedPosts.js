import { useState, useEffect } from 'react';

export function useSavedPosts() {
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('savedPosts');
    if (stored) {
      try {
        setSavedIds(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse saved posts from storage");
      }
    }
  }, []);

  const toggleSave = (postId) => {
    setSavedIds((prev) => {
      const isSaved = prev.includes(postId);
      const updated = isSaved 
        ? prev.filter((id) => id !== postId)
        : [...prev, postId];
      
      localStorage.setItem('savedPosts', JSON.stringify(updated));
      return updated;
    });
  };

  const isSaved = (postId) => savedIds.includes(postId);

  return { savedIds, toggleSave, isSaved };
}
