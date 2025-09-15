'use client';

import { AppFormActions } from '@/components/admin/shared/AppFormActions';
import { AppFormFields } from '@/components/admin/shared/AppFormFields';
import { CREATE_APP, GET_APPS } from '@/lib/graphql/queries';
import { prepareAppDataForAPI } from '@/lib/utils/app';
import { AppFormData, appFormSchema, getDefaultAppFormData } from '@/lib/utils/app-form';
import { FieldError } from '@/types';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export function AdminAppNewForm() {
  const router = useRouter();
  const [tagInput, setTagInput] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [createApp, { loading: isSubmitting }] = useMutation(CREATE_APP, {
    onCompleted: (data) => {
      toast.success('App created successfully!');
      router.push('/admin/apps');
    },
    onError: (error) => {
      console.error('Error creating app:', error);

      // Handle field-specific errors
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        if (graphQLError.extensions?.fieldErrors) {
          console.error('Field errors found:', graphQLError.extensions.fieldErrors);
          const errors: Record<string, string> = {};
          (graphQLError.extensions.fieldErrors as FieldError[]).forEach((fieldError: FieldError) => {
            errors[fieldError.field] = fieldError.message;
          });
          setFieldErrors(errors);
          return; // Don't show generic toast
        }
      }

      toast.error('Failed to create app');
    },
    refetchQueries: [
      {
        query: GET_APPS,
        variables: {
          limit: 100,
        },
      },
    ],
    awaitRefetchQueries: true,
    notifyOnNetworkStatusChange: true,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AppFormData>({
    resolver: zodResolver(appFormSchema),
    defaultValues: getDefaultAppFormData(),
  });

  const onSubmit = async (data: AppFormData) => {
    // Clear previous field errors
    setFieldErrors({});

    try {
      // Prepare data for API (no conversion needed - already uppercase)
      const apiData = prepareAppDataForAPI(data);

      // Call the createApp mutation
      await createApp({
        variables: {
          input: apiData,
        },
      });
    } catch (error) {
      // Error handling is done in the mutation's onError callback
      console.error('Error creating app:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New App</h1>
        <p className="mt-2 text-gray-600">
          Add a new application to the showcase
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
          fieldErrors={fieldErrors}
        />

        <AppFormActions
          isSubmitting={isSubmitting}
          submitText="Create App"
          onCancel={() => router.push('/admin/apps')}
        />
      </form>
    </div>
  );
}
