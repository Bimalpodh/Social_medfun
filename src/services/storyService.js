import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs,
  deleteDoc,
  doc,
  Timestamp 
} from 'firebase/firestore';
import { uploadMedia } from './cloudinary';

/**
 * Uploads a story to Cloudinary and saves metadata to Firestore.
 */
export const uploadStory = async (currentUser, file) => {
  if (!currentUser || !file) throw new Error("Missing user or file");

  // 1. Upload to Cloudinary
  const result = await uploadMedia(file);
  if (!result || !result.url) throw new Error("Media capture failed.");

  const mediaUrl = result.url; // Use the direct string URL
  const resourceType = result.type;

  // 2. Set Expiration (24 hours from now)
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // 3. Save to Firestore
  const storyData = {
    userId: currentUser.id || currentUser.uid,
    username: currentUser.username,
    avatar: currentUser.avatar || currentUser.profileImage || null,
    mediaUrl,
    mediaType: resourceType,
    publicId: result.public_id,
    createdAt: serverTimestamp(),
    expiresAt: Timestamp.fromDate(expiresAt),
    seenBy: []
  };

  const docRef = await addDoc(collection(db, 'stories'), storyData);
  return docRef.id;
};

/**
 * Deletes a story from Firestore.
 */
export const deleteStory = async (storyId) => {
  if (!storyId) return;
  const docRef = doc(db, 'stories', storyId);
  await deleteDoc(docRef);
  return true;
};

/**
 * Groups raw stories by userId.
 */
export const aggregateStories = (rawStories) => {
  const userMap = {};

  rawStories.forEach(story => {
    const { userId, username, avatar } = story;
    if (!userMap[userId]) {
      userMap[userId] = {
        id: userId,
        username,
        avatar,
        items: []
      };
    }
    userMap[userId].items.push({
      id: story.id,
      url: story.mediaUrl,
      mediaType: story.mediaType,
      createdAt: story.createdAt,
      expiresAt: story.expiresAt
    });
  });

  // Sort items by createdAt within each user
  Object.values(userMap).forEach(user => {
    user.items.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
  });

  return Object.values(userMap);
};
