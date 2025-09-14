import { App } from '@/types';
import { AppFormData } from './app-form';

/**
 * Normalize app status to lowercase
 */
export function normalizeAppStatus(status: string): string {
  return status.toLowerCase();
}

/**
 * Normalize app visibility to lowercase
 */
export function normalizeAppVisibility(visibility: string): string {
  return visibility.toLowerCase();
}

/**
 * Normalize app platforms to lowercase
 */
export function normalizeAppPlatforms(platforms: string[]): string[] {
  return platforms.map(platform => platform.toLowerCase());
}

/**
 * Normalize app data by converting all enum fields to lowercase
 */
export function normalizeApp(app: App): App {
  return {
    ...app,
    status: normalizeAppStatus(app.status) as 'draft' | 'published' | 'archived',
    visibility: normalizeAppVisibility(app.visibility) as 'public' | 'private' | 'unlisted',
    platforms: normalizeAppPlatforms(app.platforms),
  };
}

/**
 * Normalize array of apps by converting all enum fields to lowercase
 */
export function normalizeApps(apps: App[]): App[] {
  return apps.map(normalizeApp);
}

/**
 * Get Tailwind CSS classes for status badge color
 */
export function getStatusBadgeColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'published':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    case 'archived':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get Tailwind CSS classes for visibility badge color
 */
export function getVisibilityBadgeColor(visibility: string): string {
  switch (visibility.toLowerCase()) {
    case 'public':
      return 'bg-blue-100 text-blue-800';
    case 'private':
      return 'bg-red-100 text-red-800';
    case 'unlisted':
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

// API conversion functions (convert to uppercase for GraphQL API)
/**
 * Convert app status to uppercase for API
 */
export function convertAppStatusForAPI(status: string): string {
  return status.toUpperCase();
}

/**
 * Convert app visibility to uppercase for API
 */
export function convertAppVisibilityForAPI(visibility: string): string {
  return visibility.toUpperCase();
}

/**
 * Convert app platforms to uppercase for API
 */
export function convertAppPlatformsForAPI(platforms: string[]): string[] {
  return platforms.map(platform => platform.toUpperCase());
}

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
 * Convert app data for API by converting all enum fields to uppercase
 * and only including fields that have actual values (not empty strings)
 */
export function convertAppDataForAPI(appData: AppFormData): AppFormData {
  const result: AppFormData = {
    // Required fields
    title: appData.title,
    slug: appData.slug,
    shortDesc: appData.shortDesc,
    longDesc: appData.longDesc,
    status: convertAppStatusForAPI(appData.status) as 'draft' | 'published' | 'archived',
    visibility: convertAppVisibilityForAPI(appData.visibility) as 'public' | 'private' | 'unlisted',
    platforms: convertAppPlatformsForAPI(appData.platforms),
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
