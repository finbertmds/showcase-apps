'use client';

import { AppsGrid } from '@/components/app/AppsGrid';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { FilterSidebar } from '@/components/ui/FilterSidebar';
import { SearchBar } from '@/components/ui/SearchBar';
import { PLATFORM_OPTIONS } from '@/lib/config/platforms';
import { GET_ALL_TAGS, LIST_APPS } from '@/lib/graphql/queries';
import { App } from '@/types';
import { useQuery } from '@apollo/client';
import {
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';

const ITEMS_PER_PAGE = 12;

interface FilterSection {
  title: string;
  options: { value: string; label: string; count?: number }[];
  type: 'checkbox' | 'radio';
  key: string;
}

export default function AppsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // GraphQL queries
  const { data, loading, error, refetch } = useQuery(LIST_APPS, {
    variables: {
      search: searchQuery || undefined,
      tags: selectedFilters.tags?.length ? selectedFilters.tags : undefined,
      platforms: selectedFilters.platforms?.length ? selectedFilters.platforms : undefined,
      status: 'PUBLISHED', // Only show published apps
      visibility: 'PUBLIC',
      limit: ITEMS_PER_PAGE,
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
    },
    fetchPolicy: 'cache-and-network',
  });

  const { data: tagsData } = useQuery(GET_ALL_TAGS, {
    fetchPolicy: 'cache-first',
  });

  // Extract apps and total count
  const apps = data?.apps || [];
  const totalApps = data?.apps?.length || 0;

  // Generate filter options from apps data and API
  const filterSections: FilterSection[] = useMemo(() => {
    // Get all tags from API
    const allTagsFromAPI = tagsData?.getAllTags || [];
    const tagOptions = allTagsFromAPI.map((tag: string) => {
      // Count how many apps have this tag
      const count = apps.filter((app: App) => app.tags?.includes(tag)).length;
      return {
        value: tag,
        label: tag,
        count,
      };
    });

    // Get platforms from config and count usage
    const platformOptions = PLATFORM_OPTIONS.map((platform) => {
      const count = apps.filter((app: App) => app.platforms?.includes(platform.value)).length;
      return {
        value: platform.value,
        label: platform.label,
        count,
      };
    });

    return [
      {
        title: 'Platforms',
        options: platformOptions,
        type: 'checkbox',
        key: 'platforms',
      },
      {
        title: 'Tags',
        options: tagOptions,
        type: 'checkbox',
        key: 'tags',
      },
    ];
  }, [apps, tagsData]);

  // Handle filter changes
  const handleFilterChange = (sectionKey: string, values: string[]) => {
    setSelectedFilters(prev => ({
      ...prev,
      [sectionKey]: values,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle search input change (for typing)
  const handleSearchInputChange = (input: string) => {
    setSearchInput(input);
  };

  // Handle search execution (on Enter)
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({});
    setSearchQuery('');
    setSearchInput('');
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(selectedFilters).some(values => values.length > 0) || !!searchQuery;

  // Calculate total pages
  const totalPages = Math.ceil(totalApps / ITEMS_PER_PAGE);

  return (
    <MainLayout>
      <PageHeader />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                  {Object.values(selectedFilters).flat().length + (searchQuery ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Filters</h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 overflow-y-auto h-full">
                  <FilterSidebar
                    sections={filterSections}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-8">
              <FilterSidebar
                sections={filterSections}
                selectedFilters={selectedFilters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Active Filters */}
            <div className="mb-6 space-y-4">
              <SearchBar
                value={searchInput}
                onChange={handleSearchInputChange}
                onSearch={handleSearch}
                placeholder="Search apps by name, description, or tags..."
                className="w-full"
              />

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="text-sm text-gray-600">Active filters:</span>

                  {searchQuery && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                      Search: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery('')}
                        className="ml-2 hover:text-primary-900"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  )}

                  {Object.entries(selectedFilters).map(([key, values]) =>
                    values.map(value => (
                      <span
                        key={`${key}-${value}`}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                      >
                        {key}: {value}
                        <button
                          onClick={() => {
                            const newValues = values.filter(v => v !== value);
                            handleFilterChange(key, newValues);
                          }}
                          className="ml-2 hover:text-gray-900"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))
                  )}

                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Apps Grid */}
            <AppsGrid
              apps={apps}
              loading={loading}
              error={error}
              currentPage={currentPage}
              totalPages={totalPages}
              totalApps={totalApps}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
              onRetry={() => refetch()}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearAllFilters}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
