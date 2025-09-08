'use client';

import { NewUserModal } from '@/components/admin/NewUserModal';
import { UserTable } from '@/components/admin/UserTable';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);

  return (
    <ProtectedRoute requiredRole="admin">
      <>
        {/* Page Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              User Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage users, roles, and permissions for the Showcase Apps platform.
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => setIsNewUserModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New User
            </button>
          </div>
        </div>

        {/* User Table */}
        <UserTable
          searchTerm={searchTerm}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onRoleFilterChange={setRoleFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* New User Modal */}
        <NewUserModal
          isOpen={isNewUserModalOpen}
          onClose={() => setIsNewUserModalOpen(false)}
          onSuccess={() => {
            // The UserTable will automatically refresh due to Apollo cache updates
            setIsNewUserModalOpen(false);
          }}
        />
      </>
    </ProtectedRoute>
  );
}
