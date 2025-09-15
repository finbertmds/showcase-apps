'use client';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface LightboxItem {
  id: string;
  url: string;
  originalName: string;
  type?: string;
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: LightboxItem[];
  currentIndex: number;
  onNavigate?: (index: number) => void;
  showNavigation?: boolean;
  showImageInfo?: boolean;
}

export function Lightbox({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNavigate,
  showNavigation = true,
  showImageInfo = true,
}: LightboxProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(currentIndex);

  // Update current index when prop changes
  useEffect(() => {
    setCurrentImageIndex(currentIndex);
  }, [currentIndex]);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowLeft' && showNavigation) {
        prevImage();
      } else if (event.key === 'ArrowRight' && showNavigation) {
        nextImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, showNavigation]);

  const nextImage = () => {
    if (items.length <= 1) return;
    const newIndex = (currentImageIndex + 1) % items.length;
    setCurrentImageIndex(newIndex);
    onNavigate?.(newIndex);
  };

  const prevImage = () => {
    if (items.length <= 1) return;
    const newIndex = currentImageIndex === 0 ? items.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    onNavigate?.(newIndex);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || items.length === 0) {
    return null;
  }

  const currentItem = items[currentImageIndex];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={handleBackgroundClick}
    >
      <div
        className="relative max-w-4xl max-h-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white hover:text-gray-300 rounded-full p-2 z-10 transition-all duration-200"
          title="Close (ESC)"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Navigation buttons */}
        {showNavigation && items.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white hover:text-gray-300 rounded-full p-2 z-10 transition-all duration-200"
              title="Previous (←)"
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white hover:text-gray-300 rounded-full p-2 z-10 transition-all duration-200"
              title="Next (→)"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Main image */}
        <img
          src={currentItem.url}
          alt={currentItem.originalName}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            console.error('Failed to load image:', currentItem.url);
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Image info */}
        {showImageInfo && (
          <div className="absolute bottom-4 left-4 right-4 text-white text-center">
            <p className="text-sm opacity-75">
              {currentImageIndex + 1} of {items.length}
            </p>
            <p className="text-lg font-medium">
              {currentItem.originalName}
            </p>
            {currentItem.type && (
              <p className="text-sm opacity-60 capitalize">
                {currentItem.type.toLowerCase()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
