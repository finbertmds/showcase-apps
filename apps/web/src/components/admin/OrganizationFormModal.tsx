'use client';

import { UPDATE_ORGANIZATION } from '@/lib/graphql/queries';
import { FieldError, Organization } from '@/types';
import { useMutation } from '@apollo/client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface OrganizationFormModalProps {
  organization: Organization;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function OrganizationFormModal({ organization, isOpen, onClose, onSuccess }: OrganizationFormModalProps) {
  const [formData, setFormData] = useState({
    name: organization.name,
    slug: organization.slug,
    description: organization.description || '',
    website: organization.website || '',
    logo: organization.logo || '',
    isActive: organization.isActive,
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [updateOrganization] = useMutation(UPDATE_ORGANIZATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous field errors
    setFieldErrors({});
    
    try {
      // Check if any field changed
      const hasChanges = 
        formData.name !== organization.name ||
        formData.slug !== organization.slug ||
        formData.description !== (organization.description || '') ||
        formData.website !== (organization.website || '') ||
        formData.logo !== (organization.logo || '') ||
        formData.isActive !== organization.isActive;
      
      if (hasChanges) {
        const updateInput: any = {};
        
        if (formData.name !== organization.name) updateInput.name = formData.name;
        if (formData.slug !== organization.slug) updateInput.slug = formData.slug;
        if (formData.description !== (organization.description || '')) {
          updateInput.description = formData.description || null;
        }
        if (formData.website !== (organization.website || '')) {
          updateInput.website = formData.website || null;
        }
        if (formData.logo !== (organization.logo || '')) {
          updateInput.logo = formData.logo || null;
        }
        if (formData.isActive !== organization.isActive) updateInput.isActive = formData.isActive;

        await updateOrganization({
          variables: {
            id: organization.id,
            input: updateInput,
          },
        });
      }

      toast.success('Organization updated successfully');
      onSuccess();
    } catch (error: any) {
      console.error('Update organization error:', error);
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
      
      toast.error('Failed to update organization');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Edit Organization</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Organization Info Display */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-sm text-gray-600">
              <p><strong>Created:</strong> {new Date(organization.createdAt).toLocaleDateString()}</p>
              <p><strong>Last Updated:</strong> {new Date(organization.updatedAt).toLocaleDateString()}</p>
              <p><strong>Owner ID:</strong> {organization.ownerId}</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Organization Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={getInputClassName('name')}
              required
            />
            {fieldErrors.name && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className={getInputClassName('slug')}
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
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Update Organization
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
