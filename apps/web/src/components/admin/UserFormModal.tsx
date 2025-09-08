'use client';

import { UPDATE_USER } from '@/lib/graphql/queries';
import { normalizeUser } from '@/lib/utils/user';
import { FieldError, User } from '@/types';
import { useMutation } from '@apollo/client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface UserFormModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserFormModal({ user, isOpen, onClose, onSuccess }: UserFormModalProps) {
  const normalizedUser = normalizeUser(user);
  
  const [formData, setFormData] = useState({
    name: normalizedUser.name,
    email: normalizedUser.email,
    username: normalizedUser.username,
    role: normalizedUser.role,
    organizationId: normalizedUser.organizationId || '',
    isActive: normalizedUser.isActive,
    avatar: normalizedUser.avatar || '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [updateUser] = useMutation(UPDATE_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous field errors
    setFieldErrors({});
    
    try {
      // Check if any field changed
      const hasChanges = 
        formData.name !== normalizedUser.name ||
        formData.email !== normalizedUser.email ||
        formData.username !== normalizedUser.username ||
        formData.role !== normalizedUser.role ||
        formData.organizationId !== (normalizedUser.organizationId || '') ||
        formData.isActive !== normalizedUser.isActive ||
        formData.avatar !== (normalizedUser.avatar || '');
      
      if (hasChanges) {
        const updateInput: any = {};
        
        if (formData.name !== normalizedUser.name) updateInput.name = formData.name;
        if (formData.email !== normalizedUser.email) updateInput.email = formData.email;
        if (formData.username !== normalizedUser.username) updateInput.username = formData.username;
        if (formData.role !== normalizedUser.role) updateInput.role = formData.role.toUpperCase();
        if (formData.organizationId !== (normalizedUser.organizationId || '')) {
          updateInput.organizationId = formData.organizationId || null;
        }
        if (formData.isActive !== normalizedUser.isActive) updateInput.isActive = formData.isActive;
        if (formData.avatar !== (normalizedUser.avatar || '')) {
          updateInput.avatar = formData.avatar || null;
        }

        await updateUser({
          variables: {
            id: normalizedUser.id,
            input: updateInput,
          },
        });
      }

      toast.success('User updated successfully');
      onSuccess();
    } catch (error: any) {
      console.error('Update user error:', error);
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
      
      toast.error('Failed to update user');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
          <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info Display */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="text-sm text-gray-600">
              <p><strong>Created:</strong> {new Date(normalizedUser.createdAt).toLocaleDateString()}</p>
              <p><strong>Last Updated:</strong> {new Date(normalizedUser.updatedAt).toLocaleDateString()}</p>
              {normalizedUser.lastLoginAt && (
                <p><strong>Last Login:</strong> {new Date(normalizedUser.lastLoginAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
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

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={getInputClassName('email')}
              required
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={getInputClassName('username')}
              required
            />
            {fieldErrors.username && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role.toLowerCase()}
              onChange={handleInputChange}
              className={getInputClassName('role')}
            >
              <option value="viewer">Viewer</option>
              <option value="developer">Developer</option>
              <option value="admin">Admin</option>
            </select>
            {fieldErrors.role && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.role}</p>
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
              <span className="ml-2 text-sm text-gray-700">Active User</span>
            </label>
          </div>

          {/* Organization ID */}
          <div>
            <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700">
              Organization ID
            </label>
            <input
              type="text"
              id="organizationId"
              name="organizationId"
              value={formData.organizationId}
              onChange={handleInputChange}
              className={getInputClassName('organizationId')}
              placeholder="Enter organization ID (optional)"
            />
            {fieldErrors.organizationId && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.organizationId}</p>
            )}
          </div>

          {/* Avatar URL */}
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
              Avatar URL
            </label>
            <input
              type="url"
              id="avatar"
              name="avatar"
              value={formData.avatar}
              onChange={handleInputChange}
              className={getInputClassName('avatar')}
              placeholder="Enter avatar URL (optional)"
            />
            {fieldErrors.avatar && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.avatar}</p>
            )}
            {formData.avatar && (
              <div className="mt-2">
                <img
                  src={formData.avatar}
                  alt="Avatar preview"
                  className="h-16 w-16 rounded-full object-cover border border-gray-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
