'use client';

import { AdminListHeader } from '@/components/admin/shared/AdminListHeader';
import { AdminStatsGrid, StatItem } from '@/components/admin/shared/AdminStatsGrid';
import { AdminTable, TableColumn } from '@/components/admin/shared/AdminTable';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DASHBOARD_DISPLAY } from '@/constants';
import { GET_APPS } from '@/lib/graphql/queries';
// No normalization needed - backend now uses uppercase values
import { getAppStatusBadgeColor, getAppStatusDisplay, getAppVisibilityBadgeColor, getAppVisibilityDisplay } from '@/lib/utils/enum-display';
import { useQuery } from '@apollo/client';
import {
  EyeIcon,
  HeartIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';

export function AdminDashboard() {
  const { data, loading, error } = useQuery(GET_APPS, {
    variables: { limit: 100 },
  });

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading dashboard data: {error.message}</p>
      </div>
    );
  }

  let apps = data?.apps || [];
  const totalViews = apps.reduce((sum: number, app: any) => sum + app.viewCount, 0);
  const totalLikes = apps.reduce((sum: number, app: any) => sum + app.likeCount, 0);
  const publishedApps = apps.filter((app: any) => app.status === 'PUBLISHED').length;
  const draftApps = apps.filter((app: any) => app.status === 'DRAFT').length;

  // Define table columns for recent apps
  const columns: TableColumn<any>[] = [
    {
      key: 'app',
      header: 'App',
      render: (app) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{app.title}</div>
          <div className="text-sm text-gray-500">{app.shortDesc}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (app) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAppStatusBadgeColor(app.status)}`}
        >
          {getAppStatusDisplay(app.status)}
        </span>
      ),
    },
    {
      key: 'visibility',
      header: 'Visibility',
      render: (app) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAppVisibilityBadgeColor(app.visibility)}`}
        >
          {getAppVisibilityDisplay(app.visibility)}
        </span>
      ),
    },
    {
      key: 'views',
      header: 'Views',
      render: (app) => (
        <span className="text-sm text-gray-900">{app.viewCount}</span>
      ),
    },
    {
      key: 'created',
      header: 'Created',
      render: (app) => (
        <span className="text-sm text-gray-500">
          {new Date(app.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const stats: StatItem[] = [
    {
      name: 'Total Apps',
      value: apps.length,
      icon: Squares2X2Icon,
      color: 'bg-blue-500',
    },
    {
      name: 'Published Apps',
      value: publishedApps,
      icon: Squares2X2Icon,
      color: 'bg-green-500',
    },
    {
      name: 'Draft Apps',
      value: draftApps,
      icon: Squares2X2Icon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Total Views',
      value: totalViews.toLocaleString(),
      icon: EyeIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Total Likes',
      value: totalLikes.toLocaleString(),
      icon: HeartIcon,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <AdminListHeader
        title="Dashboard"
        description="Overview of your Showcase Apps platform"
      />

      {/* Stats Grid */}
      <AdminStatsGrid stats={stats} />

      {/* Recent Apps */}
      <div className="card p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Apps</h2>
        <AdminTable
          data={apps.slice(0, DASHBOARD_DISPLAY.RECENT_APPS_LIMIT)}
          columns={columns}
          emptyMessage="No apps created yet."
          loading={loading}
        />
      </div>
    </div>
  );
}
