'use client';

import { AdminUserEditModal } from '@/components/admin/AdminUserEditModal';
import { AdminUserNewModal } from '@/components/admin/AdminUserNewModal';
import { AdminListHeader } from '@/components/admin/shared/AdminListHeader';
import { AdminSearchAndFilter } from '@/components/admin/shared/AdminSearchAndFilter';
import { AdminTable, TableColumn } from '@/components/admin/shared/AdminTable';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Pagination } from '@/components/ui/Pagination';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants';
import { DELETE_USER, GET_USERS_PAGINATED, UPDATE_USER } from '@/lib/graphql/queries';
import { getUserRoleBadgeColor, getUserRoleDisplay, getUserStatusBadgeColor, getUserStatusDisplay, USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '@/lib/utils/enum-display';
import { User } from '@/types';
import { useMutation, useQuery } from '@apollo/client';
import {
  PencilIcon,
  TrashIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function AdminUsersList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
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

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // GraphQL queries and mutations
  const { data, loading, error, refetch } = useQuery(GET_USERS_PAGINATED, {
    variables: {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search: debouncedSearchTerm || undefined,
      role: roleFilter !== 'all' ? roleFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser, { loading: isDeleting }] = useMutation(DELETE_USER, {
    onCompleted: () => {
      toast.success('User deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    },
    refetchQueries: [
      {
        query: GET_USERS_PAGINATED,
        variables: {
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
          search: debouncedSearchTerm || undefined,
          role: roleFilter !== 'all' ? roleFilter : undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        },
      },
    ],
    awaitRefetchQueries: true,
  });

  // Server-side pagination data
  const users = data?.usersPaginated?.items || [];
  const paginationData = data?.usersPaginated || {
    totalCount: 0,
    limit: DEFAULT_PAGE_SIZE,
    offset: 0,
  };

  // Calculate total pages
  const totalPages = Math.ceil(paginationData.totalCount / paginationData.limit);
  const currentPageFromData = Math.floor(paginationData.offset / paginationData.limit) + 1;

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
      await deleteUser({ variables: { id: deleteModal.userId } });
      setDeleteModal({ isOpen: false, userId: '', userName: '' });
    } catch (error) {
      console.error('Error deleting user:', error);
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Define table columns
  const columns: TableColumn<User>[] = [
    {
      key: 'user',
      header: 'User',
      render: (user) => (
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
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserRoleBadgeColor(user.role)}`}
        >
          {getUserRoleDisplay(user.role)}
        </span>
      ),
    },
    {
      key: 'organization',
      header: 'Organization',
      render: (user) => (
        user.organization ? (
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
        )
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserStatusBadgeColor(user.isActive)}`}
        >
          {getUserStatusDisplay(user.isActive)}
        </span>
      ),
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      render: (user) => (
        <span className="text-sm text-gray-500">
          {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
        </span>
      ),
    },
    {
      key: 'created',
      header: 'Created',
      render: (user) => (
        <span className="text-sm text-gray-500">
          {formatDate(user.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (user) => (
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
      ),
    },
  ];

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
    <div className="space-y-6">
      {/* Header */}
      <AdminListHeader
        title="Users"
        description="Manage users, roles, and permissions for the Showcase Apps platform."
        actionButton={{
          onClick: () => setIsNewUserModalOpen(true),
          text: "New User"
        }}
      />

      {/* Search and Filters */}
      <AdminSearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search users by name or email..."
        loading={loading}
        filters={[
          {
            value: roleFilter,
            onChange: setRoleFilter,
            options: USER_ROLE_OPTIONS,
            placeholder: "All Roles"
          },
          {
            value: statusFilter,
            onChange: setStatusFilter,
            options: USER_STATUS_OPTIONS,
            placeholder: "All Status"
          }
        ]}
      />

      {/* Users Table */}
      <AdminTable
        data={users}
        columns={columns}
        emptyMessage="No users found."
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPageFromData}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pageSize={paginationData.limit}
        totalItems={paginationData.totalCount}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        showPageSizeSelector={true}
      />

      {/* Delete Confirmation Modal */}
      < ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteModal.userName}"? This action cannot be undone.`
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* User Form Modal */}
      {
        isModalOpen && selectedUser && (
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
        )
      }

      {/* New User Modal */}
      <AdminUserNewModal
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
        onSuccess={handleNewUserSuccess}
      />
    </div>
  );
}
