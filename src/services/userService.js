import { db } from "./firebase";
import { doc, updateDoc, getDoc, setDoc, collection, query, where, limit, getDocs, orderBy, documentId } from "firebase/firestore";

/**
 * Generates a consistent fallback avatar using DiceBear
 * @param {string} seed - A unique string (username or UID) for the seed
 * @returns {string} - The DiceBear avatar URL
 */
export const getAvatarFallback = (seed = 'Guest') => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
};

/**
 * Updates user profile data in Firestore
 * @param {string} uid - The unique ID of the user
 * @param {object} data - The data to update (name, username, bio, profileImage, coverImage, etc.)
 */
export const updateUserProfile = async (uid, data) => {
  if (!uid) throw new Error("User ID is required for profile update.");
  
  const userRef = doc(db, "users", uid);
  
  try {
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      // Document exists, update it
      await updateDoc(userRef, data);
      console.log(`User document for ${uid} successfully updated.`);
    } else {
      // Document does not exist, create it
      await setDoc(userRef, {
        ...data,
        createdAt: new Date().toISOString()
      });
      console.log(`User document for ${uid} successfully created.`);
    }
  } catch (error) {
    console.error("Error updating/creating user profile:", error);
    throw error;
  }
};

/**
 * Fetches user profile data from Firestore
 * @param {string} uid - The unique ID of the user
 */
export const getUserProfile = async (uid) => {
  if (!uid) return null;
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() };
  }
  return null;
};

/**
 * Creates user profile document immediately after signup with exact schema
 * @param {object} user - The Firebase Auth user object
 * @param {object} additionalData - Extra data like name
 */
export const createUserProfile = async (user, additionalData = {}) => {
  if (!user || !user.uid) throw new Error("Valid Auth user object is required.");
  
  const userRef = doc(db, "users", user.uid);
  
  const baseUsername = user.email ? user.email.split('@')[0] : 'user';
  const rawName = additionalData.name || user.displayName || baseUsername;
  const formattedUsername = rawName.toLowerCase().replace(/\s+/g, '_') + Math.floor(Math.random() * 1000);
  
  // Create a stunning default avatar if the user drops in without one
  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formattedUsername}`;
  const finalAvatar = user.photoURL || defaultAvatar;

  const newProfile = {
    uid: user.uid,
    username: formattedUsername,
    name: rawName,
    avatar: finalAvatar,
    profileImage: finalAvatar,
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(userRef, newProfile);
    console.log(`User document for ${user.uid} successfully created with schema.`);
    return newProfile;
  } catch (error) {
    console.error("Error creating user profile document:", error);
    throw error;
  }
};

/**
 * Fetches SMART user suggestions for the current user
 * @param {string} currentUserId - The ID of the currently logged in user
 * @param {Array} currentFollowing - Array of user IDs the current user is already following
 * @param {Array} currentFollowers - Array of user IDs that follow the current user
 * @returns {Promise<Array>} - Array of suggested users
 */
export const getSuggestions = async (currentUserId, currentFollowing = [], currentFollowers = []) => {
  try {
    const usersRef = collection(db, "users");
    // Fetch a popular batch of users to act as a pool (Firestore lacks complex graph queries natively)
    // Order by followersCount descending prevents suggesting inactive accounts heavily
    const q = query(usersRef, orderBy("followersCount", "desc"), limit(40)); 
    const querySnapshot = await getDocs(q);
    
    let scoredSuggestions = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const userId = doc.id;
      
      // Filter out self and already following efficiently
      if (userId !== currentUserId && !currentFollowing.includes(userId)) {
        let score = 0;
        
        // Priority 1: They follow the current user (Mutual potential)
        if (currentFollowers.includes(userId)) {
          score += 100;
        }

        // Priority 2: Popularity tie-breaker
        score += (userData.followersCount || 0);

        scoredSuggestions.push({ uid: userId, score, ...userData });
      }
    });

    // Sort by algorithmic score
    scoredSuggestions.sort((a, b) => b.score - a.score);

    // Limit the final highest quality results to 5
    return scoredSuggestions.slice(0, 5).map(u => {
      const { score, ...userObj } = u;
      return userObj;
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    throw error;
  }
};

/**
 * Search users by prefix on username
 * @param {string} searchTerm - Search query
 * @returns {Promise<Array>} - Array of matched users
 */
export const searchUsers = async (searchTerm) => {
  try {
    if (!searchTerm?.trim()) return [];
    
    // We use lowercased term for case insensitive-like properties if usernames are stored in lowercase,
    // otherwise exact prefix matching on username
    const term = searchTerm.trim();
    const termLower = term.toLowerCase();
    
    const usersRef = collection(db, "users");
    
    // Prefix query for username
    const qUsername = query(
      usersRef,
      where("username", ">=", termLower),
      where("username", "<=", termLower + '\uf8ff'),
      limit(10)
    );
    
    // Prefix query for name (if we store names in a searchable way or just do standard prefix)
    const qName = query(
      usersRef,
      where("name", ">=", term),
      where("name", "<=", term + '\uf8ff'),
      limit(10)
    );
    
    const [snapUsername, snapName] = await Promise.all([
      getDocs(qUsername),
      getDocs(qName)
    ]);
    
    const resultsMap = new Map();
    
    snapUsername.forEach((doc) => {
      resultsMap.set(doc.id, { uid: doc.id, ...doc.data() });
    });
    
    snapName.forEach((doc) => {
      if (!resultsMap.has(doc.id)) {
        resultsMap.set(doc.id, { uid: doc.id, ...doc.data() });
      }
    });
    
    return Array.from(resultsMap.values()).slice(0, 15);
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

/**
 * Fetches multiple user profiles by their IDs
 * @param {Array} ids - List of user UIDs
 * @returns {Promise<Array>} - Array of user profile objects
 */
export const getUsersByIds = async (ids) => {
  if (!ids || ids.length === 0) return [];
  
  try {
    const usersRef = collection(db, "users");
    // Firestore "in" query limit is 30. For production, we'd batch this.
    // We'll take the first 30 for now to keep it high-performance.
    const limitedIds = ids.slice(0, 30);
    
    const q = query(usersRef, where(documentId(), "in", limitedIds));
    const querySnapshot = await getDocs(q);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ uid: doc.id, ...doc.data() });
    });
    
    // Maintain original order if possible, though not strictly required
    return users;
  } catch (error) {
    console.error("Error fetching users by IDs:", error);
    return [];
  }
};
