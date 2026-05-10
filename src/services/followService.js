import { db } from "./firebase";
import { doc, runTransaction } from "firebase/firestore";

const USERS_COLLECTION = "users";

/**
 * Follows a user by atomically updating both the current user's following list
 * and the target user's followers list using a Firestore Transaction to ensure
 * data consistency and prevent scale-bugs like duplicate entries or self-follows.
 */
export const followUser = async (currentUserId, targetUserId) => {
  if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
    throw new Error("Invalid user IDs for follow action.");
  }

  const currentUserRef = doc(db, USERS_COLLECTION, currentUserId);
  const targetUserRef = doc(db, USERS_COLLECTION, targetUserId);

  try {
    await runTransaction(db, async (transaction) => {
      const currentUserDoc = await transaction.get(currentUserRef);
      const targetUserDoc = await transaction.get(targetUserRef);

      if (!currentUserDoc.exists() || !targetUserDoc.exists()) {
        throw new Error("One or both user documents do not exist!");
      }

      const currentUserData = currentUserDoc.data();
      const targetUserData = targetUserDoc.data();

      const currentUserFollowing = currentUserData.following || [];
      const targetUserFollowers = targetUserData.followers || [];

      if (currentUserFollowing.includes(targetUserId)) {
        throw new Error("Already following this user");
      }

      // Push to arrays inline inside the transaction scope
      currentUserFollowing.push(targetUserId);
      targetUserFollowers.push(currentUserId);

      // Perform updates
      transaction.update(currentUserRef, {
        following: currentUserFollowing,
        followingCount: currentUserFollowing.length
      });

      transaction.update(targetUserRef, {
        followers: targetUserFollowers,
        followersCount: targetUserFollowers.length
      });
    });

    console.log(`User ${currentUserId} followed ${targetUserId} successfully.`);
  } catch (error) {
    console.error("Error following user:", error);
    throw error;
  }
};

/**
 * Unfollows a user by atomically updating both the current user's following list
 * and the target user's followers list via Firestore Transaction, preventing negative counts.
 */
export const unfollowUser = async (currentUserId, targetUserId) => {
  if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
    throw new Error("Invalid user IDs for unfollow action.");
  }

  const currentUserRef = doc(db, USERS_COLLECTION, currentUserId);
  const targetUserRef = doc(db, USERS_COLLECTION, targetUserId);

  try {
    await runTransaction(db, async (transaction) => {
      const currentUserDoc = await transaction.get(currentUserRef);
      const targetUserDoc = await transaction.get(targetUserRef);

      if (!currentUserDoc.exists() || !targetUserDoc.exists()) {
        throw new Error("One or both user documents do not exist!");
      }

      const currentUserData = currentUserDoc.data();
      const targetUserData = targetUserDoc.data();

      let currentUserFollowing = currentUserData.following || [];
      let targetUserFollowers = targetUserData.followers || [];

      if (!currentUserFollowing.includes(targetUserId)) {
        throw new Error("Not currently following this user");
      }

      // Filter out the IDs
      currentUserFollowing = currentUserFollowing.filter(id => id !== targetUserId);
      targetUserFollowers = targetUserFollowers.filter(id => id !== currentUserId);

      // Perform guaranteed updates avoiding negative counts natively via length
      transaction.update(currentUserRef, {
        following: currentUserFollowing,
        followingCount: Math.max(0, currentUserFollowing.length)
      });

      transaction.update(targetUserRef, {
        followers: targetUserFollowers,
        followersCount: Math.max(0, targetUserFollowers.length)
      });
    });

    console.log(`User ${currentUserId} unfollowed ${targetUserId} successfully.`);
  } catch (error) {
    console.error("Error unfollowing user:", error);
    throw error;
  }
};
