import { App } from '@/types';
import {
    BuildingOfficeIcon,
    CalendarIcon,
    CodeBracketIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon,
    GlobeAltIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface AppInfoProps {
  app: App;
}

export function AppInfo({ app }: AppInfoProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios':
      case 'android':
        return <DevicePhoneMobileIcon className="h-5 w-5" />;
      case 'desktop':
        return <ComputerDesktopIcon className="h-5 w-5" />;
      case 'web':
        return <GlobeAltIcon className="h-5 w-5" />;
      case 'api':
        return <CodeBracketIcon className="h-5 w-5" />;
      default:
        return <GlobeAltIcon className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  return (
    <div className="space-y-4">
      {/* Platforms */}
      {app.platforms.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Platforms</h3>
          <div className="flex flex-wrap gap-2">
            {app.platforms.map((platform) => (
              <div
                key={platform}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700"
              >
                {getPlatformIcon(platform)}
                <span className="capitalize">{platform}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {app.languages.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {app.languages.map((language) => (
              <span
                key={language}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {app.tags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {app.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <UserIcon className="h-4 w-4" />
          <span>Created by {app.createdBy}</span>
        </div>
        
        {app.organizationId && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <BuildingOfficeIcon className="h-4 w-4" />
            <span>{app.organizationId}</span>
          </div>
        )}
        
        {app.releaseDate && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4" />
            <span>Released {formatDate(app.releaseDate)}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4" />
          <span>Added {formatDate(app.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
