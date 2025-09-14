'use client';

import { CREATE_USER, LIST_USERS } from '@/lib/graphql/queries';
import { normalizeUsers } from '@/lib/utils/user';
import { convertNewUserDataForAPI, getDefaultNewUserFormData, validateNewUserForm } from '@/lib/utils/user-form';
import { FieldError } from '@/types';
import { useMutation } from '@apollo/client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { UserFormActions } from './shared/UserFormActions';
import { UserFormData, UserFormFields } from './shared/UserFormFields';

interface AdminUserNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminUserNewModal({ isOpen, onClose, onSuccess }: AdminUserNewModalProps) {
  const [formData, setFormData] = useState<UserFormData>(getDefaultNewUserFormData());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [createUser, { loading }] = useMutation(CREATE_USER);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setFormData(getDefaultNewUserFormData());
    setFieldErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  }, [onClose]);

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
    const validation = validateNewUserForm(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    try {
      const apiData = convertNewUserDataForAPI(formData);
      await createUser({
        variables: { input: apiData },
        update: (cache, { data }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div ref={modalRef} className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
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
          <UserFormFields
            formData={formData}
            onInputChange={handleInputChange}
            fieldErrors={fieldErrors}
            isEditMode={false}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          <UserFormActions
            isSubmitting={loading}
            onCancel={handleClose}
            submitText="Create User"
            cancelText="Cancel"
          />
        </form>
      </div>
    </div>
  );
}
