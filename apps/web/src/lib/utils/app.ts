import { AppFormData } from './app-form';

/**
 * No normalization needed - backend now uses uppercase values
 * App data comes directly from API with correct uppercase enum values
 */

/**
 * Convert ISO date string to YYYY-MM-DD format for date inputs
 */
export function formatDateForInput(isoDateString: string | null | undefined): string {
  if (!isoDateString) return '';
  try {
    return new Date(isoDateString).toISOString().split('T')[0];
  } catch (error) {
    console.warn('Invalid date string:', isoDateString);
    return '';
  }
}

/**
 * Convert YYYY-MM-DD format to ISO date string for API
 */
export function formatDateForAPI(dateString: string | null | undefined): string | null {
  if (!dateString) return null;
  try {
    return new Date(dateString).toISOString();
  } catch (error) {
    console.warn('Invalid date string:', dateString);
    return null;
  }
}

/**
 * Get Tailwind CSS classes for status badge color
 */
export function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'PUBLISHED':
      return 'bg-green-100 text-green-800';
    case 'DRAFT':
      return 'bg-yellow-100 text-yellow-800';
    case 'ARCHIVED':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get Tailwind CSS classes for visibility badge color
 */
export function getVisibilityBadgeColor(visibility: string): string {
  switch (visibility) {
    case 'PUBLIC':
      return 'bg-blue-100 text-blue-800';
    case 'PRIVATE':
      return 'bg-red-100 text-red-800';
    case 'UNLISTED':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get display text for status
 */
/**
 * Display text functions moved to enum-display.ts for consistency
 * Use getAppStatusDisplay, getAppVisibilityDisplay from enum-display.ts instead
 */

// No conversion needed - frontend now uses uppercase values directly

/**
 * Check if a string value is empty (null, undefined, or empty string after trim)
 */
export function isEmptyString(value: string | null | undefined): boolean {
  return !value || value.trim() === '';
}

/**
 * Convert empty string to null for optional fields
 */
export function emptyStringToNull(value: string | null | undefined): string | null {
  return isEmptyString(value) ? null : (value || null);
}

/**
 * Prepare app data for API - no conversion needed since frontend uses uppercase values
 * Only filter out empty optional fields
 */
export function prepareAppDataForAPI(appData: AppFormData): AppFormData {
  const result: AppFormData = {
    // Required fields
    title: appData.title,
    slug: appData.slug,
    shortDesc: appData.shortDesc,
    longDesc: appData.longDesc,
    status: appData.status, // Already uppercase
    visibility: appData.visibility, // Already uppercase
    platforms: appData.platforms, // Already uppercase
    languages: appData.languages,
    tags: appData.tags,
  };

  // Optional fields - only include if they have actual values
  if (!isEmptyString(appData.releaseDate)) {
    result.releaseDate = appData.releaseDate;
  }

  if (!isEmptyString(appData.website)) {
    result.website = appData.website;
  }

  if (!isEmptyString(appData.repository)) {
    result.repository = appData.repository;
  }

  if (!isEmptyString(appData.demoUrl)) {
    result.demoUrl = appData.demoUrl;
  }

  if (!isEmptyString(appData.downloadUrl)) {
    result.downloadUrl = appData.downloadUrl;
  }

  if (!isEmptyString(appData.appStoreUrl)) {
    result.appStoreUrl = appData.appStoreUrl;
  }

  if (!isEmptyString(appData.playStoreUrl)) {
    result.playStoreUrl = appData.playStoreUrl;
  }

  return result;
}
