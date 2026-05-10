import { useState, useCallback, useEffect } from 'react';
import { followUser, unfollowUser } from '../services/followService';
import { useAuth } from './useAuth.jsx'; // Assuming this provides the realtime currentUser

export function useFollow(targetUserId) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Database truth arrays
  const isFollowingDB = Boolean(currentUser?.following?.includes(targetUserId));
  const isFollowerDB = Boolean(currentUser?.followers?.includes(targetUserId));
  
  // Optimistic UI state for following only (since follower state only changes externally)
  const [optimisticFollowing, setOptimisticFollowing] = useState(null);
  
  const isFollowing = optimisticFollowing !== null ? optimisticFollowing : isFollowingDB;
  const isFollower = isFollowerDB;
  const isMutual = isFollowing && isFollower;

  const handleFollowToggle = useCallback(async () => {
    if (!currentUser || !targetUserId) return;
    if (currentUser.id === targetUserId || currentUser.uid === targetUserId) return; // Prevent self-follow

    const currentUserId = currentUser.id || currentUser.uid;

    setLoading(true);
    setError(null);
    
    // Instantly update UI optimistically
    setOptimisticFollowing(!isFollowing);

    try {
      if (isFollowing) {
        await unfollowUser(currentUserId, targetUserId);
      } else {
        await followUser(currentUserId, targetUserId);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update follow status.");
      // Revert optimistic update on failure
      setOptimisticFollowing(isFollowing);
    } finally {
      setLoading(false);
      // We clear the optimistic state eventually so we rely on DB truth
      setTimeout(() => setOptimisticFollowing(null), 1000); 
    }
  }, [currentUser, targetUserId, isFollowing]);

  return { 
    isFollowing, 
    isFollower,
    isMutual,
    handleFollowToggle, 
    loading, 
    error 
  };
}
