'use client';

import { AdminOrganizationEditModal } from '@/components/admin/AdminOrganizationEditModal';
import { AdminOrganizationNewModal } from '@/components/admin/AdminOrganizationNewModal';
import { AdminListHeader } from '@/components/admin/shared/AdminListHeader';
import { AdminSearchAndFilter } from '@/components/admin/shared/AdminSearchAndFilter';
import { AdminTable, TableColumn } from '@/components/admin/shared/AdminTable';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Pagination } from '@/components/ui/Pagination';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants';
import { DELETE_ORGANIZATION, GET_ORGANIZATIONS_PAGINATED, UPDATE_ORGANIZATION } from '@/lib/graphql/queries';
import { getOrganizationStatusBadgeColor, getOrganizationStatusDisplay, ORGANIZATION_STATUS_OPTIONS } from '@/lib/utils/enum-display';
import { Organization } from '@/types';
import { useMutation, useQuery } from '@apollo/client';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function AdminOrganizationsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewOrganizationModalOpen, setIsNewOrganizationModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    organizationId: string;
    organizationName: string;
  }>({
    isOpen: false,
    organizationId: '',
    organizationName: '',
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, loading, error, refetch } = useQuery(GET_ORGANIZATIONS_PAGINATED, {
    variables: {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      search: debouncedSearchTerm || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  });

  const [updateOrganization] = useMutation(UPDATE_ORGANIZATION);
  const [deleteOrganization, { loading: isDeleting }] = useMutation(DELETE_ORGANIZATION, {
    onCompleted: () => {
      toast.success('Organization deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting organization:', error);
      toast.error('Failed to delete organization');
    },
    refetchQueries: [
      {
        query: GET_ORGANIZATIONS_PAGINATED,
        variables: {
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
          search: debouncedSearchTerm || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        },
      },
    ],
    awaitRefetchQueries: true,
  });

  // Server-side pagination data
  const paginatedOrganizations = data?.organizationsPaginated?.items || [];
  const paginationData = data?.organizationsPaginated || {
    totalCount: 0,
    limit: DEFAULT_PAGE_SIZE,
    offset: 0,
  };

  // Calculate total pages
  const totalPages = Math.ceil(paginationData.totalCount / paginationData.limit);
  const currentPageFromData = Math.floor(paginationData.offset / paginationData.limit) + 1;

  const handleEditOrganization = (organization: Organization) => {
    setSelectedOrganization(organization);
    setIsModalOpen(true);
  };

  const handleDeleteOrganization = (organizationId: string, organizationName: string) => {
    setDeleteModal({
      isOpen: true,
      organizationId,
      organizationName,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteOrganization({ variables: { id: deleteModal.organizationId } });
      setDeleteModal({ isOpen: false, organizationId: '', organizationName: '' });
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({ isOpen: false, organizationId: '', organizationName: '' });
  };

  const handleNewOrganizationSuccess = () => {
    setIsNewOrganizationModalOpen(false);
  };

  const handleToggleStatus = async (organizationId: string, currentStatus: boolean) => {
    try {
      await updateOrganization({
        variables: {
          id: organizationId,
          input: { isActive: !currentStatus },
        },
      });
      toast.success(`Organization ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      refetch();
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Failed to update organization status');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrganization(null);
  };

  const handleModalSuccess = () => {
    refetch();
    handleModalClose();
  };

  // Define table columns
  const columns: TableColumn<Organization>[] = [
    {
      key: 'organization',
      header: 'Organization',
      render: (organization) => (
        <div className="flex items-center">
          {organization.logo && (
            <img
              className="h-10 w-10 rounded-full object-cover mr-3"
              src={organization.logo}
              alt={organization.name}
            />
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">{organization.name}</div>
            {organization.description && (
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {organization.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'slug',
      header: 'Slug',
      render: (organization) => (
        <span className="text-sm text-gray-900 font-mono">/{organization.slug}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (organization) => (
        <button
          onClick={() => handleToggleStatus(organization.id, organization.isActive)}
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrganizationStatusBadgeColor(organization.isActive)}`}
        >
          {getOrganizationStatusDisplay(organization.isActive)}
        </button>
      ),
    },
    {
      key: 'website',
      header: 'Website',
      render: (organization) => (
        organization.website ? (
          <a
            href={organization.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 truncate max-w-xs block"
          >
            {organization.website}
          </a>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        )
      ),
    },
    {
      key: 'created',
      header: 'Created At',
      render: (organization) => (
        <span className="text-sm text-gray-500">
          {new Date(organization.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (organization) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditOrganization(organization)}
            className="text-indigo-600 hover:text-indigo-900"
            aria-label="Edit organization"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteOrganization(organization.id, organization.name)}
            className="text-red-600 hover:text-red-900"
            aria-label="Delete organization"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="text-center py-8">Loading organizations...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error loading organizations</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminListHeader
        title="Organizations"
        description="Manage organizations and their settings"
        actionButton={{
          onClick: () => setIsNewOrganizationModalOpen(true),
          text: "New Organization"
        }}
      />

      {/* Search and Filters */}
      <AdminSearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by name, slug, or description..."
        loading={loading}
        filters={[
          {
            value: statusFilter,
            onChange: setStatusFilter,
            options: ORGANIZATION_STATUS_OPTIONS,
            placeholder: "All Status"
          }
        ]}
      />

      {/* Organizations Table */}
      <AdminTable
        data={paginatedOrganizations}
        columns={columns}
        emptyMessage="No organizations found."
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPageFromData}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        pageSize={paginationData.limit}
        totalItems={paginationData.totalCount}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize);
          setCurrentPage(1);
        }}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        showPageSizeSelector={true}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Organization"
        message={`Are you sure you want to delete "${deleteModal.organizationName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Edit Organization Modal */}
      {
        isModalOpen && selectedOrganization && (
          <AdminOrganizationEditModal
            organization={selectedOrganization}
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSuccess={handleModalSuccess}
          />
        )
      }

      {/* New Organization Modal */}
      <AdminOrganizationNewModal
        isOpen={isNewOrganizationModalOpen}
        onClose={() => setIsNewOrganizationModalOpen(false)}
        onSuccess={handleNewOrganizationSuccess}
      />
    </div >
  );
}
