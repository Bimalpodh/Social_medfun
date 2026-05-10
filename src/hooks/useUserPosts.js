import { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

/**
 * Real-time hook that fetches a user's posts from Firestore.
 * Normalizes the data to always return { mediaUrl, mediaType } for UI consistency.
 */
export function useUserPosts(userId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || userId === 'guest') {
      setPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(
      collection(db, 'posts'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const userPosts = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Normalize legacy "image" field to "mediaUrl" for backward compatibility
            mediaUrl: data.mediaUrl || data.image || data.imageUrl || null,
            mediaType: data.mediaType || (data.image || data.imageUrl ? 'image' : null),
          };
        });
        setPosts(userPosts);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching user posts:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { posts, loading, error };
}
