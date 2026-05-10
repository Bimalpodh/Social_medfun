import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getSuggestions } from '../services/userService';

export function useSuggestions() {
  const { currentUser } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSuggestions = useCallback(async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const currentUserId = currentUser.id || currentUser.uid;
      const followingList = currentUser.following || [];
      const followersList = currentUser.followers || [];
      
      const suggestedUsers = await getSuggestions(currentUserId, followingList, followersList);
      setSuggestions(suggestedUsers);
    } catch (err) {
      console.error(err);
      setError("Failed to load suggestions.");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  // Remove a user from suggestions visually when followed (optimistic UI for list)
  const removeSuggestion = useCallback((userId) => {
    setSuggestions(prev => prev.filter(user => user.uid !== userId && user.id !== userId));
  }, []);

  return { suggestions, loading, error, removeSuggestion, refetch: fetchSuggestions };
}
