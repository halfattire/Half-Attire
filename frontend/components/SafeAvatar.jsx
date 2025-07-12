import { useState } from "react";
import Image from "next/image";
import { getAvatarUrl, handleAvatarError } from "@/lib/utils/avatar";

const SafeAvatar = ({ 
  src, 
  alt = "User Avatar", 
  width = 40, 
  height = 40, 
  className = "rounded-full object-cover",
  ...props 
}) => {
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(getAvatarUrl(src));

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc("/assets/fallback-avatar.png");
    }
  };

  // If it's a Google image and we're having issues, use a regular img tag as fallback
  const isGoogleImage = imgSrc && imgSrc.includes("googleusercontent.com");
  
  if (isGoogleImage && hasError) {
    return (
      <img
        src="/assets/fallback-avatar.png"
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{ width, height }}
        {...props}
      />
    );
  }

  if (isGoogleImage) {
    // For Google images, use regular img tag to avoid Next.js config issues
    return (
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
        style={{ width, height }}
        {...props}
      />
    );
  }

  // For other images, use Next.js Image component
  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default SafeAvatar;
