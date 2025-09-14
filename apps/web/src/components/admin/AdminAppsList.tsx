'use client';

import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Pagination } from '@/components/ui/Pagination';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants';
import { DELETE_APP, GET_APPS_PAGINATED } from '@/lib/graphql/queries';
import { normalizeApps } from '@/lib/utils/app';
import { APP_STATUS_OPTIONS, APP_VISIBILITY_OPTIONS, getAppPlatformDisplay, getAppStatusBadgeColor, getAppStatusDisplay, getAppVisibilityBadgeColor, getAppVisibilityDisplay } from '@/lib/utils/enum-display';
import { useMutation, useQuery } from '@apollo/client';
import {
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function AdminAppsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    appId: string;
    appTitle: string;
  }>({
    isOpen: false,
    appId: '',
    appTitle: '',
  });

  const { data, loading, error } = useQuery(GET_APPS_PAGINATED, {
    variables: {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search: searchTerm || undefined,
      category: statusFilter !== 'all' ? statusFilter : undefined,
    },
  });

  const [deleteApp, { loading: isDeleting }] = useMutation(DELETE_APP, {
    onCompleted: () => {
      toast.success('App deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting app:', error);
      toast.error('Failed to delete app');
    },
    refetchQueries: [
      {
        query: GET_APPS_PAGINATED,
        variables: {
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
          search: searchTerm || undefined,
          category: statusFilter !== 'all' ? statusFilter : undefined,
        },
      },
    ],
    awaitRefetchQueries: true,
  });

  const handleDeleteApp = (appId: string, appTitle: string) => {
    setDeleteModal({
      isOpen: true,
      appId,
      appTitle,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteApp({ variables: { id: deleteModal.appId } });
      setDeleteModal({ isOpen: false, appId: '', appTitle: '' });
    } catch (error) {
      console.error('Error deleting app:', error);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, appId: '', appTitle: '' });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

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

  const filteredApps = normalizeApps(data?.appsPaginated?.items || []);
  const paginationData = data?.appsPaginated || {
    totalCount: 0,
    limit: DEFAULT_PAGE_SIZE,
    offset: 0,
  };

  // Calculate total pages
  const totalPages = Math.ceil(paginationData.totalCount / paginationData.limit);
  const currentPageFromData = Math.floor(paginationData.offset / paginationData.limit) + 1;

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
          className="btn-primary inline-flex items-center space-x-2 p-2"
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
              autoComplete="off"
            />
          </div>

          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input w-full"
            >
              <option value="all">All Status</option>
              {APP_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:w-48">
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value)}
              className="input w-full"
            >
              <option value="all">All Visibility</option>
              {APP_VISIBILITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
                    Visibility
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
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAppStatusBadgeColor(app.status)}`}
                      >
                        {getAppStatusDisplay(app.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAppVisibilityBadgeColor(app.visibility)}`}
                      >
                        {getAppVisibilityDisplay(app.visibility)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {app.platforms.slice(0, 2).map((platform: string) => (
                          <span
                            key={platform}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
                          >
                            {getAppPlatformDisplay(platform)}
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
                          onClick={() => handleDeleteApp(app.id, app.title)}
                          disabled={isDeleting}
                          className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Pagination */}
      <Pagination
        currentPage={currentPageFromData}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pageSize={paginationData.limit}
        totalItems={paginationData.totalCount}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        showPageSizeSelector={true}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete App"
        message={`Are you sure you want to delete "${deleteModal.appTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
