import { db } from "./firebase";
import { 
  collection, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  runTransaction
} from "firebase/firestore";

const COLLECTION_NAME = "comments";
const POSTS_COLLECTION = "posts";

/**
 * Permanently deletes a comment from Firestore using an atomic transaction.
 * Checks the parent post document first to ensure `commentsCount` never drops below 0.
 */
export const deleteComment = async (commentId, postId) => {
  if (!commentId || !postId) throw new Error("Missing requirements for deletion");

  try {
    const commentRef = doc(db, COLLECTION_NAME, commentId);
    const postRef = doc(db, POSTS_COLLECTION, postId);

    await runTransaction(db, async (transaction) => {
      // 1. In a transaction, ALL reads must execute before ALL writes
      const postDoc = await transaction.get(postRef);
      if (!postDoc.exists()) {
        throw new Error("Post does not exist!");
      }

      // 2. Safely calculate the new count, preventing negatives
      const currentCount = postDoc.data().commentsCount || 0;
      const newCount = Math.max(0, currentCount - 1);

      // 3. Execute writes
      transaction.delete(commentRef);
      transaction.update(postRef, {
        commentsCount: newCount
      });
    });
    
    console.log(`Comment ${commentId} deleted and post count updated via transaction.`);
  } catch (error) {
    console.error("Error executing delete comment transaction:", error);
    throw error;
  }
};

/**
 * Soft deletes a comment by setting isHidden to true.
 * Requires currentUser.id === post.userId
 */
export const hideComment = async (commentId) => {
  try {
    const commentRef = doc(db, COLLECTION_NAME, commentId);
    await updateDoc(commentRef, {
      isHidden: true
    });
    console.log(`Comment ${commentId} hidden successfully.`);
  } catch (error) {
    console.error("Error hiding comment:", error);
    throw error;
  }
};

/**
 * Real-time listener for comments on a specific post.
 * Retrieves all comments, enabling the UI to filter out hidden ones.
 */
export const getCommentsByPost = (postId, callback) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("postId", "==", postId),
    orderBy("createdAt", "desc")
  );

  // Return the unsubscribe function to clean up the listener
  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(comments);
  }, (error) => {
    console.error("Error fetching comments in real-time:", error);
  });
};
