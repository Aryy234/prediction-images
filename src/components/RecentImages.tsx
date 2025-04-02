
import React from 'react';
import { cn } from '@/lib/utils';

interface ImageInfo {
  id: string;
  url: string;
  topPrediction: string;
  timestamp: number;
}

interface RecentImagesProps {
  images: ImageInfo[];
  onSelectImage: (url: string) => void;
  className?: string;
}

const RecentImages: React.FC<RecentImagesProps> = ({ 
  images, 
  onSelectImage,
  className
}) => {
  if (!images.length) {
    return null;
  }

  return (
    <div className={cn("", className)}>
      <h3 className="text-lg font-medium mb-3">Imágenes recientes</h3>
      <div className="flex overflow-x-auto gap-3 pb-2">
        {images.map((image) => (
          <div 
            key={image.id}
            className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden cursor-pointer relative group"
            onClick={() => onSelectImage(image.url)}
          >
            <img 
              src={image.url} 
              alt={image.topPrediction} 
              className="w-full h-full object-cover transition-transform group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
              <span className="text-xs text-white truncate">
                {image.topPrediction.split(',')[0]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentImages;
