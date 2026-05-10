import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getUsersByIds } from '../services/userService';

/**
 * Hook to listen to a user's chats in real-time
 * @param {string} userId - The ID of the current user
 */
export function useChats(userId) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setChats([]);
      setLoading(false);
      return;
    }

    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef, 
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        const chatData = [];
        const otherParticipantIds = new Set();

        snapshot.forEach((doc) => {
          const data = doc.data();
          const otherId = data.participants.find(p => p !== userId);
          if (otherId) otherParticipantIds.add(otherId);
          chatData.push({ id: doc.id, ...data, otherId });
        });

        // Enrich with user profiles
        if (otherParticipantIds.size > 0) {
          const profiles = await getUsersByIds(Array.from(otherParticipantIds));
          const profileMap = profiles.reduce((acc, p) => ({ ...acc, [p.uid]: p }), {});
          
          const enrichedChats = chatData.map(chat => ({
            ...chat,
            user: profileMap[chat.otherId] || { name: 'Unknown User', avatar: '' }
          }));
          
          setChats(enrichedChats);
        } else {
          setChats(chatData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error enrichment chats:", err);
        setError("Failed to load chat details.");
        setLoading(false);
      }
    }, (err) => {
      console.error("useChats listener error:", err);
      setError("Failed to sync chats.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { chats, loading, error };
}
