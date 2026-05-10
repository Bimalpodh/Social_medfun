import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

const USERS_COLLECTION = "users";

/**
 * Searches users based on partial case-insensitive matches.
 * Note: Firestore lacks native case-insensitive substring search.
 * For this environment, we fetch the users to provide a seamless
 * Instagram/Twitter style "typeahead" experience.
 */
export const searchUsersByUsername = async (searchTerm) => {
  if (!searchTerm || typeof searchTerm !== 'string') return [];
  
  const term = searchTerm.trim().toLowerCase();
  if (term.length === 0) return [];

  const usersRef = collection(db, USERS_COLLECTION);

  try {
    const snapshot = await getDocs(usersRef);
    const allUsers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Filter locally to support "contains" and case-insensitivity on both name and username
    return allUsers
      .filter(user => 
        (user.username && user.username.toLowerCase().includes(term)) ||
        (user.name && user.name.toLowerCase().includes(term))
      )
      .slice(0, 5);
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};
