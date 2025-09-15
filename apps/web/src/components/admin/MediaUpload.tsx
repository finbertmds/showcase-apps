'use client';

// File upload handled with fetch API
import { CREATE_MEDIA, GET_APP_MEDIA } from '@/lib/graphql/queries';
import { MediaApiService } from '@/lib/services/media-api';
import { MediaType } from '@/types';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import {
  CheckCircleIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';

interface MediaUploadProps {
  appId: string;
  type: MediaType;
  onUploadSuccess?: (media: any) => void;
  onUploadError?: (error: string) => void;
  className?: string;
}

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}


export default function MediaUpload({
  appId,
  type,
  onUploadSuccess,
  onUploadError,
  className = ''
}: MediaUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const apolloClient = useApolloClient();
  const [createMedia] = useMutation(CREATE_MEDIA);

  // Check existing media to determine if upload should be disabled
  const { data: existingMediaData } = useQuery(GET_APP_MEDIA, {
    variables: { input: { appId } },
    skip: type !== 'LOGO', // Only check for logos
  });

  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false
  });
  const [dragActive, setDragActive] = useState(false);

  // Check if logo already exists
  const hasExistingLogo = type === 'LOGO' && existingMediaData?.getAppMedia?.some(
    (media: any) => media.type === 'LOGO'
  );

  // File upload is now handled with fetch API

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return 'Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)';
    }

    if (file.size > maxSize) {
      return 'Kích thước file không được vượt quá 5MB';
    }

    return null;
  };

  const handleFileUpload = async (file: File) => {
    // Check if logo already exists
    if (type === 'LOGO' && hasExistingLogo) {
      const errorMessage = 'App đã có logo. Chỉ được phép upload 1 logo duy nhất.';
      setUploadState(prev => ({ ...prev, error: errorMessage }));
      onUploadError?.(errorMessage);
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setUploadState(prev => ({ ...prev, error: validationError }));
      onUploadError?.(validationError);
      return;
    }

    setUploadState({
      isUploading: true,
      progress: 0,
      error: null,
      success: false
    });

    try {
      // Step 1 & 2: Get presigned URL and upload file using MediaApiService
      const { uploadUrl, filename } = await MediaApiService.uploadMedia(appId, type, file);

      // Step 3: Save media metadata via Apollo GraphQL
      const { data: mediaData } = await createMedia({
        variables: {
          input: {
            appId: appId,
            type: type.toUpperCase(),
            url: uploadUrl.split('?')[0], // Remove query parameters
            filename: filename,
            originalName: file.name,
            mimeType: file.type,
            size: file.size,
            width: null, // Will be processed later
            height: null, // Will be processed later
            order: 0
          }
        }
      });

      const result = mediaData.createMedia;

      // Update Apollo cache to show new media immediately
      try {
        // Ensure result has all required fields for cache
        const cacheResult = {
          ...result,
          appId: result.appId || appId, // Ensure appId is present
          __typename: 'MediaDto' // Add typename for Apollo cache
        };

        apolloClient.cache.updateQuery(
          {
            query: GET_APP_MEDIA,
            variables: { input: { appId } }
          },
          (existingData) => {
            if (existingData?.getAppMedia) {
              return {
                getAppMedia: [...existingData.getAppMedia, cacheResult]
              };
            }
            return existingData;
          }
        );
      } catch (cacheError) {
        console.warn('Failed to update cache:', cacheError);
        // Fallback: refetch the query
        apolloClient.refetchQueries({
          include: [GET_APP_MEDIA]
        });
      }

      setUploadState({
        isUploading: false,
        progress: 100,
        error: null,
        success: true
      });

      onUploadSuccess?.(result);

      // Reset success state after 3 seconds
      setTimeout(() => {
        setUploadState(prev => ({ ...prev, success: false }));
      }, 3000);

    } catch (error: any) {
      setUploadState({
        isUploading: false,
        progress: 0,
        error: error.message || 'Upload failed',
        success: false
      });
      onUploadError?.(error.message || 'Upload failed');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const clearError = () => {
    setUploadState(prev => ({ ...prev, error: null }));
  };

  const getUploadText = () => {
    if (type === 'LOGO') {
      return hasExistingLogo ? 'Logo đã tồn tại' : 'Upload Logo';
    }
    return 'Upload Screenshot';
  };

  const getUploadIcon = () => {
    if (type === 'LOGO') {
      return <PhotoIcon className="w-8 h-8" />;
    }
    return <CloudArrowUpIcon className="w-8 h-8" />;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${hasExistingLogo
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
            : dragActive
              ? 'border-blue-500 bg-blue-50 cursor-pointer'
              : 'border-gray-300 hover:border-gray-400 cursor-pointer'
          }
          ${uploadState.isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDrop={hasExistingLogo ? undefined : handleDrop}
        onDragOver={hasExistingLogo ? undefined : handleDragOver}
        onDragLeave={hasExistingLogo ? undefined : handleDragLeave}
        onClick={hasExistingLogo ? undefined : handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-3">
          {getUploadIcon()}

          <div className="text-sm text-gray-600">
            <p className="font-medium">{getUploadText()}</p>
            {!hasExistingLogo && (
              <>
                <p>Kéo thả file hoặc click để chọn</p>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG, WebP (tối đa 5MB)
                </p>
              </>
            )}
            {hasExistingLogo && (
              <p className="text-xs text-gray-500 mt-1">
                Chỉ được phép upload 1 logo duy nhất
              </p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {uploadState.isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex items-center justify-center">
            <div className="w-full max-w-xs">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Đang upload...</span>
                <span>{uploadState.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadState.progress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Message */}
      {uploadState.success && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircleIcon className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-800">
            Upload thành công!
          </span>
        </div>
      )}

      {/* Error Message */}
      {uploadState.error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
            <span className="text-sm text-red-800">
              {uploadState.error}
            </span>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
