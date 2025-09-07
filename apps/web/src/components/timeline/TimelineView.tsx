'use client';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { GET_TIMELINE_APPS } from '@/lib/graphql/queries';
import { App } from '@/types';
import { useQuery } from '@apollo/client';
import { TimelineItem } from './TimelineItem';

export function TimelineView() {
  const { data, loading, error, fetchMore } = useQuery(GET_TIMELINE_APPS, {
    variables: { limit: 20, offset: 0 },
    notifyOnNetworkStatusChange: true,
  });

  if (loading && !data) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading timeline: {error.message}</p>
      </div>
    );
  }

  const apps: App[] = data?.timelineApps || [];

  if (apps.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No apps found. Check back later!</p>
      </div>
    );
  }

  const loadMore = () => {
    fetchMore({
      variables: {
        offset: apps.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          timelineApps: [...prev.timelineApps, ...fetchMoreResult.timelineApps],
        };
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-8">
        {apps.map((app, index) => (
          <TimelineItem key={app.id} app={app} index={index} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {!loading && apps.length > 0 && (
        <div className="text-center py-8">
          <button
            onClick={loadMore}
            className="btn-outline px-6 py-3"
          >
            Load More Apps
          </button>
        </div>
      )}
    </div>
  );
}
