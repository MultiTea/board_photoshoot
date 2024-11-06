import { useState } from 'react';
import { AttendeeBadgeProps } from '../types';

const getAssetPath = (path: string) => {
  const basePath =
    process.env.NODE_ENV === 'production' ? '/board_photoshoot' : '';
  return `${basePath}${path}`;
};

const AttendeeBadge = ({ badge, profileId, username }: AttendeeBadgeProps) => {
  const [imageError, setImageError] = useState(false);
  const [webpFailed, setWebpFailed] = useState(false);

  // Use basePath from next.config.js
  const basePath =
    process.env.NODE_ENV === 'production' ? '/board_photoshoot' : '';

  const imageSrc = imageError
    ? getAssetPath('/api/placeholder/64/64')
    : webpFailed
    ? getAssetPath(`/badges/${profileId}.png`)
    : getAssetPath(`/badges/${profileId}.webp`);

  const handleImageError = () => {
    if (!webpFailed) {
      setWebpFailed(true);
    } else {
      setImageError(true);
    }
  };

  return (
    <div className="flex flex-col gap-1 items-center bg-background/50 rounded-lg">
      <div className="relative">
        <img
          src={imageSrc}
          onError={handleImageError}
          alt={`Badge ${badge}`}
          className="size-48 rounded-full object-cover"
        />
        <span className="absolute -bottom-2 -right-2 bg-blue-600 text-white text-s px-2 py-0.5 rounded-full">
          #{badge}
        </span>
      </div>
      <span className="mt-2 text-s font-medium text-center truncate max-w-full">
        {username}
      </span>
    </div>
  );
};

export default AttendeeBadge;
