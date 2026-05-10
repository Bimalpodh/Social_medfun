import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './useAuth';

export function useSearchUsers() {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setChats([]);
      setLoading(false);
      return;
    }

    const currentUserId = currentUser.id || currentUser.uid;
    const chatsRef = collection(db, 'chats');
    // Using simple query for now. Will be refined in Step 6 Message System
    const q = query(chatsRef, where("participants", "array-contains", currentUserId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedChats = [];
      snapshot.forEach((doc) => {
        fetchedChats.push({ id: doc.id, ...doc.data() });
      });
      // Sort in JS if orderBy fails due to missing index
      fetchedChats.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      setChats(fetchedChats);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching chats:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats;
    const queryStr = searchQuery.toLowerCase();
    return chats.filter(chat => {
      // In real chat doc, name might be nested or calculated based on the other participant
      const chatName = chat.name || chat.otherParticipantName || "";
      return chatName.toLowerCase().includes(queryStr);
    });
  }, [searchQuery, chats]);

  return {
    searchQuery,
    setSearchQuery,
    filteredChats,
    allChats: chats,
    loading
  };
}
