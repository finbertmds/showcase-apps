'use client';

import { formatDate } from '@/lib/utils/date';
import { getAppPlatformIcon } from '@/lib/utils/enum-display';
import { App } from '@/types';
import {
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface AppCardProps {
  app: App;
  className?: string;
}

export function AppCard({ app, className = '' }: AppCardProps) {
  return (
    <Link
      href={`/apps/${app.slug}`}
      className={`group block bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="p-6">
        {/* App Logo */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="flex-shrink-0">
            {app.logoUrl ? (
              <img
                src={app.logoUrl}
                alt={`${app.title} logo`}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                <span className="text-lg font-semibold text-gray-600">
                  {app.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              {app.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
              {app.shortDesc || 'No description available'}
            </p>
          </div>
        </div>

        {/* Tags */}
        {app.tags && app.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {app.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                {tag}
              </span>
            ))}
            {app.tags.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{app.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Platforms */}
        {app.platforms && app.platforms.length > 0 && (
          <div className="flex items-center space-x-2 mb-4">
            {app.platforms.slice(0, 3).map((platform, index) => {
              const IconComponent = getAppPlatformIcon(platform);
              return (
                <div key={index} className="flex items-center space-x-1">
                  <IconComponent className="h-4 w-4 text-gray-500" />
                  <span className="text-xs text-gray-500 capitalize">{platform.toLowerCase()}</span>
                </div>
              );
            })}
            {app.platforms.length > 3 && (
              <span className="text-xs text-gray-500">+{app.platforms.length - 3} more</span>
            )}
          </div>
        )}

        {/* Stats and Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <EyeIcon className="h-4 w-4" />
              <span>{app.viewCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <HeartIcon className="h-4 w-4" />
              <span>{app.likeCount || 0}</span>
            </div>
          </div>

          {app.releaseDate && (
            <div className="flex items-center space-x-1">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatDate(app.releaseDate)}</span>
            </div>
          )}
        </div>

        {/* Author */}
        {app.createdByUser && (
          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
            <UserIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              by {app.createdByUser.name}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
