/**
 * Enum Display Utilities
 * Centralized mapping of enum values to display text for consistent UI
 * 
 * Note: Enum values are now managed in MongoDB via Enum Manager
 * These display mappings serve as fallbacks and for TypeScript compatibility
 */

import {
  CodeBracketIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

// Type definitions for enum options
export interface EnumOption {
  id: string;
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
  { id: 'DRAFT', value: 'DRAFT', label: 'Draft' },
  { id: 'PUBLISHED', value: 'PUBLISHED', label: 'Published' },
  { id: 'ARCHIVED', value: 'ARCHIVED', label: 'Archived' },
];

export const APP_VISIBILITY_OPTIONS: EnumOption[] = [
  { id: 'PRIVATE', value: 'PRIVATE', label: 'Private' },
  { id: 'PUBLIC', value: 'PUBLIC', label: 'Public' },
  { id: 'UNLISTED', value: 'UNLISTED', label: 'Unlisted' },
];

export const APP_PLATFORM_OPTIONS: EnumOption[] = [
  { id: 'WEB', value: 'WEB', label: 'Web' },
  { id: 'MOBILE', value: 'MOBILE', label: 'Mobile' },
  { id: 'DESKTOP', value: 'DESKTOP', label: 'Desktop' },
  { id: 'API', value: 'API', label: 'API' },
  { id: 'IOS', value: 'IOS', label: 'iOS' },
  { id: 'ANDROID', value: 'ANDROID', label: 'Android' },
];

export const MEDIA_TYPE_OPTIONS: EnumOption[] = [
  { id: 'SCREENSHOT', value: 'SCREENSHOT', label: 'Screenshot' },
  { id: 'LOGO', value: 'LOGO', label: 'Logo' },
  { id: 'COVER', value: 'COVER', label: 'Cover' },
  { id: 'ICON', value: 'ICON', label: 'Icon' },
  { id: 'VIDEO', value: 'VIDEO', label: 'Video' },
  { id: 'DOCUMENT', value: 'DOCUMENT', label: 'Document' },
];

export const USER_ROLE_OPTIONS: EnumOption[] = [
  { id: 'VIEWER', value: 'VIEWER', label: 'Viewer' },
  { id: 'DEVELOPER', value: 'DEVELOPER', label: 'Developer' },
  { id: 'ADMIN', value: 'ADMIN', label: 'Admin' },
];

export const USER_STATUS_OPTIONS: EnumOption[] = [
  { id: 'active', value: 'active', label: 'Active' },
  { id: 'inactive', value: 'inactive', label: 'Inactive' },
];

export const ORGANIZATION_STATUS_OPTIONS: EnumOption[] = [
  { id: 'active', value: 'active', label: 'Active' },
  { id: 'inactive', value: 'inactive', label: 'Inactive' },
];

// Language options
export const APP_LANGUAGE_OPTIONS: EnumOption[] = [
  { id: 'JavaScript', value: 'JavaScript', label: 'JavaScript' },
  { id: 'TypeScript', value: 'TypeScript', label: 'TypeScript' },
  { id: 'Python', value: 'Python', label: 'Python' },
  { id: 'Java', value: 'Java', label: 'Java' },
  { id: 'C#', value: 'C#', label: 'C#' },
  { id: 'C++', value: 'C++', label: 'C++' },
  { id: 'Go', value: 'Go', label: 'Go' },
  { id: 'Rust', value: 'Rust', label: 'Rust' },
  { id: 'Swift', value: 'Swift', label: 'Swift' },
  { id: 'Kotlin', value: 'Kotlin', label: 'Kotlin' },
  { id: 'Dart', value: 'Dart', label: 'Dart' },
  { id: 'PHP', value: 'PHP', label: 'PHP' },
  { id: 'Ruby', value: 'Ruby', label: 'Ruby' },
  { id: 'React', value: 'React', label: 'React' },
  { id: 'Vue', value: 'Vue', label: 'Vue' },
  { id: 'Angular', value: 'Angular', label: 'Angular' },
  { id: 'Node.js', value: 'Node.js', label: 'Node.js' },
  { id: 'Express', value: 'Express', label: 'Express' },
  { id: 'Django', value: 'Django', label: 'Django' },
  { id: 'Flask', value: 'Flask', label: 'Flask' },
  { id: 'Spring', value: 'Spring', label: 'Spring' },
  { id: 'Laravel', value: 'Laravel', label: 'Laravel' },
  { id: 'Rails', value: 'Rails', label: 'Rails' },
];

/**
 * Helper functions to get enum options from MongoDB
 * These functions can be used to get dynamic enum values from the Enum Manager
 */

// Helper function to get enum options by key from MongoDB enum data
export const getEnumOptionsFromData = (enumData: any, key: string): EnumOption[] => {
  const enumItem = enumData.find((item: any) => item.key === key);
  return enumItem ? enumItem.options : [];
};

// Helper function to get display mapping from enum options
export const createDisplayMapping = (options: EnumOption[]): Record<string, string> => {
  const mapping: Record<string, string> = {};
  options.forEach(option => {
    mapping[option.id] = option.label;
  });
  return mapping;
};

// Helper function to get enum options as value-label pairs
export const getEnumOptionsAsArray = (options: EnumOption[]): EnumOption[] => {
  return options.map(option => ({
    id: option.id,
    value: option.value,
    label: option.label
  }));
};
