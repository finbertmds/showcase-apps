/**
 * Enum Display Utilities
 * Centralized mapping of enum values to display text for consistent UI
 */

// Type definitions for enum options
export interface EnumOption {
  value: string;
  label: string;
}

// App Enums
export const APP_STATUS_DISPLAY = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
} as const;

export const APP_VISIBILITY_DISPLAY = {
  public: 'Public',
  private: 'Private',
  unlisted: 'Unlisted',
} as const;

export const APP_PLATFORM_DISPLAY = {
  web: 'Web',
  mobile: 'Mobile',
  desktop: 'Desktop',
  api: 'API',
} as const;

// User Enums
export const USER_ROLE_DISPLAY = {
  admin: 'Admin',
  developer: 'Developer',
  viewer: 'Viewer',
} as const;

export const USER_STATUS_DISPLAY = {
  active: 'Active',
  inactive: 'Inactive',
} as const;

// Organization Enums
export const ORGANIZATION_STATUS_DISPLAY = {
  active: 'Active',
  inactive: 'Inactive',
} as const;

// Utility functions to get display text
export function getAppStatusDisplay(status: string): string {
  return APP_STATUS_DISPLAY[status as keyof typeof APP_STATUS_DISPLAY] || status;
}

export function getAppVisibilityDisplay(visibility: string): string {
  return APP_VISIBILITY_DISPLAY[visibility as keyof typeof APP_VISIBILITY_DISPLAY] || visibility;
}

export function getAppPlatformDisplay(platform: string): string {
  return APP_PLATFORM_DISPLAY[platform as keyof typeof APP_PLATFORM_DISPLAY] || platform;
}

export function getUserRoleDisplay(role: string): string {
  return USER_ROLE_DISPLAY[role as keyof typeof USER_ROLE_DISPLAY] || role;
}

export function getUserStatusDisplay(isActive: boolean): string {
  return isActive ? USER_STATUS_DISPLAY.active : USER_STATUS_DISPLAY.inactive;
}

export function getOrganizationStatusDisplay(isActive: boolean): string {
  return isActive ? ORGANIZATION_STATUS_DISPLAY.active : ORGANIZATION_STATUS_DISPLAY.inactive;
}

// Badge color utilities
export function getAppStatusBadgeColor(status: string): string {
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

export function getAppVisibilityBadgeColor(visibility: string): string {
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

export function getUserRoleBadgeColor(role: string): string {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'bg-red-100 text-red-800';
    case 'developer':
      return 'bg-blue-100 text-blue-800';
    case 'viewer':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getUserStatusBadgeColor(isActive: boolean): string {
  return isActive 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
}

export function getOrganizationStatusBadgeColor(isActive: boolean): string {
  return isActive 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
}

// Options for select dropdowns
export const APP_STATUS_OPTIONS: EnumOption[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export const APP_VISIBILITY_OPTIONS: EnumOption[] = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'unlisted', label: 'Unlisted' },
];

export const APP_PLATFORM_OPTIONS: EnumOption[] = [
  { value: 'web', label: 'Web' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'api', label: 'API' },
];

export const USER_ROLE_OPTIONS: EnumOption[] = [
  { value: 'viewer', label: 'Viewer' },
  { value: 'developer', label: 'Developer' },
  { value: 'admin', label: 'Admin' },
];

export const USER_STATUS_OPTIONS: EnumOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const ORGANIZATION_STATUS_OPTIONS: EnumOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];
