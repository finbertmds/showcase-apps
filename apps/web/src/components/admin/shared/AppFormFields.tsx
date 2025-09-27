'use client';

import { TagsAutocomplete } from '@/components/ui/TagsAutocomplete';
import { AppFormData, toggleArrayValue } from '@/lib/utils/app-form';
import { APP_LANGUAGE_OPTIONS, APP_PLATFORM_OPTIONS, APP_STATUS_OPTIONS, APP_VISIBILITY_OPTIONS, EnumOption } from '@/lib/utils/enum-display';
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

interface AppFormFieldsProps {
  register: UseFormRegister<AppFormData>;
  errors: FieldErrors<AppFormData>;
  setValue: UseFormSetValue<AppFormData>;
  watch: UseFormWatch<AppFormData>;
  tagInput: string;
  setTagInput: (value: string) => void;
  fieldErrors?: Record<string, string>;
  availableTags?: string[];
}

export function AppFormFields({
  register,
  errors,
  setValue,
  watch,
  tagInput,
  setTagInput,
  fieldErrors = {},
  availableTags = [],
}: AppFormFieldsProps) {
  const watchedPlatforms = watch('platforms');
  const watchedLanguages = watch('languages');
  const watchedTags = watch('tags');

  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = toggleArrayValue(watchedPlatforms || [], platform);
    setValue('platforms', newPlatforms);
  };

  const handleLanguageToggle = (language: EnumOption) => {
    const newLanguages = toggleArrayValue(watchedLanguages || [], language.id);
    setValue('languages', newLanguages);
  };


  return (
    <>
      {/* Basic Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              name="title"
              autoComplete="off"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter app title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
            {fieldErrors.title && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug *
            </label>
            <input
              {...register('slug')}
              type="text"
              id="slug"
              name="slug"
              autoComplete="off"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="app-slug"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
            {fieldErrors.slug && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.slug}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="shortDesc" className="block text-sm font-medium text-gray-700">
            Short Description *
          </label>
          <textarea
            {...register('shortDesc')}
            id="shortDesc"
            name="shortDesc"
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Brief description of your app"
          />
          {errors.shortDesc && (
            <p className="mt-1 text-sm text-red-600">{errors.shortDesc.message}</p>
          )}
          {fieldErrors.shortDesc && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.shortDesc}</p>
          )}
        </div>

        <div className="mt-6">
          <label htmlFor="longDesc" className="block text-sm font-medium text-gray-700">
            Long Description *
          </label>
          <textarea
            {...register('longDesc')}
            id="longDesc"
            name="longDesc"
            rows={6}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Detailed description of your app"
          />
          {errors.longDesc && (
            <p className="mt-1 text-sm text-red-600">{errors.longDesc.message}</p>
          )}
        </div>
      </div>

      {/* Status and Visibility */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Status & Visibility</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              {...register('status')}
              id="status"
              name="status"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {APP_STATUS_OPTIONS.map((option: EnumOption) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
              Visibility *
            </label>
            <select
              {...register('visibility')}
              id="visibility"
              name="visibility"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {APP_VISIBILITY_OPTIONS.map((option: EnumOption) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.visibility && (
              <p className="mt-1 text-sm text-red-600">{errors.visibility.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Platforms */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Platforms</h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {APP_PLATFORM_OPTIONS.map((platform: EnumOption) => (
            <label key={platform.value} className="flex items-center">
              <input
                type="checkbox"
                checked={watchedPlatforms?.includes(platform.value) || false}
                onChange={() => handlePlatformToggle(platform.value)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{platform.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Languages & Technologies</h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {APP_LANGUAGE_OPTIONS.map((language: EnumOption) => (
            <label key={language.id} className="flex items-center">
              <input
                type="checkbox"
                checked={watchedLanguages?.includes(language.id) || false}
                onChange={() => handleLanguageToggle(language)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{language.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Tags</h2>

        <TagsAutocomplete
          value={watchedTags || []}
          onChange={(tags) => setValue('tags', tags)}
          availableTags={availableTags}
          placeholder="Add a tag"
        />
      </div>

      {/* URLs */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">URLs</h2>

        <div className="space-y-6">
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              {...register('website')}
              type="url"
              id="website"
              name="website"
              autoComplete="url"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label htmlFor="repository" className="block text-sm font-medium text-gray-700">
              Repository
            </label>
            <input
              {...register('repository')}
              type="url"
              id="repository"
              name="repository"
              autoComplete="url"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://github.com/user/repo"
            />
          </div>

          <div>
            <label htmlFor="demoUrl" className="block text-sm font-medium text-gray-700">
              Demo URL
            </label>
            <input
              {...register('demoUrl')}
              type="url"
              id="demoUrl"
              name="demoUrl"
              autoComplete="url"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://demo.example.com"
            />
          </div>

          <div>
            <label htmlFor="downloadUrl" className="block text-sm font-medium text-gray-700">
              Download URL
            </label>
            <input
              {...register('downloadUrl')}
              type="url"
              id="downloadUrl"
              name="downloadUrl"
              autoComplete="url"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://download.example.com"
            />
          </div>

          <div>
            <label htmlFor="appStoreUrl" className="block text-sm font-medium text-gray-700">
              App Store URL
            </label>
            <input
              {...register('appStoreUrl')}
              type="url"
              id="appStoreUrl"
              name="appStoreUrl"
              autoComplete="url"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://apps.apple.com/app/..."
            />
          </div>

          <div>
            <label htmlFor="playStoreUrl" className="block text-sm font-medium text-gray-700">
              Play Store URL
            </label>
            <input
              {...register('playStoreUrl')}
              type="url"
              id="playStoreUrl"
              name="playStoreUrl"
              autoComplete="url"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://play.google.com/store/apps/details?id=..."
            />
          </div>

          <div>
            <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700">
              Release Date
            </label>
            <input
              {...register('releaseDate')}
              type="date"
              id="releaseDate"
              name="releaseDate"
              autoComplete="off"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>
    </>
  );
}
