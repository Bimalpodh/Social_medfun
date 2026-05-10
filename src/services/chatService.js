import { db } from "./firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc,
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  orderBy, 
  onSnapshot,
  limit
} from "firebase/firestore";

const CHATS_COLLECTION = "chats";
const MESSAGES_SUBCOLLECTION = "messages";

/**
 * Finds or creates a chat document between two users
 */
export const getOrCreateChat = async (uid1, uid2) => {
  if (!uid1 || !uid2) throw new Error("Participant IDs are required.");
  if (uid1 === uid2) throw new Error("Self-transmission is locked.");
  
  // Deterministic chatId: Always [smallerUID]_[largerUID]
  const chatId = uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
  const chatRef = doc(db, CHATS_COLLECTION, chatId);
  
  try {
    const chatSnap = await getDoc(chatRef);
    
    if (chatSnap.exists()) return chatId;

    const newChat = {
      participants: [uid1, uid2],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: "Secure Channel Established",
      lastSenderId: "system",
      unreadCount: { [uid1]: 0, [uid2]: 0 }
    };

    await setDoc(chatRef, newChat);
    return chatId;
  } catch (error) {
    console.error("Error getting/creating chat:", error);
    throw error;
  }
};

/**
 * Sends a message within a chat
 */
export const sendMessage = async (chatId, senderId, text, metadata = {}) => {
  if (!text.trim()) return;

  try {
    const messagesRef = collection(db, CHATS_COLLECTION, chatId, MESSAGES_SUBCOLLECTION);
    const chatRef = doc(db, CHATS_COLLECTION, chatId);

    await addDoc(messagesRef, {
      senderId,
      text: text.trim(),
      createdAt: serverTimestamp(),
      ...metadata
    });

    await updateDoc(chatRef, {
      lastMessage: text.trim(),
      lastSenderId: senderId,
      updatedAt: serverTimestamp()
    });
    
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

/**
 * Responds to a story by sending a DM to the author.
 */
export const sendStoryReply = async (senderId, targetUserId, text, storyUrl) => {
  if (senderId === targetUserId) return;
  
  const chatId = await getOrCreateChat(senderId, targetUserId);
  await sendMessage(chatId, senderId, text, {
    type: 'story_reply',
    storyContext: storyUrl
  });
};
