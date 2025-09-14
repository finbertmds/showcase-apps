'use client';

import { LIST_ORGANIZATIONS } from '@/lib/graphql/queries';
import { Organization } from '@/types';
import { useQuery } from '@apollo/client';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useRef, useState } from 'react';

interface OrganizationSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export function OrganizationSelect({ value, onChange, error, placeholder = "Select active organization..." }: OrganizationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data, loading, error: queryError } = useQuery(LIST_ORGANIZATIONS);

  // Filter organizations based on search term and active status
  const filteredOrganizations = useMemo(() => {
    if (!data?.organizations) return [];

    // First filter by active status
    const activeOrganizations = data.organizations.filter((org: Organization) => org.isActive);

    // Then filter by search term
    if (!searchTerm.trim()) return activeOrganizations;

    return activeOrganizations.filter((org: Organization) =>
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.organizations, searchTerm]);

  // Find selected organization
  useEffect(() => {
    if (value && data?.organizations) {
      const org = data.organizations.find((org: Organization) => org.id === value);
      setSelectedOrganization(org || null);
    } else {
      setSelectedOrganization(null);
    }
  }, [value, data?.organizations]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelectOrganization = (organization: Organization) => {
    onChange(organization.id);
    setSelectedOrganization(organization);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClearSelection = () => {
    onChange('');
    setSelectedOrganization(null);
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  const getInputClassName = () => {
    const baseClass = "relative w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 cursor-pointer";
    const errorClass = "border-red-300 focus:ring-red-500 focus:border-red-500";
    const normalClass = "border-gray-300";

    return `${baseClass} ${error ? errorClass : normalClass}`;
  };

  if (loading) {
    return (
      <div className="relative">
        <div className={getInputClassName()}>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Loading organizations...</span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="relative">
        <div className={getInputClassName()}>
          <div className="flex items-center justify-between">
            <span className="text-red-500">Error loading organizations</span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Select Input */}
      <div className={getInputClassName()} onClick={handleToggleDropdown}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {selectedOrganization ? (
              <>
                {selectedOrganization.logo && (
                  <img
                    src={selectedOrganization.logo}
                    alt={selectedOrganization.name}
                    className="h-6 w-6 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <span className="text-gray-900">{selectedOrganization.name}</span>
                <span className="text-gray-500 text-sm">({selectedOrganization.slug})</span>
              </>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {selectedOrganization && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearSelection();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Clear selection</span>
                ×
              </button>
            )}
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search active organizations..."
                autoComplete="off"
              />
            </div>
          </div>

          {/* Organizations List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOrganizations.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                {searchTerm ? 'No active organizations found' : 'No active organizations available'}
              </div>
            ) : (
              filteredOrganizations.map((organization: Organization) => (
                <div
                  key={organization.id}
                  onClick={() => handleSelectOrganization(organization)}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center space-x-3 ${selectedOrganization?.id === organization.id ? 'bg-primary-50' : ''
                    }`}
                >
                  {organization.logo && (
                    <img
                      src={organization.logo}
                      alt={organization.name}
                      className="h-8 w-8 rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {organization.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      /{organization.slug}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${organization.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {organization.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
