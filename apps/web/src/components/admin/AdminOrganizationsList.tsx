'use client';

import { AdminOrganizationEditModal } from '@/components/admin/AdminOrganizationEditModal';
import { AdminOrganizationNewModal } from '@/components/admin/AdminOrganizationNewModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Pagination } from '@/components/ui/Pagination';
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants';
import { DELETE_ORGANIZATION, LIST_ORGANIZATIONS, UPDATE_ORGANIZATION } from '@/lib/graphql/queries';
import { EnumOption, getOrganizationStatusBadgeColor, getOrganizationStatusDisplay, ORGANIZATION_STATUS_OPTIONS } from '@/lib/utils/enum-display';
import { Organization } from '@/types';
import { useMutation, useQuery } from '@apollo/client';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

export function AdminOrganizationsList() {
  const [searchTerm, setSearchTerm] = useState('');
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

  const { data, loading, error, refetch } = useQuery(LIST_ORGANIZATIONS);
  const [updateOrganization] = useMutation(UPDATE_ORGANIZATION);
  const [deleteOrganization, { loading: isDeleting }] = useMutation(DELETE_ORGANIZATION);

  // Client-side filtering and pagination
  const filteredOrganizations = useMemo(() => {
    if (!data?.organizations) return [];

    let filtered = data.organizations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((org: Organization) =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (org.description && org.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((org: Organization) => {
        if (statusFilter === 'active') return org.isActive;
        if (statusFilter === 'inactive') return !org.isActive;
        return true;
      });
    }

    return filtered;
  }, [data?.organizations, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrganizations.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrganizations = filteredOrganizations.slice(startIndex, startIndex + pageSize);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

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
      await deleteOrganization({
        variables: { id: deleteModal.organizationId },
        update: (cache) => {
          const existingOrganizations = cache.readQuery({ query: LIST_ORGANIZATIONS }) as any;
          if (existingOrganizations?.organizations) {
            cache.writeQuery({
              query: LIST_ORGANIZATIONS,
              data: {
                organizations: existingOrganizations.organizations.filter((org: Organization) => org.id !== deleteModal.organizationId),
              },
            });
          }
        },
      });
      toast.success('Organization deleted successfully');
      setDeleteModal({ isOpen: false, organizationId: '', organizationName: '' });
    } catch (error) {
      console.error('Delete organization error:', error);
      toast.error('Failed to delete organization');
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

  if (loading) return <div className="text-center py-8">Loading organizations...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error loading organizations</div>;

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-600">Manage organizations and their settings</p>
        </div>
        <button
          onClick={() => setIsNewOrganizationModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Organization
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Organizations
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search by name, slug, or description..."
              autoComplete="off"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Organizations</option>
              {ORGANIZATION_STATUS_OPTIONS.map((option: EnumOption) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Organizations Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Website
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrganizations.map((organization: Organization) => (
                <tr key={organization.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 font-mono">/{organization.slug}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(organization.id, organization.isActive)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrganizationStatusBadgeColor(organization.isActive)}`}
                    >
                      {getOrganizationStatusDisplay(organization.isActive)}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {organization.website ? (
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
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(organization.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
          totalItems={filteredOrganizations.length}
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
        title="Delete Organization"
        message={`Are you sure you want to delete "${deleteModal.organizationName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Edit Organization Modal */}
      {isModalOpen && selectedOrganization && (
        <AdminOrganizationEditModal
          organization={selectedOrganization}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* New Organization Modal */}
      <AdminOrganizationNewModal
        isOpen={isNewOrganizationModalOpen}
        onClose={() => setIsNewOrganizationModalOpen(false)}
        onSuccess={handleNewOrganizationSuccess}
      />
    </>
  );
}
