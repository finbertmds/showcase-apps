import { UserFormData } from '@/components/admin/shared/UserFormFields';
import { z } from 'zod';

// Validation schema for new user
export const newUserFormSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50, 'Username must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  role: z.enum(['admin', 'developer', 'viewer']),
  organizationId: z.string().optional(),
});

// Validation schema for edit user
export const editUserFormSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50, 'Username must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  role: z.enum(['admin', 'developer', 'viewer']),
  organizationId: z.string().optional(),
  isActive: z.boolean(),
  avatar: z.string().url('Invalid URL').optional().or(z.literal('')),
});

// Default form data for new user
export function getDefaultNewUserFormData(): UserFormData {
  return {
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: 'viewer',
    organizationId: '',
  };
}

// Default form data for edit user
export function getDefaultEditUserFormData(): UserFormData {
  return {
    username: '',
    email: '',
    name: '',
    role: 'viewer',
    organizationId: '',
    isActive: true,
    avatar: '',
  };
}

// Validate new user form
export function validateNewUserForm(data: UserFormData): { isValid: boolean; errors: Record<string, string> } {
  try {
    newUserFormSchema.parse(data);
    
    // Additional validation for password match
    if (data.password !== data.confirmPassword) {
      return {
        isValid: false,
        errors: { confirmPassword: 'Passwords do not match' }
      };
    }
    
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
}

// Validate edit user form
export function validateEditUserForm(data: UserFormData): { isValid: boolean; errors: Record<string, string> } {
  try {
    editUserFormSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
}

// Convert form data to API format for new user
export function convertNewUserDataForAPI(data: UserFormData) {
  return {
    username: data.username,
    email: data.email,
    name: data.name,
    password: data.password,
    role: data.role.toUpperCase(),
    organizationId: data.organizationId || null,
  };
}

// Convert form data to API format for edit user
export function convertEditUserDataForAPI(data: UserFormData, originalData: UserFormData) {
  const updateInput: any = {};
  
  if (data.name !== originalData.name) {
    updateInput.name = data.name;
  }
  if (data.email !== originalData.email) {
    updateInput.email = data.email;
  }
  if (data.username !== originalData.username) {
    updateInput.username = data.username;
  }
  if (data.role !== originalData.role) {
    updateInput.role = data.role.toUpperCase();
  }
  if (data.organizationId !== originalData.organizationId) {
    updateInput.organizationId = data.organizationId || null;
  }
  if (data.isActive !== originalData.isActive) {
    updateInput.isActive = data.isActive;
  }
  if (data.avatar !== originalData.avatar) {
    updateInput.avatar = data.avatar || null;
  }
  
  return updateInput;
}
