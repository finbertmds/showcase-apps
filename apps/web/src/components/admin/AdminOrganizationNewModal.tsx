'use client';

import { CREATE_ORGANIZATION, LIST_ORGANIZATIONS } from '@/lib/graphql/queries';
import { FieldError } from '@/types';
import { useMutation } from '@apollo/client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface AdminOrganizationNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminOrganizationNewModal({ isOpen, onClose, onSuccess }: AdminOrganizationNewModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    website: '',
    logo: '',
    isActive: true,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [createOrganization, { loading }] = useMutation(CREATE_ORGANIZATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous field errors
    setFieldErrors({});

    // Basic validation
    if (!formData.name.trim()) {
      setFieldErrors({ name: 'Organization name is required' });
      return;
    }

    if (!formData.slug.trim()) {
      setFieldErrors({ slug: 'Slug is required' });
      return;
    }

    try {
      await createOrganization({
        variables: {
          input: {
            name: formData.name.trim(),
            slug: formData.slug.trim(),
            description: formData.description.trim() || null,
            website: formData.website.trim() || null,
            logo: formData.logo.trim() || null,
            isActive: formData.isActive,
          },
        },
        update: (cache, { data }) => {
          // Add the new organization to the cache
          if (data?.createOrganization) {
            const existingOrganizations = cache.readQuery({ query: LIST_ORGANIZATIONS }) as any;
            if (existingOrganizations?.organizations) {
              cache.writeQuery({
                query: LIST_ORGANIZATIONS,
                data: {
                  organizations: [...existingOrganizations.organizations, data.createOrganization],
                },
              });
            }
          }
        },
      });

      toast.success('Organization created successfully');
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error('Create organization error:', error);
      console.error('GraphQL Errors:', error.graphQLErrors);

      // Handle field-specific errors
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const graphQLError = error.graphQLErrors[0];
        console.error('GraphQL Error extensions:', graphQLError.extensions);

        if (graphQLError.extensions?.fieldErrors) {
          console.error('Field errors found:', graphQLError.extensions.fieldErrors);
          const errors: Record<string, string> = {};
          graphQLError.extensions.fieldErrors.forEach((fieldError: FieldError) => {
            errors[fieldError.field] = fieldError.message;
          });
          setFieldErrors(errors);
          return; // Don't show generic toast
        }
      }

      const errorMessage = error.message || 'Failed to create organization';
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const getInputClassName = (fieldName: string) => {
    const baseClass = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500";
    const errorClass = "border-red-300 focus:ring-red-500 focus:border-red-500";
    const normalClass = "border-gray-300";

    return `${baseClass} ${fieldErrors[fieldName] ? errorClass : normalClass}`;
  };

  const handleClose = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      website: '',
      logo: '',
      isActive: true,
    });
    setFieldErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Create New Organization</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Organization Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={getInputClassName('name')}
              autoComplete="organization"
              required
            />
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className={getInputClassName('slug')}
              autoComplete="off"
              placeholder="organization-slug"
              required
            />
            {fieldErrors.slug && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.slug}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={getInputClassName('description')}
              rows={3}
              placeholder="Enter organization description (optional)"
            />
            {fieldErrors.description && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
              Website URL
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className={getInputClassName('website')}
              autoComplete="url"
              placeholder="https://example.com (optional)"
            />
            {fieldErrors.website && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.website}</p>
            )}
          </div>

          {/* Logo URL */}
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
              Logo URL
            </label>
            <input
              type="url"
              id="logo"
              name="logo"
              value={formData.logo}
              onChange={handleInputChange}
              className={getInputClassName('logo')}
              autoComplete="url"
              placeholder="https://example.com/logo.png (optional)"
            />
            {fieldErrors.logo && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.logo}</p>
            )}
            {formData.logo && (
              <div className="mt-2">
                <img
                  src={formData.logo}
                  alt="Logo preview"
                  className="h-16 w-16 object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
            {fieldErrors.isActive && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.isActive}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
