import { useState } from 'react';
import { uploadStory } from '../services/storyService';

/**
 * Hook to manage the lifecycle of a story upload.
 * Follows the Services -> Hooks -> UI architecture.
 */
export function useUploadStory() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Orchestrates the story upload process.
   * @param {Object} currentUser - The logged-in user.
   * @param {File} file - The media file to upload.
   */
  const upload = async (currentUser, file) => {
    if (!currentUser || !file) {
      setError("Missing essential data for transmission.");
      return false;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      await uploadStory(currentUser, file);
      setSuccess(true);
      return true;
    } catch (err) {
      console.error("Transmission Error:", err);
      setError(err.message || "Failed to broadcast signal. Check your connection.");
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setIsUploading(false);
    setError(null);
    setSuccess(false);
  };

  return { upload, isUploading, error, success, reset };
}
