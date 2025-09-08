import { User } from '@/types';

/**
 * Normalize user role to lowercase for consistent display
 */
export function normalizeUserRole(role: string): string {
  return role.toLowerCase();
}

/**
 * Normalize user data by converting role to lowercase
 */
export function normalizeUser(user: User): User {
  return {
    ...user,
    role: normalizeUserRole(user.role) as 'admin' | 'developer' | 'viewer',
  };
}

/**
 * Normalize array of users by converting all roles to lowercase
 */
export function normalizeUsers(users: User[]): User[] {
  return users.map(normalizeUser);
}

/**
 * Get role badge color class based on normalized role
 */
export function getRoleBadgeColor(role: string): string {
  const normalizedRole = normalizeUserRole(role);
  
  switch (normalizedRole) {
    case 'admin':
      return 'bg-red-100 text-red-800';
    case 'developer':
      return 'bg-blue-100 text-blue-800';
    case 'viewer':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
