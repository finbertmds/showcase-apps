'use client';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { GET_APPS } from '@/lib/graphql/queries';
import { useQuery } from '@apollo/client';
import {
    EyeIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';

export function AdminAppsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, loading, error } = useQuery(GET_APPS, {
    variables: { 
      limit: 100,
      ...(statusFilter !== 'all' && { status: statusFilter }),
    },
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
        <p className="text-red-600">Error loading apps: {error.message}</p>
      </div>
    );
  }

  const apps = data?.apps || [];
  const filteredApps = apps.filter((app: any) =>
    app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.shortDesc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apps</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your applications
          </p>
        </div>
        
        <Link
          href="/admin/apps/new"
          className="btn-primary inline-flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>New App</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search apps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full"
            />
          </div>
          
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-full"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Apps Table */}
      <div className="card overflow-hidden">
        {filteredApps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No apps found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                    Platforms
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApps.map((app: any) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{app.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{app.shortDesc}</div>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {app.platforms.slice(0, 2).map((platform: string) => (
                          <span
                            key={platform}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
                          >
                            {platform}
                          </span>
                        ))}
                        {app.platforms.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{app.platforms.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {app.viewCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/apps/${app.slug}`}
                          target="_blank"
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="View app"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        
                        <Link
                          href={`/admin/apps/${app.id}/edit`}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit app"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        
                        <button
                          className="text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete app"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
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
