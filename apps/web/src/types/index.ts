export interface App {
  _id: string;
  title: string;
  slug: string;
  shortDesc: string;
  longDesc: string;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private' | 'unlisted';
  releaseDate?: string;
  platforms: string[];
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
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  organizationId: string;
}

export interface TimelineEvent {
  _id: string;
  appId: string;
  title: string;
  description?: string;
  type: 'release' | 'update' | 'milestone' | 'announcement' | 'feature' | 'bugfix';
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
  _id: string;
  type: 'screenshot' | 'logo' | 'cover' | 'icon' | 'video' | 'document';
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
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'developer' | 'viewer';
  organizationId?: string;
  isActive: boolean;
  avatar?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  isActive: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
