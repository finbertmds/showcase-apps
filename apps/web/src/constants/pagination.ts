/**
 * Pagination Constants
 * Centralized management of pagination-related constants
 */

// Default page sizes
export const PAGE_SIZES = {
  SMALL: 10,
  MEDIUM: 20,
  LARGE: 50,
  EXTRA_LARGE: 100,
} as const;

// Default page size for admin lists
export const DEFAULT_PAGE_SIZE = PAGE_SIZES.SMALL; // 20
export const DEFAULT_TIMELINE_PAGE_SIZE = PAGE_SIZES.SMALL;

// Page size options for selectors
export const PAGE_SIZE_OPTIONS: number[] = [
  PAGE_SIZES.SMALL,
  PAGE_SIZES.MEDIUM,
  PAGE_SIZES.LARGE,
  PAGE_SIZES.EXTRA_LARGE,
];

// Default pagination values
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  PAGE_SIZE: DEFAULT_PAGE_SIZE,
  OFFSET: 0,
} as const;

// Pagination limits
export const PAGINATION_LIMITS = {
  MAX_PAGE_SIZE: 1000,
  MIN_PAGE_SIZE: 1,
  MAX_PAGE: 10000,
  MIN_PAGE: 1,
} as const;

// Pagination display settings
export const PAGINATION_DISPLAY = {
  DELTA: 1, // Number of pages to show on each side of current page
} as const;
