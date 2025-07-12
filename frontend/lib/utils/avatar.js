// Avatar utility to handle different avatar URL formats
import { backend_url } from "@/lib/server";

export const getAvatarUrl = (avatar) => {
  // If no avatar, return fallback
  if (!avatar) {
    return "/assets/fallback-avatar.png";
  }
  
  // If it's already a full URL (includes Google, Cloudinary, etc.), return as is
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) {
    return avatar;
  }
  
  // If it's a relative path, construct full URL
  return `${backend_url}/${avatar}`;
};

export const handleAvatarError = (e) => {
  // Avatar load error, using fallback
  console.warn("Avatar failed to load:", e.target.src);
  e.target.src = "/assets/fallback-avatar.png";
  e.target.onerror = null; // Prevent infinite loop if fallback also fails
};

export const getImageUrl = (imageUrl) => {
  // If no image, return null
  if (!imageUrl) {
    return null;
  }
  
  // If it's already a full URL (Cloudinary), return as is
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  
  // If it's a relative path, construct full URL
  return `${backend_url}/${imageUrl}`;
};

export const handleImageError = (e) => {
  // Image load error, hiding broken image
  e.target.style.display = "none"; // Hide broken image
};
