'use client';

import { AdminUserEditModal } from '@/components/admin/AdminUserEditModal';
import { AdminUserNewModal } from '@/components/admin/AdminUserNewModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Pagination } from '@/components/ui/Pagination';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants';
import { DELETE_USER, LIST_USERS, UPDATE_USER } from '@/lib/graphql/queries';
import { EnumOption, getUserRoleBadgeColor, getUserRoleDisplay, getUserStatusBadgeColor, getUserStatusDisplay, USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '@/lib/utils/enum-display';
import { normalizeUsers } from '@/lib/utils/user';
import { User } from '@/types';
import { useMutation, useQuery } from '@apollo/client';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

export function AdminUsersList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
  }>({
    isOpen: false,
    userId: '',
    userName: '',
  });


  // GraphQL queries and mutations
  const { data, loading, error, refetch } = useQuery(LIST_USERS, {
    fetchPolicy: 'cache-and-network',
  });

  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser, { loading: isDeleting }] = useMutation(DELETE_USER);

  // Client-side filtering and pagination
  const allUsers = normalizeUsers(data?.users || []);

  const filteredUsers = useMemo(() => {
    return allUsers.filter((user: User) => {
      const matchesSearch = !searchTerm ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = !roleFilter || user.role === roleFilter.toLowerCase();

      const matchesStatus = !statusFilter ||
        (statusFilter === 'active' && user.isActive) ||
        (statusFilter === 'inactive' && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [allUsers, searchTerm, roleFilter, statusFilter]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (currentPage - 1) * pageSize;
  const users = filteredUsers.slice(offset, offset + pageSize);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    setDeleteModal({
      isOpen: true,
      userId,
      userName,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser({
        variables: { id: deleteModal.userId },
        update: (cache) => {
          // Remove the user from the cache
          cache.modify({
            fields: {
              users(existingUsers = []) {
                return existingUsers.filter((user: any) => user.__ref !== `UserDto:${deleteModal.userId}`);
              },
            },
          });
        },
      });
      toast.success('User deleted successfully');
      setDeleteModal({ isOpen: false, userId: '', userName: '' });
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, userId: '', userName: '' });
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleNewUserSuccess = () => {
    setIsNewUserModalOpen(false);
  };


  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading users: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
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

      <div className="bg-white shadow-sm rounded-lg">
        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="user-search"
                  name="user-search"
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  aria-label="Search users by name or email"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="sm:w-48">
              <select
                id="role-filter"
                name="role-filter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                aria-label="Filter users by role"
              >
                <option value="">All Roles</option>
                {USER_ROLE_OPTIONS.map((option: EnumOption) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                id="status-filter"
                name="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                aria-label="Filter users by status"
              >
                <option value="">All Status</option>
                {USER_STATUS_OPTIONS.map((option: EnumOption) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.avatar}
                            alt={user.name}
                          />
                        ) : (
                          <UserCircleIcon className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserRoleBadgeColor(user.role)}`}
                    >
                      {getUserRoleDisplay(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.organization ? (
                      <div className="flex items-center">
                        {user.organization.logo && (
                          <img
                            className="h-6 w-6 rounded-full object-cover mr-2"
                            src={user.organization.logo}
                            alt={user.organization.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.organization.name}</div>
                          <div className="text-xs text-gray-500">/{user.organization.slug}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No organization</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserStatusBadgeColor(user.isActive)}`}
                    >
                      {getUserStatusDisplay(user.isActive)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        id={`edit-${user.id}`}
                        name={`edit-${user.id}`}
                        onClick={() => handleEditUser(user)}
                        className="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50"
                        title="Edit user"
                        aria-label={`Edit user ${user.name}`}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        id={`delete-${user.id}`}
                        name={`delete-${user.id}`}
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                        title="Delete user"
                        aria-label={`Delete user ${user.name}`}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          totalItems={total}
          onPageSizeChange={setPageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          showPageSizeSelector={true}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteModal.userName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* User Form Modal */}
      {isModalOpen && selectedUser && (
        <AdminUserEditModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          onSuccess={() => {
            refetch();
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* New User Modal */}
      <AdminUserNewModal
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
        onSuccess={handleNewUserSuccess}
      />
    </>
  );
}
