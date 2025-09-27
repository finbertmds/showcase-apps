'use client';

import { PaginationControls } from '@/components/ui/PaginationControls';
import { App } from '@/types';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { AppCard } from './AppCard';

interface AppsGridProps {
  apps: App[];
  loading: boolean;
  error: any;
  currentPage: number;
  totalPages: number;
  totalApps: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function AppsGrid({
  apps,
  loading,
  error,
  currentPage,
  totalPages,
  totalApps,
  itemsPerPage,
  onPageChange,
  onRetry,
  hasActiveFilters,
  onClearFilters,
}: AppsGridProps) {
  // Loading State
  if (loading && !apps.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mt-1"></div>
              </div>
            </div>
            <div className="flex space-x-2 mb-4">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-12">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Failed to load apps
        </h3>
        <p className="text-gray-600 mb-4">
          There was an error loading the apps. Please try again.
        </p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty State
  if (!loading && !error && apps.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No apps found
        </h3>
        <p className="text-gray-600 mb-4">
          {hasActiveFilters
            ? 'Try adjusting your search or filters to find more apps.'
            : 'No apps are available at the moment. Check back later!'
          }
        </p>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  // Apps Grid
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {apps.map((app: App) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalApps}
          itemsPerPage={itemsPerPage}
        />
      )}
    </>
  );
}
