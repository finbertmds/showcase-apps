'use client';

import { EnumOption, USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '@/lib/utils/enum-display';
import { UserRole } from '@/types';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { OrganizationSelect } from './OrganizationSelect';

export interface UserFormData {
  username: string;
  email: string;
  name: string;
  password?: string;
  confirmPassword?: string;
  role: UserRole;
  organizationId: string;
  isActive?: boolean;
  avatar?: string;
}

interface UserFormFieldsProps {
  formData: UserFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  fieldErrors: Record<string, string>;
  isEditMode?: boolean;
  showPassword?: boolean;
  showConfirmPassword?: boolean;
  onTogglePassword?: () => void;
  onToggleConfirmPassword?: () => void;
}

export function UserFormFields({
  formData,
  onInputChange,
  fieldErrors,
  isEditMode = false,
  showPassword = false,
  showConfirmPassword = false,
  onTogglePassword,
  onToggleConfirmPassword,
}: UserFormFieldsProps) {
  return (
    <div className="space-y-4">
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
          onChange={onInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          autoComplete="username"
          required
        />
        {fieldErrors.username && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
        )}
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          autoComplete="name"
          required
        />
        {fieldErrors.name && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
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
          onChange={onInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          autoComplete="email"
          required
        />
        {fieldErrors.email && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
        )}
      </div>

      {/* Password - Only for new users */}
      {!isEditMode && (
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password || ''}
              onChange={onInputChange}
              className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              autoComplete="new-password"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
          {fieldErrors.password && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
          )}
        </div>
      )}

      {/* Confirm Password - Only for new users */}
      {!isEditMode && (
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword || ''}
              onChange={onInputChange}
              className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              autoComplete="new-password"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={onToggleConfirmPassword}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
          )}
        </div>
      )}

      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role *
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={onInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          required
        >
          {USER_ROLE_OPTIONS.map((option: EnumOption) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {fieldErrors.role && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.role}</p>
        )}
      </div>

      {/* Organization */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Organization
        </label>
        <OrganizationSelect
          value={formData.organizationId}
          onChange={(value) => onInputChange({ target: { name: 'organizationId', value } } as any)}
          error={fieldErrors.organizationId}
          placeholder="Select active organization (optional)"
        />
      </div>

      {/* Status - Only for edit mode */}
      {isEditMode && (
        <div>
          <label htmlFor="isActive" className="block text-sm font-medium text-gray-700">
            Status *
          </label>
          <select
            id="isActive"
            name="isActive"
            value={formData.isActive ? 'active' : 'inactive'}
            onChange={(e) => onInputChange({ target: { name: 'isActive', value: e.target.value === 'active' } } as any)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            required
          >
            {USER_STATUS_OPTIONS.map((option: EnumOption) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldErrors.isActive && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.isActive}</p>
          )}
        </div>
      )}

      {/* Avatar */}
      <div>
        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
          Avatar URL
        </label>
        <input
          type="url"
          id="avatar"
          name="avatar"
          value={formData.avatar || ''}
          onChange={onInputChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          autoComplete="url"
          placeholder="https://example.com/avatar.jpg"
        />
        {fieldErrors.avatar && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.avatar}</p>
        )}
      </div>
    </div>
  );
}
