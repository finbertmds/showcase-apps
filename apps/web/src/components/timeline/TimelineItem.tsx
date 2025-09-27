'use client';

import { useAuth } from '@/contexts/AuthContext';
import {
  INCREMENT_APP_LIKE,
  INCREMENT_APP_VIEW
} from '@/lib/graphql/queries';
import { formatDate } from '@/lib/utils/date';
import { getAppPlatformIcon } from '@/lib/utils/enum-display';
import { App } from '@/types';
import { useMutation } from '@apollo/client';
import {
  EyeIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { EyeIcon as EyeSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useState } from 'react';

interface TimelineItemProps {
  app: App;
  index: number;
}

export function TimelineItem({ app, index }: TimelineItemProps) {
  const [incrementView] = useMutation(INCREMENT_APP_VIEW);
  const [incrementLike] = useMutation(INCREMENT_APP_LIKE);
  const { user } = useAuth();

  // Local state to track interactions
  const [localIsLiked, setLocalIsLiked] = useState(app.userLiked || false);
  const [localIsViewed, setLocalIsViewed] = useState(app.userViewed || false);

  // Use local state if available, otherwise fallback to API response
  const isLiked = localIsLiked;
  const isViewed = localIsViewed;

  const handleView = async () => {
    // Always allow navigation to app details page
    // Only increment view count if user is logged in and hasn't viewed yet
    if (user && !isViewed) {
      try {
        const result = await incrementView({
          variables: { id: app.id }
        });
        if (result.data?.incrementAppView) {
          // Automatically update local state to show viewed
          setLocalIsViewed(true);
        }
      } catch (error) {
        console.error('Error incrementing view:', error);
      }
    }
  };

  const handleLike = async () => {
    if (!user) {
      // User not logged in - could show login modal or redirect
      console.log('Please login to like apps');
      return;
    }

    if (!isLiked) {
      try {
        const result = await incrementLike({
          variables: { id: app.id }
        });
        if (result.data?.incrementAppLike) {
          // Automatically update local state to show liked
          setLocalIsLiked(true);
        }
      } catch (error) {
        console.error('Error incrementing like:', error);
      }
    }
  };

  const getPlatformIcon = (platform: string) => {
    const IconComponent = getAppPlatformIcon(platform);
    return <IconComponent className="h-4 w-4" />;
  };


  return (
    <div className="relative">
      {/* Timeline line - connects to previous dot */}
      {index !== 0 && (
        <div className="absolute left-4 top-0 w-0.5 bg-gray-300 -translate-y-full"
          style={{ height: 'calc(100% + 2rem)' }} />
      )}

      <div className="relative flex items-start space-x-4">
        {/* Timeline dot */}
        <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center relative z-10">
          <div className="w-3 h-3 bg-white rounded-full" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="card p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  {/* App Logo */}
                  <div className="flex-shrink-0">
                    {app.logoUrl ? (
                      <img
                        src={app.logoUrl}
                        alt={`${app.title} logo`}
                        className="w-8 h-8 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs font-medium">
                          {app.title.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

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
                  </div>
                </div>

                <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  {/* Author and Organization */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      {/* User Avatar */}
                      {app.createdByUser?.avatar ? (
                        <img
                          src={app.createdByUser.avatar}
                          alt={app.createdByUser?.name || "User"}
                          className="w-6 h-6 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-white">
                            {(app.createdByUser?.name || "U").charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {app.createdByUser?.name || "Unknown"}
                      </span>
                    </div>

                    {app.organization && (
                      <>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1.5">
                          {/* Organization Logo */}
                          {app.organization.logo ? (
                            <img
                              src={app.organization.logo}
                              alt={app.organization.name}
                              className="w-4 h-4 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {app.organization.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <span className="text-sm text-gray-600 font-medium">
                            {app.organization.name}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Release Date */}
                  {app.releaseDate && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(app.releaseDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  disabled={!user}
                  className={`flex items-center space-x-1 text-sm ${!user
                    ? 'text-gray-300 cursor-not-allowed'
                    : isLiked
                      ? 'text-red-500'
                      : 'text-gray-500 hover:text-red-500'
                    } transition-colors`}
                  title={!user ? 'Please login to like apps' : ''}
                >
                  {isLiked ? (
                    <HeartSolidIcon className="h-4 w-4" />
                  ) : (
                    <HeartIcon className="h-4 w-4" />
                  )}
                  <span>{app.likeCount + (isLiked ? 1 : 0)}</span>
                </button>

                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  {isViewed ? (
                    <EyeSolidIcon className="h-4 w-4 text-blue-500" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
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
