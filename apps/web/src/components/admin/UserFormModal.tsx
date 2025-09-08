'use client';

import { UPDATE_USER } from '@/lib/graphql/queries';
import { User } from '@/types';
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
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  });

  const [updateUser] = useMutation(UPDATE_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Update user if any field changed
      const hasChanges = formData.role !== user.role || formData.isActive !== user.isActive;
      
      if (hasChanges) {
        await updateUser({
          variables: {
            id: user.id,
            role: formData.role !== user.role ? formData.role : undefined,
            isActive: formData.isActive !== user.isActive ? formData.isActive : undefined,
          },
        });
      }

      toast.success('User updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Update user error:', error);
      toast.error('Failed to update user');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
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
              <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
              <p><strong>Last Updated:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
              {user.lastLoginAt && (
                <p><strong>Last Login:</strong> {new Date(user.lastLoginAt).toLocaleDateString()}</p>
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="viewer">Viewer</option>
              <option value="developer">Developer</option>
              <option value="admin">Admin</option>
            </select>
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

          {/* Organization Info */}
          {user.organizationId && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Organization ID
              </label>
              <input
                type="text"
                value={user.organizationId}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
              />
            </div>
          )}

          {/* Avatar */}
          {user.avatar && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Avatar
              </label>
              <div className="mt-1">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              </div>
            </div>
          )}

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
