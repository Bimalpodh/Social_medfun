import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './useAuth';
import { aggregateStories } from '../services/storyService';

/**
 * Hook to manage real-time Story synchronization.
 * Uses Firestore onSnapshot to ensure the UI stays in perfect sync with the DB.
 */
export function useStories() {
  const { currentUser } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial timestamp for filtering (only show active stories)
    const now = Timestamp.now();
    const storiesRef = collection(db, 'stories');
    
    const q = query(
      storiesRef, 
      where('expiresAt', '>', now)
    );

    // REAL-TIME LISTENER: Triggered on every change (Add/Update/Delete)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // 1. Map documents from snapshot
      const rawStories = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      // 2. Aggregate by user
      let aggregated = aggregateStories(rawStories);
      
      // 3. Handle Current User "Identity"
      const currentUserId = currentUser?.id || currentUser?.uid;
      
      if (currentUserId) {
        const userHasStories = aggregated.find(u => u.id === currentUserId);
        
        if (!userHasStories) {
          // If current user has NO stories, add the "Add Story" placeholder at the start
          aggregated.unshift({
            id: currentUserId,
            username: "Your Story",
            avatar: currentUser.profileImage || currentUser.avatar,
            isCurrentUser: true,
            items: []
          });
        } else {
          // If current user HAS stories, move them to the first position
          const others = aggregated.filter(u => u.id !== currentUserId);
          userHasStories.isCurrentUser = true;
          aggregated = [userHasStories, ...others];
        }
      }
      
      // 4. Update state (React will trigger a re-render automatically)
      setStories(aggregated);
      setLoading(false);
    }, (error) => {
      console.error("Critical Signal Sync Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return { stories, loading };
}
