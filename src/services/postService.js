import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDocs,
  where,
  increment,
  runTransaction,
  limit,
  startAfter
} from "firebase/firestore";

const COLLECTION_NAME = "posts";

/**
 * Fetches a page of posts starting after the provided document.
 * @param {DocumentSnapshot} lastVisible - Reference for pagination
 * @param {number} pageSize - Number of posts to fetch
 */
export const getPaginatedPosts = async (lastVisible = null, pageSize = 5) => {
  try {
    let q = query(
      collection(db, COLLECTION_NAME), 
      orderBy("createdAt", "desc"), 
      limit(pageSize)
    );

    if (lastVisible) {
      q = query(q, startAfter(lastVisible));
    }

    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      posts,
      lastVisible: snapshot.docs[snapshot.docs.length - 1] || null
    };
  } catch (error) {
    console.error("Error fetching paginated posts:", error);
    throw error;
  }
};

export const createPost = async (postData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId: postData.userId,
      username: postData.username,
      userAvatar: postData.userAvatar || null,
      caption: postData.caption || "",
      mediaUrl: postData.mediaUrl || null,
      mediaType: postData.mediaType || null,
      visibility: postData.visibility || "public",
      likes: [],
      commentsCount: 0,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating post: ", error);
    throw error;
  }
};

export const subscribeToPosts = (callback) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(posts);
  }, (error) => {
    console.error("Error subscribing to posts:", error);
  });
};

export const likePost = async (postId, userId, isLiked) => {
  const postRef = doc(db, COLLECTION_NAME, postId);
  try {
    if (isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(userId)
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(userId)
      });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting posts:", error);
    throw error;
  }
};

export const addComment = async (postId, commentData) => {
  try {
    const commentRef = doc(collection(db, "comments"));
    const postRef = doc(db, COLLECTION_NAME, postId);

    await runTransaction(db, async (transaction) => {
      // 1. Read post doc first
      const postDoc = await transaction.get(postRef);
      if (!postDoc.exists()) {
        throw new Error("Post does not exist!");
      }

      const currentCount = postDoc.data().commentsCount || 0;

      // 2. Queue writes atomically
      transaction.set(commentRef, {
        postId,
        userId: commentData.userId,
        text: commentData.text,
        user: commentData.user, 
        createdAt: serverTimestamp(),
        likes: []
      });

      transaction.update(postRef, {
        commentsCount: currentCount + 1
      });
    });

    return commentRef.id;
  } catch (error) {
    console.error("Error adding comment via transaction: ", error);
    throw error;
  }
};

export const subscribeToComments = (postId, callback) => {
  const q = query(
    collection(db, "comments"), 
    where("postId", "==", postId),
    orderBy("createdAt", "desc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(comments);
  }, (error) => {
    console.error("Error subscribing to comments. (Note: This may require a composite index in Firestore for postId + createdAt).", error);
    
    // Fallback: If index is missing, try querying by postId without sorting
    // sorting manually on the client as a fallback
    const fallbackQ = query(
      collection(db, "comments"),
      where("postId", "==", postId)
    );
    
    return onSnapshot(fallbackQ, (fallbackSnapshot) => {
      let fallbackComments = fallbackSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Manually sort since index is missing
      fallbackComments.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : Date.now();
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : Date.now();
        return timeB - timeA;
      });
      callback(fallbackComments);
    });
  });
};
