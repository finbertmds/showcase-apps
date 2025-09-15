import { z } from 'zod';

// App form schema
export const appFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  shortDesc: z.string().min(1, 'Short description is required'),
  longDesc: z.string().min(1, 'Long description is required'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'UNLISTED'] as const),
  platforms: z.array(z.string()),
  languages: z.array(z.string()),
  tags: z.array(z.string()),
  website: z.string().optional(),
  repository: z.string().optional(),
  demoUrl: z.string().optional(),
  downloadUrl: z.string().optional(),
  appStoreUrl: z.string().optional(),
  playStoreUrl: z.string().optional(),
  releaseDate: z.string().optional(),
});

export type AppFormData = z.infer<typeof appFormSchema>;

// Platform options - moved to enum-display.ts for consistency
// Use APP_PLATFORM_OPTIONS from enum-display.ts instead

// Language options
export const LANGUAGE_OPTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust',
  'Swift', 'Kotlin', 'Dart', 'PHP', 'Ruby', 'React', 'Vue', 'Angular',
  'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Rails',
];

// Default form values
export const getDefaultAppFormData = (): AppFormData => ({
  title: '',
  slug: '',
  shortDesc: '',
  longDesc: '',
  status: 'DRAFT',
  visibility: 'PUBLIC',
  platforms: [],
  languages: [],
  tags: [],
  website: '',
  repository: '',
  demoUrl: '',
  downloadUrl: '',
  appStoreUrl: '',
  playStoreUrl: '',
  releaseDate: '',
});

// Form validation helpers
export const validateAppForm = (data: AppFormData) => {
  return appFormSchema.safeParse(data);
};

// Array toggle helper
export const toggleArrayValue = (array: string[], value: string): string[] => {
  if (array.includes(value)) {
    return array.filter(item => item !== value);
  } else {
    return [...array, value];
  }
};

// Tag management helpers
export const addTag = (tags: string[], newTag: string): string[] => {
  const trimmedTag = newTag.trim();
  if (trimmedTag && !tags.includes(trimmedTag)) {
    return [...tags, trimmedTag];
  }
  return tags;
};

export const removeTag = (tags: string[], tagToRemove: string): string[] => {
  return tags.filter(tag => tag !== tagToRemove);
};

/**
 * Compare two arrays for equality
 */
export const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
};
