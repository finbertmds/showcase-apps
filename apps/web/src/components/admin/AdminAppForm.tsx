'use client';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

const appSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  shortDesc: z.string().min(1, 'Short description is required'),
  longDesc: z.string().min(1, 'Long description is required'),
  status: z.enum(['draft', 'published', 'archived']),
  visibility: z.enum(['public', 'private', 'unlisted']),
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

type AppFormData = z.infer<typeof appSchema>;

const PLATFORM_OPTIONS = [
  { value: 'web', label: 'Web' },
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'api', label: 'API' },
];

const LANGUAGE_OPTIONS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust',
  'Swift', 'Kotlin', 'Dart', 'PHP', 'Ruby', 'React', 'Vue', 'Angular',
  'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Rails',
];

export function AdminAppForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AppFormData>({
    resolver: zodResolver(appSchema),
    defaultValues: {
      status: 'draft',
      visibility: 'public',
      platforms: [],
      languages: [],
      tags: [],
    },
  });

  const watchedPlatforms = watch('platforms');
  const watchedLanguages = watch('languages');
  const watchedTags = watch('tags');

  const onSubmit = async (data: AppFormData) => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, you would call the createApp mutation here
      console.log('Creating app:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('App created successfully!');
      router.push('/admin/apps');
    } catch (error) {
      toast.error('Failed to create app');
      console.error('Error creating app:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArrayValue = (array: string[], value: string, setter: (value: string[]) => void) => {
    if (array.includes(value)) {
      setter(array.filter(item => item !== value));
    } else {
      setter([...array, value]);
    }
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !watchedTags.includes(tag.trim())) {
      setValue('tags', [...watchedTags, tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', watchedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New App</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new application to the showcase
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Title *</label>
              <input
                {...register('title')}
                className="input"
                placeholder="Enter app title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="label">Slug *</label>
              <input
                {...register('slug')}
                className="input"
                placeholder="app-slug"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="label">Short Description *</label>
            <textarea
              {...register('shortDesc')}
              rows={3}
              className="input"
              placeholder="Brief description of your app"
            />
            {errors.shortDesc && (
              <p className="mt-1 text-sm text-red-600">{errors.shortDesc.message}</p>
            )}
          </div>

          <div className="mt-6">
            <label className="label">Long Description *</label>
            <textarea
              {...register('longDesc')}
              rows={6}
              className="input"
              placeholder="Detailed description of your app"
            />
            {errors.longDesc && (
              <p className="mt-1 text-sm text-red-600">{errors.longDesc.message}</p>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Status</label>
              <select {...register('status')} className="input">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="label">Visibility</label>
              <select {...register('visibility')} className="input">
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="unlisted">Unlisted</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="label">Release Date</label>
            <input
              {...register('releaseDate')}
              type="date"
              className="input"
            />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Platforms & Technologies</h2>
          
          <div className="space-y-6">
            <div>
              <label className="label">Platforms</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {PLATFORM_OPTIONS.map((platform) => (
                  <button
                    key={platform.value}
                    type="button"
                    onClick={() => toggleArrayValue(watchedPlatforms, platform.value, (value) => setValue('platforms', value))}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      watchedPlatforms.includes(platform.value)
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {platform.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Languages & Technologies</label>
              <div className="flex flex-wrap gap-2 mt-2 max-h-32 overflow-y-auto">
                {LANGUAGE_OPTIONS.map((language) => (
                  <button
                    key={language}
                    type="button"
                    onClick={() => toggleArrayValue(watchedLanguages, language, (value) => setValue('languages', value))}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      watchedLanguages.includes(language)
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {language}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Tags</label>
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {watchedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add a tag and press Enter"
                className="input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Website</label>
              <input
                {...register('website')}
                type="url"
                className="input"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="label">Repository</label>
              <input
                {...register('repository')}
                type="url"
                className="input"
                placeholder="https://github.com/user/repo"
              />
            </div>

            <div>
              <label className="label">Demo URL</label>
              <input
                {...register('demoUrl')}
                type="url"
                className="input"
                placeholder="https://demo.example.com"
              />
            </div>

            <div>
              <label className="label">Download URL</label>
              <input
                {...register('downloadUrl')}
                type="url"
                className="input"
                placeholder="https://download.example.com"
              />
            </div>

            <div>
              <label className="label">App Store URL</label>
              <input
                {...register('appStoreUrl')}
                type="url"
                className="input"
                placeholder="https://apps.apple.com/app/..."
              />
            </div>

            <div>
              <label className="label">Play Store URL</label>
              <input
                {...register('playStoreUrl')}
                type="url"
                className="input"
                placeholder="https://play.google.com/store/apps/..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary px-6 py-2"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary px-6 py-2 inline-flex items-center space-x-2"
          >
            {isSubmitting && <LoadingSpinner size="sm" />}
            <span>{isSubmitting ? 'Creating...' : 'Create App'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
