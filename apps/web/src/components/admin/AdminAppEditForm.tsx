'use client';

import { AppFormActions } from '@/components/admin/shared/AppFormActions';
import { AppFormFields } from '@/components/admin/shared/AppFormFields';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { GET_APP_BYID, UPDATE_APP } from '@/lib/graphql/queries';
import { emptyStringToNull, normalizeApp } from '@/lib/utils/app';
import { AppFormData, appFormSchema, arraysEqual, getDefaultAppFormData } from '@/lib/utils/app-form';
import { useMutation, useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';


interface AdminAppEditFormProps {
  appId: string;
}

export function AdminAppEditForm({ appId }: AdminAppEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [originalAppData, setOriginalAppData] = useState<AppFormData | null>(null);

  const { data, loading, error } = useQuery(GET_APP_BYID, {
    variables: { id: appId },
    skip: !appId,
  });

  const [updateApp] = useMutation(UPDATE_APP);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<AppFormData>({
    resolver: zodResolver(appFormSchema),
    defaultValues: getDefaultAppFormData(),
  });


  // Load app data when it's available
  useEffect(() => {
    if (data?.app) {
      const normalizedApp = normalizeApp(data.app);
      const appFormData = {
        title: normalizedApp.title || '',
        slug: normalizedApp.slug || '',
        shortDesc: normalizedApp.shortDesc || '',
        longDesc: normalizedApp.longDesc || '',
        status: normalizedApp.status || 'draft',
        visibility: normalizedApp.visibility || 'public',
        platforms: normalizedApp.platforms || [],
        languages: normalizedApp.languages || [],
        tags: normalizedApp.tags || [],
        website: normalizedApp.website || '',
        repository: normalizedApp.repository || '',
        demoUrl: normalizedApp.demoUrl || '',
        downloadUrl: normalizedApp.downloadUrl || '',
        appStoreUrl: normalizedApp.appStoreUrl || '',
        playStoreUrl: normalizedApp.playStoreUrl || '',
        releaseDate: normalizedApp.releaseDate || '',
      };

      // Store original data for comparison
      setOriginalAppData(appFormData);
      reset(appFormData);
    }
  }, [data, reset]);

  const onSubmit = async (formData: AppFormData) => {
    if (!originalAppData) {
      toast.error('Original app data not loaded');
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if any field changed
      const hasChanges =
        formData.title !== originalAppData.title ||
        formData.slug !== originalAppData.slug ||
        formData.shortDesc !== originalAppData.shortDesc ||
        formData.longDesc !== originalAppData.longDesc ||
        formData.status !== originalAppData.status ||
        formData.visibility !== originalAppData.visibility ||
        !arraysEqual(formData.platforms, originalAppData.platforms) ||
        !arraysEqual(formData.languages, originalAppData.languages) ||
        !arraysEqual(formData.tags, originalAppData.tags) ||
        formData.website !== originalAppData.website ||
        formData.repository !== originalAppData.repository ||
        formData.demoUrl !== originalAppData.demoUrl ||
        formData.downloadUrl !== originalAppData.downloadUrl ||
        formData.appStoreUrl !== originalAppData.appStoreUrl ||
        formData.playStoreUrl !== originalAppData.playStoreUrl ||
        formData.releaseDate !== originalAppData.releaseDate;

      if (hasChanges) {
        const updateInput: any = {};

        if (formData.title !== originalAppData.title) updateInput.title = formData.title;
        if (formData.slug !== originalAppData.slug) updateInput.slug = formData.slug;
        if (formData.shortDesc !== originalAppData.shortDesc) updateInput.shortDesc = formData.shortDesc;
        if (formData.longDesc !== originalAppData.longDesc) updateInput.longDesc = formData.longDesc;
        if (formData.status !== originalAppData.status) updateInput.status = formData.status.toUpperCase();
        if (formData.visibility !== originalAppData.visibility) updateInput.visibility = formData.visibility.toUpperCase();
        if (!arraysEqual(formData.platforms, originalAppData.platforms)) {
          updateInput.platforms = formData.platforms.map(p => p.toUpperCase());
        }
        if (!arraysEqual(formData.languages, originalAppData.languages)) {
          updateInput.languages = formData.languages.map(l => l);
        }
        if (!arraysEqual(formData.tags, originalAppData.tags)) {
          updateInput.tags = formData.tags.map(t => t);
        }
        if (formData.website !== originalAppData.website) {
          updateInput.website = emptyStringToNull(formData.website);
        }
        if (formData.repository !== originalAppData.repository) {
          updateInput.repository = emptyStringToNull(formData.repository);
        }
        if (formData.demoUrl !== originalAppData.demoUrl) {
          updateInput.demoUrl = emptyStringToNull(formData.demoUrl);
        }
        if (formData.downloadUrl !== originalAppData.downloadUrl) {
          updateInput.downloadUrl = emptyStringToNull(formData.downloadUrl);
        }
        if (formData.appStoreUrl !== originalAppData.appStoreUrl) {
          updateInput.appStoreUrl = emptyStringToNull(formData.appStoreUrl);
        }
        if (formData.playStoreUrl !== originalAppData.playStoreUrl) {
          updateInput.playStoreUrl = emptyStringToNull(formData.playStoreUrl);
        }
        if (formData.releaseDate !== originalAppData.releaseDate) {
          updateInput.releaseDate = emptyStringToNull(formData.releaseDate);
        }

        await updateApp({
          variables: {
            id: appId,
            input: updateInput,
          },
        });

        toast.success('App updated successfully!');
        router.push('/admin/apps');
      } else {
        toast('No changes detected');
      }
    } catch (error: any) {
      console.error('Error updating app:', error);
      toast.error(error.message || 'Failed to update app');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading app
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error.message}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.app) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                App not found
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                The app you're looking for doesn't exist or you don't have permission to edit it.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit App</h1>
        <p className="mt-2 text-gray-600">
          Update your app information and settings
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <AppFormFields
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
          tagInput={tagInput}
          setTagInput={setTagInput}
        />

        <AppFormActions
          isSubmitting={isSubmitting}
          submitText="Update App"
          onCancel={() => router.push('/admin/apps')}
        />
      </form>
    </div>
  );
}
