'use client';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { GET_APPS } from '@/lib/graphql/queries';
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

  const apps = data?.apps || [];
  const totalViews = apps.reduce((sum: number, app: any) => sum + app.viewCount, 0);
  const totalLikes = apps.reduce((sum: number, app: any) => sum + app.likeCount, 0);
  const publishedApps = apps.filter((app: any) => app.status === 'published').length;
  const draftApps = apps.filter((app: any) => app.status === 'draft').length;

  const stats = [
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your Showcase Apps platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Apps */}
      <div className="card p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Apps</h2>
        {apps.length === 0 ? (
          <p className="text-gray-500">No apps created yet.</p>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    App
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apps.slice(0, 10).map((app: any) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{app.title}</div>
                        <div className="text-sm text-gray-500">{app.shortDesc}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          app.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : app.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {app.viewCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
