'use client';

import { UserFormModal } from '@/components/admin/UserFormModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DELETE_USER, LIST_USERS, UPDATE_USER } from '@/lib/graphql/queries';
import { getRoleBadgeColor, normalizeUsers } from '@/lib/utils/user';
import { User } from '@/types';
import { useMutation, useQuery } from '@apollo/client';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

interface UserTableProps {
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

export function UserTable({ 
  searchTerm, 
  roleFilter, 
  statusFilter,
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange
}: UserTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const itemsPerPage = 10;

  // GraphQL queries and mutations
  const { data, loading, error, refetch } = useQuery(LIST_USERS, {
    fetchPolicy: 'cache-and-network',
  });

  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

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
  const totalPages = Math.ceil(total / itemsPerPage);
  const offset = (currentPage - 1) * itemsPerPage;
  const users = filteredUsers.slice(offset, offset + itemsPerPage);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser({
        variables: { id: userId },
        update: (cache) => {
          // Remove the user from the cache
          cache.modify({
            fields: {
              users(existingUsers = []) {
                return existingUsers.filter((user: any) => user.__ref !== `UserDto:${userId}`);
              },
            },
          });
        },
      });
      toast.success('User deleted successfully');
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUser({
        variables: { 
          id: userId, 
          input: { isActive: !currentStatus }
        },
      });
      toast.success('User status updated successfully');
      refetch();
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateUser({
        variables: { 
          id: userId, 
          input: { role: newRole.toUpperCase() }
        },
      });
      toast.success('User role updated successfully');
      refetch();
    } catch (error) {
      console.error('Update role error:', error);
      toast.error('Failed to update user role');
    }
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
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  aria-label="Search users by name or email"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="sm:w-48">
              <select
                id="role-filter"
                name="role-filter"
                value={roleFilter}
                onChange={(e) => onRoleFilterChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                aria-label="Filter users by role"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="developer">Developer</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                id="status-filter"
                name="status-filter"
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                aria-label="Filter users by status"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
                    <select
                      id={`role-${user.id}`}
                      name={`role-${user.id}`}
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      className={`text-xs font-medium px-8 py-2 rounded-full border-0 focus:ring-2 focus:ring-primary-500 ${getRoleBadgeColor(user.role)}`}
                      aria-label={`Change role for ${user.name}`}
                    >
                      <option value="admin">Admin</option>
                      <option value="developer">Developer</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      id={`status-${user.id}`}
                      name={`status-${user.id}`}
                      onClick={() => handleToggleStatus(user.id, user.isActive)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                      aria-label={`Toggle status for ${user.name} (currently ${user.isActive ? 'active' : 'inactive'})`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
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
                        onClick={() => setDeleteConfirmId(user.id)}
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
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{offset + 1}</span>
                  {' '}to{' '}
                  <span className="font-medium">{Math.min(offset + itemsPerPage, total)}</span>
                  {' '}of{' '}
                  <span className="font-medium">{total}</span>
                  {' '}results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Delete User</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this user? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => handleDeleteUser(deleteConfirmId)}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-24 hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      {isModalOpen && selectedUser && (
        <UserFormModal
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
    </>
  );
}
