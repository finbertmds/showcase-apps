'use client';

import { INCREMENT_APP_LIKE, INCREMENT_APP_VIEW } from '@/lib/graphql/queries';
import { App } from '@/types';
import { useMutation } from '@apollo/client';
import {
    CodeBracketIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon,
    EyeIcon,
    GlobeAltIcon,
    HeartIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import Link from 'next/link';
import { useState } from 'react';

interface TimelineItemProps {
  app: App;
  index: number;
}

export function TimelineItem({ app, index }: TimelineItemProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [incrementView] = useMutation(INCREMENT_APP_VIEW);
  const [incrementLike] = useMutation(INCREMENT_APP_LIKE);

  const handleView = () => {
    incrementView({ variables: { id: app.id } });
  };

  const handleLike = () => {
    if (!isLiked) {
      incrementLike({ variables: { id: app.id } });
      setIsLiked(true);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios':
      case 'android':
        return <DevicePhoneMobileIcon className="h-4 w-4" />;
      case 'desktop':
        return <ComputerDesktopIcon className="h-4 w-4" />;
      case 'web':
        return <GlobeAltIcon className="h-4 w-4" />;
      case 'api':
        return <CodeBracketIcon className="h-4 w-4" />;
      default:
        return <GlobeAltIcon className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      {index !== 0 && (
        <div className="absolute left-4 top-0 w-0.5 h-8 bg-gray-300 -translate-y-8" />
      )}
      
      <div className="relative flex items-start space-x-4">
        {/* Timeline dot */}
        <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="card p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Link 
                  href={`/apps/${app.slug}`}
                  onClick={handleView}
                  className="group"
                >
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {app.title}
                  </h3>
                </Link>
                
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                  <span>by {app.createdBy.name}</span>
                  {app.releaseDate && (
                    <span>• {formatDate(app.releaseDate)}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 text-sm ${
                    isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  } transition-colors`}
                >
                  {isLiked ? (
                    <HeartSolidIcon className="h-4 w-4" />
                  ) : (
                    <HeartIcon className="h-4 w-4" />
                  )}
                  <span>{app.likeCount + (isLiked ? 1 : 0)}</span>
                </button>
                
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <EyeIcon className="h-4 w-4" />
                  <span>{app.viewCount}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="mt-3 text-gray-600 line-clamp-2">
              {app.shortDesc}
            </p>

            {/* Platforms */}
            {app.platforms.length > 0 && (
              <div className="mt-4 flex items-center space-x-2">
                <span className="text-sm text-gray-500">Platforms:</span>
                <div className="flex items-center space-x-2">
                  {app.platforms.map((platform) => (
                    <div
                      key={platform}
                      className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700"
                    >
                      {getPlatformIcon(platform)}
                      <span className="capitalize">{platform}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {app.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {app.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {tag}
                  </span>
                ))}
                {app.tags.length > 5 && (
                  <span className="text-xs text-gray-500">
                    +{app.tags.length - 5} more
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex items-center space-x-4">
              <Link
                href={`/apps/${app.slug}`}
                onClick={handleView}
                className="btn-primary px-4 py-2"
              >
                View Details
              </Link>
              
              {app.demoUrl && (
                <a
                  href={app.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline px-4 py-2"
                >
                  Try Demo
                </a>
              )}
              
              {app.downloadUrl && (
                <a
                  href={app.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline px-4 py-2"
                >
                  Download
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
