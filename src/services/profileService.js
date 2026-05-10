import { db } from "./firebase";
import { 
  collection, 
  doc, 
  getDoc,
  getDocs,
  query, 
  where, 
  orderBy, 
  limit,
  startAfter
} from "firebase/firestore";

const USERS_COLLECTION = "users";
const POSTS_COLLECTION = "posts";

export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const getUserPostsPaginated = async (userId, limitNum = 9, lastVisibleDoc = null) => {
  try {
    let q = query(
      collection(db, POSTS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitNum)
    );

    if (lastVisibleDoc) {
      q = query(q, startAfter(lastVisibleDoc));
    }

    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

    return { posts, lastVisible };
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};
