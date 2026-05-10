const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Validate Cloudinary Config
if (!CLOUD_NAME) {
  console.error("Missing Cloudinary Cloud Name. Please check your .env file.");
}
if (!UPLOAD_PRESET) {
  console.error("Missing Cloudinary Upload Preset. Please check your .env file.");
}

/**
 * Uploads a file (image/video) to Cloudinary via unsigned upload
 * and returns the optimized secure URL.
 */
export const uploadMedia = async (file) => {
  if (!file) return null;

  const isVideo = file.type.startsWith("video/");
  const resourceType = isVideo ? "video" : "image";
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Cloudinary upload failed");
    }

    let optimizedUrl = data.secure_url;
    
    // Apply Cloudinary transformations (`f_auto,q_auto,w_800`) for images
    if (!isVideo && data.secure_url) {
      const parts = data.secure_url.split('/upload/');
      if (parts.length === 2) {
        optimizedUrl = `${parts[0]}/upload/f_auto,q_auto,w_800/${parts[1]}`;
      }
    }

    return {
      url: optimizedUrl,
      type: resourceType,
      public_id: data.public_id
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary: ", error);
    throw error;
  }
};
