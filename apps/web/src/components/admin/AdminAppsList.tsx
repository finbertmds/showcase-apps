'use client';

import { AdminListHeader } from '@/components/admin/shared/AdminListHeader';
import { AdminSearchAndFilter } from '@/components/admin/shared/AdminSearchAndFilter';
import { AdminTable, TableColumn } from '@/components/admin/shared/AdminTable';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Pagination } from '@/components/ui/Pagination';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants';
import { DELETE_APP, GET_APPS_PAGINATED } from '@/lib/graphql/queries';
// No normalization needed - backend now uses uppercase values
import { APP_STATUS_OPTIONS, APP_VISIBILITY_OPTIONS, getAppPlatformDisplay, getAppStatusBadgeColor, getAppStatusDisplay, getAppVisibilityBadgeColor, getAppVisibilityDisplay } from '@/lib/utils/enum-display';
import { App } from '@/types';
import { useMutation, useQuery } from '@apollo/client';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function AdminAppsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
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

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, loading, error } = useQuery(GET_APPS_PAGINATED, {
    variables: {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search: debouncedSearchTerm || undefined,
      category: statusFilter !== 'all' ? statusFilter : undefined,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
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
          search: debouncedSearchTerm || undefined,
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

  const filteredApps = data?.appsPaginated?.items || [];
  const paginationData = data?.appsPaginated || {
    totalCount: 0,
    limit: DEFAULT_PAGE_SIZE,
    offset: 0,
  };

  // Calculate total pages
  const totalPages = Math.ceil(paginationData.totalCount / paginationData.limit);
  const currentPageFromData = Math.floor(paginationData.offset / paginationData.limit) + 1;

  // Define table columns
  const columns: TableColumn<App>[] = [
    {
      key: 'logo',
      header: 'Logo',
      render: (app) => (
        app.logoUrl ? (
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
        )
      ),
    },
    {
      key: 'app',
      header: 'App',
      render: (app) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{app.title}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">{app.shortDesc}</div>
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
      key: 'platforms',
      header: 'Platforms',
      render: (app) => (
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
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (app) => (
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
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminListHeader
        title="Apps"
        description="Manage your applications"
        actionButton={{
          href: "/admin/apps/new",
          text: "New App"
        }}
      />

      {/* Search and Filters */}
      <AdminSearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search apps..."
        loading={loading}
        filters={[
          {
            value: statusFilter,
            onChange: setStatusFilter,
            options: APP_STATUS_OPTIONS,
            placeholder: "All Status"
          },
          {
            value: visibilityFilter,
            onChange: setVisibilityFilter,
            options: APP_VISIBILITY_OPTIONS,
            placeholder: "All Visibility"
          }
        ]}
      />

      {/* Apps Table */}
      <AdminTable
        data={filteredApps}
        columns={columns}
        emptyMessage="No apps found."
        loading={loading}
      />

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
