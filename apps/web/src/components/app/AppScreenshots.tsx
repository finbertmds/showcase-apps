'use client';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Media } from '@/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useState } from 'react';

interface AppScreenshotsProps {
  media: Media[];
  loading: boolean;
  appTitle: string;
}

export function AppScreenshots({ media, loading, appTitle }: AppScreenshotsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const screenshots = media.filter(m => m.type === 'SCREENSHOT' || m.type === 'COVER');
  const logo = media.find(m => m.type === 'LOGO');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (screenshots.length === 0 && !logo) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl text-gray-500">📱</span>
          </div>
          <p className="text-gray-500">No screenshots available</p>
        </div>
      </div>
    );
  }

  const currentMedia = screenshots[currentIndex] || logo;
  const hasMultipleImages = screenshots.length > 1;

  const nextImage = () => {
    if (hasMultipleImages) {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    }
  };

  const prevImage = () => {
    if (hasMultipleImages) {
      setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    }
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {currentMedia && (
          <Image
            src={currentMedia.url}
            alt={`${appTitle} screenshot`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              aria-label="Next image"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {hasMultipleImages && (
        <div className="mt-4 flex space-x-2 overflow-x-auto">
          {screenshots.map((screenshot, index) => (
            <button
              key={screenshot.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${index === currentIndex
                  ? 'border-primary-500'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
            >
              <Image
                src={screenshot.url}
                alt={`${appTitle} screenshot ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {hasMultipleImages && (
        <div className="mt-2 text-center text-sm text-gray-500">
          {currentIndex + 1} of {screenshots.length}
        </div>
      )}
    </div>
  );
}
