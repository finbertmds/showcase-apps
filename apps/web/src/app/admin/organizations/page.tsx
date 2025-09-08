'use client';

import { NewOrganizationModal } from '@/components/admin/NewOrganizationModal';
import { OrganizationTable } from '@/components/admin/OrganizationTable';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useState } from 'react';

export default function OrganizationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isNewOrganizationModalOpen, setIsNewOrganizationModalOpen] = useState(false);

  const handleNewOrganizationSuccess = () => {
    setIsNewOrganizationModalOpen(false);
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div>
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
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Organizations Table */}
        <OrganizationTable 
          searchTerm={searchTerm}
          statusFilter={statusFilter}
        />

        {/* New Organization Modal */}
        <NewOrganizationModal
          isOpen={isNewOrganizationModalOpen}
          onClose={() => setIsNewOrganizationModalOpen(false)}
          onSuccess={handleNewOrganizationSuccess}
        />
      </div>
    </ProtectedRoute>
  );
}
