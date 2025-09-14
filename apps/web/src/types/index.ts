export interface App {
  id: string;
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
  createdByUser: User | null;
  organizationId: string;
  organization: Organization | null;
}

export interface TimelineEvent {
  id: string;
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
  id: string;
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
  id: string;
  email: string;
  username: string;
  name: string;
  role: 'admin' | 'developer' | 'viewer';
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
