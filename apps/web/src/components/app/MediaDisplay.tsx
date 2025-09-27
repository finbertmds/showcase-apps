'use client';

import { Lightbox } from '@/components/ui/Lightbox';
import { GET_APP_MEDIA } from '@/lib/graphql/queries';
import { MediaType } from '@/types';
import { useQuery } from '@apollo/client';
import {
  DocumentIcon,
  EyeIcon,
  PhotoIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

interface MediaDisplayProps {
  appId: string;
  type?: MediaType | 'ALL';
  className?: string;
  showLightbox?: boolean;
  maxItems?: number;
}

interface MediaItem {
  id: string;
  type: string;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  order: number;
  isActive: boolean;
  meta?: {
    thumbnails?: Array<{
      size: string;
      url: string;
    }>;
    processed?: boolean;
    [key: string]: any;
  };
}

export default function MediaDisplay({
  appId,
  type = 'ALL',
  className = '',
  showLightbox = true,
  maxItems = 6
}: MediaDisplayProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data, loading, error } = useQuery(GET_APP_MEDIA, {
    variables: {
      input: {
        appId,
        ...(type !== 'ALL' && { type: type.toUpperCase() })
      }
    },
    skip: !appId,
  });

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-1 text-gray-500 ${className}`}>
        <PhotoIcon className="w-4 h-4" />
      </div>
    );
  }

  const mediaItems: MediaItem[] = data?.getAppMedia || [];

  if (mediaItems.length === 0) {
    return (
      <div className={`text-center p-4 text-gray-500 ${className}`}>
        <PhotoIcon className="w-8 h-8 mx-auto mb-2" />
        <p className="text-sm">No media found</p>
      </div>
    );
  }

  // Filter and sort media items
  const filteredMedia = mediaItems
    .filter(item => item.isActive)
    .sort((a, b) => a.order - b.order)
    .slice(0, maxItems);

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'VIDEO':
        return <PlayIcon className="w-4 h-4" />;
      case 'DOCUMENT':
        return <DocumentIcon className="w-4 h-4" />;
      default:
        return <PhotoIcon className="w-4 h-4" />;
    }
  };

  const getThumbnailUrl = (item: MediaItem, preferredSize: string = 'medium') => {
    if (item.meta?.thumbnails) {
      const thumbnail = item.meta.thumbnails.find(t => t.size === preferredSize);
      if (thumbnail) return thumbnail.url;
    }
    return item.url;
  };

  const openLightbox = (index: number) => {
    if (showLightbox) {
      setCurrentImageIndex(index);
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const handleLightboxNavigate = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <div className={`${className}`}>
        {type === 'LOGO' ? (
          // Single logo display
          <div className="flex">
            {filteredMedia.length > 0 && (
              <div className="relative group">
                <img
                  src={getThumbnailUrl(filteredMedia[0], 'large')}
                  alt={filteredMedia[0].originalName}
                  className="w-24 h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center"
                  onClick={() => openLightbox(0)}
                >
                  <EyeIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            )}
            {filteredMedia.length === 0 && (
              <div className="text-center text-gray-500">
                <PhotoIcon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Không có ảnh</p>
              </div>
            )}
          </div>
        ) : (
          // Grid display for screenshots
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.length > 0 && filteredMedia.map((item, index) => (
              <div key={item.id} className="relative group">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={getThumbnailUrl(item, 'large')}
                    alt={item.originalName}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                  />
                </div>

                {/* Overlay */}
                <div
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2 text-white">
                    <EyeIcon className="w-6 h-6" />
                  </div>
                </div>

                {/* Media type badge */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  {item.type}
                </div>
              </div>
            ))}
            {filteredMedia.length === 0 && (
              <div className="text-center text-gray-500">
                <PhotoIcon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Không có ảnh</p>
              </div>
            )}
          </div>
        )}

        {/* Show more indicator */}
        {mediaItems.length > maxItems && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              +{mediaItems.length - maxItems} more items
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen && showLightbox}
        onClose={closeLightbox}
        items={filteredMedia.map(item => ({
          id: item.id,
          url: item.url,
          originalName: item.originalName,
          type: item.type,
        }))}
        currentIndex={currentImageIndex}
        onNavigate={handleLightboxNavigate}
        showNavigation={true}
        showImageInfo={true}
      />
    </>
  );
}
