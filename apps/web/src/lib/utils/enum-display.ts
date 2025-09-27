/**
 * Enum Display Utilities
 * Centralized mapping of enum values to display text for consistent UI
 */

import {
  CodeBracketIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

// Type definitions for enum options
export interface EnumOption {
  value: string;
  label: string;
}

// App Enums
export const APP_STATUS_DISPLAY = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
} as const;

export const APP_VISIBILITY_DISPLAY = {
  PUBLIC: 'Public',
  PRIVATE: 'Private',
  UNLISTED: 'Unlisted',
} as const;

export const APP_PLATFORM_DISPLAY = {
  WEB: 'Web',
  MOBILE: 'Mobile',
  DESKTOP: 'Desktop',
  API: 'API',
  IOS: 'iOS',
  ANDROID: 'Android',
} as const;

// Media Enums
export const MEDIA_TYPE_DISPLAY = {
  SCREENSHOT: 'Screenshot',
  LOGO: 'Logo',
  COVER: 'Cover',
  ICON: 'Icon',
  VIDEO: 'Video',
  DOCUMENT: 'Document',
} as const;

// User Enums
export const USER_ROLE_DISPLAY = {
  ADMIN: 'Admin',
  DEVELOPER: 'Developer',
  VIEWER: 'Viewer',
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

export function getAppPlatformIcon(platform: string) {
  switch (platform.toUpperCase()) {
    case 'MOBILE':
    case 'IOS':
    case 'ANDROID':
      return DevicePhoneMobileIcon;
    case 'DESKTOP':
      return ComputerDesktopIcon;
    case 'WEB':
      return GlobeAltIcon;
    case 'API':
      return CodeBracketIcon;
    default:
      return GlobeAltIcon;
  }
}

export function getMediaTypeDisplay(type: string): string {
  return MEDIA_TYPE_DISPLAY[type as keyof typeof MEDIA_TYPE_DISPLAY] || type;
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
  { value: 'DRAFT', label: 'Draft' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'ARCHIVED', label: 'Archived' },
];

export const APP_VISIBILITY_OPTIONS: EnumOption[] = [
  { value: 'PRIVATE', label: 'Private' },
  { value: 'PUBLIC', label: 'Public' },
  { value: 'UNLISTED', label: 'Unlisted' },
];

export const APP_PLATFORM_OPTIONS: EnumOption[] = [
  { value: 'WEB', label: 'Web' },
  { value: 'MOBILE', label: 'Mobile' },
  { value: 'DESKTOP', label: 'Desktop' },
  { value: 'API', label: 'API' },
  { value: 'IOS', label: 'iOS' },
  { value: 'ANDROID', label: 'Android' },
];

export const MEDIA_TYPE_OPTIONS: EnumOption[] = [
  { value: 'SCREENSHOT', label: 'Screenshot' },
  { value: 'LOGO', label: 'Logo' },
  { value: 'COVER', label: 'Cover' },
  { value: 'ICON', label: 'Icon' },
  { value: 'VIDEO', label: 'Video' },
  { value: 'DOCUMENT', label: 'Document' },
];

export const USER_ROLE_OPTIONS: EnumOption[] = [
  { value: 'VIEWER', label: 'Viewer' },
  { value: 'DEVELOPER', label: 'Developer' },
  { value: 'ADMIN', label: 'Admin' },
];

export const USER_STATUS_OPTIONS: EnumOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export const ORGANIZATION_STATUS_OPTIONS: EnumOption[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

// Language options
export const LANGUAGE_OPTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust',
  'Swift', 'Kotlin', 'Dart', 'PHP', 'Ruby', 'React', 'Vue', 'Angular',
  'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Rails',
];
