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
 * Get role badge color class based on normalized role - moved to enum-display.ts for consistency
 * Use getUserRoleBadgeColor from enum-display.ts instead
 */
