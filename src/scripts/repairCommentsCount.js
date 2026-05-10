import { db } from "../services/firebase";
import { collection, getDocs, writeBatch, query, where } from "firebase/firestore";

/**
 * ONE-TIME REPAIR SCRIPT 
 * Scans all posts, calculates the actual number of comments existing in the comments collection,
 * and fixes the cached `commentsCount` field accurately.
 */
export const repairCommentsCount = async () => {
  try {
    console.log("Starting comment count repair...");
    const postsSnapshot = await getDocs(collection(db, "posts"));
    
    // Utilize batching due to Firestore's 500 write limit
    let batch = writeBatch(db);
    let operationCount = 0;
    
    for (const postDoc of postsSnapshot.docs) {
      const postId = postDoc.id;
      
      // Get exact count from DB
      const commentsQuery = query(collection(db, "comments"), where("postId", "==", postId));
      const commentsSnapshot = await getDocs(commentsQuery);
      
      const actualCount = commentsSnapshot.size;
      const cachedCount = postDoc.data().commentsCount || 0;
      
      if (actualCount !== cachedCount) {
        console.log(`Fixing post ${postId}: Cache=${cachedCount} -> Actual=${actualCount}`);
        batch.update(postDoc.ref, { commentsCount: actualCount });
        operationCount++;
        
        // Commit and refresh batch when reaching the limit
        if (operationCount >= 500) {
          await batch.commit();
          batch = writeBatch(db);
          operationCount = 0;
        }
      }
    }
    
    // Commit remaining ops
    if (operationCount > 0) {
      await batch.commit();
    }
    
    console.log("✅ Comment count repair completed securely!");
  } catch (error) {
    console.error("Error repairing comment counts:", error);
  }
};
