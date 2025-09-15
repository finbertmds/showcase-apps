'use client';

import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Lightbox } from '@/components/ui/Lightbox';
import { DELETE_MEDIA, GET_APP_MEDIA } from '@/lib/graphql/queries';
import { useMutation, useQuery } from '@apollo/client';
import {
  EyeIcon,
  PhotoIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface MediaManagerProps {
  appId: string;
  className?: string;
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
  createdAt: string;
  updatedAt: string;
}

export default function MediaManager({ appId, className = '' }: MediaManagerProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data, loading, error, refetch } = useQuery(GET_APP_MEDIA, {
    variables: {
      input: { appId }
    },
    skip: !appId,
  });

  const [deleteMedia] = useMutation(DELETE_MEDIA, {
    onCompleted: () => {
      refetch();
      toast.success('Media deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting media:', error);
      toast.error('Failed to delete media');
    },
  });

  const mediaItems: MediaItem[] = data?.getAppMedia || [];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getThumbnailUrl = (item: MediaItem, preferredSize: string = 'small') => {
    if (item.meta?.thumbnails) {
      const thumbnail = item.meta.thumbnails.find(t => t.size === preferredSize);
      if (thumbnail) return thumbnail.url;
    }
    return item.url;
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const handleLightboxNavigate = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleDelete = (media: MediaItem) => {
    setSelectedMedia(media);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedMedia) return;

    try {
      await deleteMedia({ variables: { id: selectedMedia.id } });
      setShowDeleteModal(false);
      setSelectedMedia(null);
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  const getMediaTypeColor = (type: string) => {
    switch (type) {
      case 'LOGO':
        return 'bg-blue-100 text-blue-800';
      case 'SCREENSHOT':
        return 'bg-green-100 text-green-800';
      case 'COVER':
        return 'bg-purple-100 text-purple-800';
      case 'VIDEO':
        return 'bg-red-100 text-red-800';
      case 'DOCUMENT':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center p-4 text-red-600 ${className}`}>
        <p>Failed to load media: {error.message}</p>
      </div>
    );
  }

  if (mediaItems.length === 0) {
    return (
      <div className={`text-center p-8 text-gray-500 ${className}`}>
        <PhotoIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">No media files</p>
        <p className="text-sm">Upload some media to get started</p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Media Files ({mediaItems.length})
        </h3>
        <button
          onClick={() => refetch()}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mediaItems.map((item, index) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {/* Thumbnail */}
            <div className="aspect-video bg-gray-100 relative">
              <img
                src={getThumbnailUrl(item, 'medium')}
                alt={item.originalName}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />

              {/* Media type badge */}
              <div className="absolute top-2 left-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMediaTypeColor(item.type)}`}>
                  {item.type}
                </span>
              </div>

              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 hover:opacity-100 transition-opacity flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => openLightbox(index)}
                    className="p-2 bg-white rounded-full text-gray-700 hover:text-blue-600"
                    title="Preview"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Media info */}
            <div className="p-2">
              <h4 className="font-medium text-gray-900 truncate" title={item.originalName}>
                {item.originalName}
              </h4>

              <div className="mt-2 space-y-1 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{formatFileSize(item.size)}</span>
                </div>

                {item.width && item.height && (
                  <div className="flex justify-between">
                    <span>Dimensions:</span>
                    <span>{item.width} × {item.height}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Uploaded:</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>

                {item.meta?.processed && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Processed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal && !!selectedMedia}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Media File"
        message={`Are you sure you want to delete "${selectedMedia?.originalName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={false}
      />

      {/* Lightbox */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        items={mediaItems.map((item: MediaItem) => ({
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
    </div>
  );
}
