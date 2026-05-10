import { db } from "./firebase";
import { 
  collection, 
  doc, 
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";

const COLLECTION_NAME = "savedPosts";

export const savePost = async (userId, postId) => {
  const docRef = doc(db, COLLECTION_NAME, userId);
  // merge: true ensures we don't overwrite the document if it already exists
  await setDoc(docRef, {
    userId,
    postIds: arrayUnion(postId)
  }, { merge: true });
};

export const unsavePost = async (userId, postId) => {
  const docRef = doc(db, COLLECTION_NAME, userId);
  await updateDoc(docRef, {
    postIds: arrayRemove(postId)
  });
};

export const subscribeToSavedPostIds = (userId, callback) => {
  if (!userId) return () => {};
  
  const docRef = doc(db, COLLECTION_NAME, userId);
  
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      callback(data.postIds || []);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error("Error subscribing to saved posts:", error);
  });
};

export const getPopulatedSavedPosts = async (postIds) => {
  if (!postIds || postIds.length === 0) return [];
  
  const posts = [];
  // Use Promise.all to fetch missing/deleted posts safely
  const promises = postIds.map(id => getDoc(doc(db, "posts", id)));
  const results = await Promise.all(promises);
  
  results.forEach(snap => {
    if (snap.exists()) {
      posts.push({ id: snap.id, ...snap.data() });
    }
  });
  
  // Optional: keep them naturally ordered by newest first globally
  return posts.sort((a, b) => {
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return timeB - timeA;
  });
};
