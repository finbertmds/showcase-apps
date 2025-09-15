import { TimelineEvent } from '@/types';
import {
  ArrowPathIcon,
  BugAntIcon,
  MegaphoneIcon,
  RocketLaunchIcon,
  SparklesIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface AppTimelineProps {
  events: TimelineEvent[];
  loading: boolean;
}

export function AppTimeline({ events, loading }: AppTimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'RELEASE':
        return <RocketLaunchIcon className="h-5 w-5" />;
      case 'UPDATE':
        return <ArrowPathIcon className="h-5 w-5" />;
      case 'MILESTONE':
        return <StarIcon className="h-5 w-5" />;
      case 'ANNOUNCEMENT':
        return <MegaphoneIcon className="h-5 w-5" />;
      case 'FEATURE':
        return <SparklesIcon className="h-5 w-5" />;
      case 'BUGFIX':
        return <BugAntIcon className="h-5 w-5" />;
      default:
        return <MegaphoneIcon className="h-5 w-5" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'RELEASE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'MILESTONE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ANNOUNCEMENT':
        return 'bg-purple-100 text-purple-800';
      case 'FEATURE':
        return 'bg-indigo-100 text-indigo-800';
      case 'BUGFIX':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No timeline events yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event, index) => (
        <div key={event.id} className="relative">
          {/* Timeline line */}
          {index !== events.length - 1 && (
            <div className="absolute left-5 top-10 w-0.5 h-16 bg-gray-200" />
          )}

          <div className="flex items-start space-x-4">
            {/* Event icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getEventColor(event.type)}`}>
              {getEventIcon(event.type)}
            </div>

            {/* Event content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                {event.version && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    v{event.version}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                <span>{formatDate(event.date)}</span>
                <span>•</span>
                <span className="capitalize">{event.type}</span>
              </div>

              {event.description && (
                <p className="text-gray-600 mb-3">{event.description}</p>
              )}

              {event.url && (
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Learn more
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
