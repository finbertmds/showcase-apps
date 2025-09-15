// Enum Type Definitions
export type AppStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type AppVisibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
export type Platform = 'WEB' | 'MOBILE' | 'IOS' | 'ANDROID' | 'DESKTOP' | 'API';
export type UserRole = 'ADMIN' | 'DEVELOPER' | 'VIEWER';
export type EventType = 'RELEASE' | 'UPDATE' | 'MILESTONE' | 'ANNOUNCEMENT' | 'FEATURE' | 'BUGFIX';
export type MediaType = 'SCREENSHOT' | 'LOGO' | 'COVER' | 'ICON' | 'VIDEO' | 'DOCUMENT';

// Main Interfaces
export interface App {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  longDesc: string;
  status: AppStatus;
  visibility: AppVisibility;
  releaseDate?: string;
  platforms: Platform[];
  languages: string[];
  tags: string[];
  website?: string;
  repository?: string;
  demoUrl?: string;
  downloadUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  viewCount: number;
  likeCount: number;
  userLiked: boolean;
  userViewed: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByUser: User | null;
  organizationId: string;
  organization: Organization | null;
  logoUrl?: string;
}

export interface TimelineEvent {
  id: string;
  appId: string;
  title: string;
  description?: string;
  type: EventType;
  date: string;
  isPublic: boolean;
  version?: string;
  url?: string;
  metadata?: Record<string, any>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  id: string;
  type: MediaType;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  order: number;
  isActive: boolean;
  meta?: Record<string, any>;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  organization?: Organization;
  isActive: boolean;
  avatar?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  ownerId: string;
  owner?: {
    email: string;
    name: string;
    username: string;
    role: string;
    isActive: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FieldError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationError {
  message: string;
  fieldErrors: FieldError[];
}
