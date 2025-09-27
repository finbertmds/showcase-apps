'use client';

import { UPDATE_USER } from '@/lib/graphql/queries';
import { convertEditUserDataForAPI, getDefaultEditUserFormData, validateEditUserForm } from '@/lib/utils/user-form';
import { FieldError, User } from '@/types';
import { useMutation } from '@apollo/client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { UserFormActions } from './shared/UserFormActions';
import { UserFormData, UserFormFields } from './shared/UserFormFields';

interface AdminUserEditModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminUserEditModal({ user, isOpen, onClose, onSuccess }: AdminUserEditModalProps) {
  const normalizedUser = user;
  const [formData, setFormData] = useState<UserFormData>(getDefaultEditUserFormData());
  const [originalFormData, setOriginalFormData] = useState<UserFormData>(getDefaultEditUserFormData());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [updateUser] = useMutation(UPDATE_USER);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setFieldErrors({});
    onClose();
  }, [onClose]);

  // Initialize form data when user changes
  useEffect(() => {
    const userFormData: UserFormData = {
      username: normalizedUser.username,
      email: normalizedUser.email,
      name: normalizedUser.name,
      role: normalizedUser.role,
      organizationId: normalizedUser.organizationId || '',
      isActive: normalizedUser.isActive,
      avatar: normalizedUser.avatar || '',
    };
    setFormData(userFormData);
    setOriginalFormData(userFormData);
  }, [user.id]); // Use user.id instead of normalizedUser to prevent infinite loop

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous field errors
    setFieldErrors({});

    // Validate form
    const validation = validateEditUserForm(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    try {
      // Check if any field changed
      const updateInput = convertEditUserDataForAPI(formData, originalFormData);

      if (Object.keys(updateInput).length === 0) {
        toast('No changes detected');
        return;
      }

      await updateUser({
        variables: {
          id: user.id,
          input: updateInput,
        },
      });

      toast.success('User updated successfully');
      onSuccess();
      handleClose();
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

      const errorMessage = error.message || 'Failed to update user';
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div ref={modalRef} className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Edit User</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <UserFormFields
            formData={formData}
            onInputChange={handleInputChange}
            fieldErrors={fieldErrors}
            isEditMode={true}
          />

          <UserFormActions
            isSubmitting={false}
            onCancel={handleClose}
            submitText="Update User"
            cancelText="Cancel"
          />
        </form>
      </div>
    </div>
  );
}
