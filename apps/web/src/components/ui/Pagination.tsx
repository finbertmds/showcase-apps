'use client';

import { PAGINATION_DISPLAY } from '@/constants';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalItems: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
  onPageSizeChange,
  pageSizeOptions,
  showPageSizeSelector = true,
  className = '',
}: PaginationProps) {
  const [showPageSizeMenu, setShowPageSizeMenu] = useState(false);

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getVisiblePages = () => {
    const delta = PAGINATION_DISPLAY.DELTA; // Số trang hiển thị mỗi bên của trang hiện tại
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  // Always show pagination component

  return (
    <div className={`flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 ${className}`}>
      <div className="flex items-center justify-between w-full sm:w-auto">
        {/* Page size selector */}
        {showPageSizeSelector && onPageSizeChange && (
          <div className="relative mr-4">
            <button
              type="button"
              className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setShowPageSizeMenu(!showPageSizeMenu)}
            >
              {pageSize} per page
              <ChevronLeftIcon className="w-4 h-4 ml-2 -mr-1 rotate-90" />
            </button>

            {showPageSizeMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {pageSizeOptions?.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${pageSize === size ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                      }`}
                    onClick={() => {
                      onPageSizeChange(size);
                      setShowPageSizeMenu(false);
                    }}
                  >
                    {size} per page
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Items info */}
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </div>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <button
          type="button"
          className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        {/* Page numbers */}
        <div className="flex space-x-1">
          {visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`dots-${index}`}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300"
                >
                  ...
                </span>
              );
            }

            const pageNumber = page as number;
            const isCurrentPage = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                type="button"
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border ${isCurrentPage
                  ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  } focus:outline-none`}
                onClick={() => onPageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          type="button"
          className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
