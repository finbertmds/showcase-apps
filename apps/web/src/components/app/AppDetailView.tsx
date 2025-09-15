'use client';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { GET_APP_BY_SLUG, GET_TIMELINE_EVENTS_BY_APP } from '@/lib/graphql/queries';
import { App } from '@/types';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { AppActions } from './AppActions';
import { AppInfo } from './AppInfo';
import { AppTimeline } from './AppTimeline';
import MediaDisplay from './MediaDisplay';

interface AppDetailViewProps {
  slug: string;
}

export function AppDetailView({ slug }: AppDetailViewProps) {
  const { data: appData, loading: appLoading, error: appError } = useQuery(GET_APP_BY_SLUG, {
    variables: { slug },
  });

  const { data: timelineData, loading: timelineLoading } = useQuery(GET_TIMELINE_EVENTS_BY_APP, {
    variables: { appId: appData?.appBySlug?.id, isPublic: true },
    skip: !appData?.appBySlug?.id,
  });

  const app = appData?.appBySlug as App;
  const timelineEvents = timelineData?.timelineEventsByApp || [];

  // Increment view count when component mounts
  useEffect(() => {
    if (app?.id) {
      // You would call the increment view mutation here
      // For now, we'll just log it
      console.log('Incrementing view count for app:', app.id);
    }
  }, [app?.id]);

  if (appLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (appError || !app) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">App Not Found</h1>
        <p className="text-gray-600">The app you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* App Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{app.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{app.shortDesc}</p>

            <AppInfo app={app} />
            <AppActions app={app} />
          </div>

          {/* Media Display */}
          <div className="space-y-8">
            {/* Logos */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Logos</h2>
              <MediaDisplay
                appId={app.id}
                type="LOGO"
                showLightbox={true}
                maxItems={1}
              />
            </div>

            {/* Screenshots */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Screenshots</h2>
              <MediaDisplay
                appId={app.id}
                type="SCREENSHOT"
                showLightbox={true}
                maxItems={6}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">About</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 whitespace-pre-wrap">{app.longDesc}</p>
        </div>
      </div>

      {/* Timeline */}
      {timelineEvents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Timeline</h2>
          <AppTimeline
            events={timelineEvents}
            loading={timelineLoading}
          />
        </div>
      )}
    </div>
  );
}
