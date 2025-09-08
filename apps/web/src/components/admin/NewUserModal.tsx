'use client';

import { CREATE_USER, LIST_USERS } from '@/lib/graphql/queries';
import { normalizeUsers } from '@/lib/utils/user';
import { FieldError } from '@/types';
import { useMutation } from '@apollo/client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface NewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewUserModal({ isOpen, onClose, onSuccess }: NewUserModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: 'viewer' as 'admin' | 'developer' | 'viewer',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [createUser, { loading }] = useMutation(CREATE_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous field errors
    setFieldErrors({});
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      await createUser({
        variables: {
          input: {
            username: formData.username,
            email: formData.email,
            name: formData.name,
            password: formData.password,
            role: formData.role.toUpperCase(),
          },
        },
        update: (cache, { data }) => {
          // Add the new user to the cache
          if (data?.register?.user) {
            const existingUsers = cache.readQuery({ query: LIST_USERS }) as any;
            if (existingUsers?.users) {
              const normalizedNewUser = normalizeUsers([data.register.user])[0];
              cache.writeQuery({
                query: LIST_USERS,
                data: {
                  users: [...existingUsers.users, normalizedNewUser],
                },
              });
            }
          }
        },
      });

      toast.success('User created successfully');
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error('Create user error:', error);
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
      
      const errorMessage = error.message || 'Failed to create user';
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
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
      [name]: value,
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
      username: '',
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
      role: 'viewer',
    });
    setFieldErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Create New User</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username *
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

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email *
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

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name *
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

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role *
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
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

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
              minLength={6}
            />
            <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
              minLength={6}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
