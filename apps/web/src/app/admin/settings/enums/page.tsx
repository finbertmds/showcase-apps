'use client';

import { AdminListHeader } from '@/components/admin/shared/AdminListHeader';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  DEBUG_ENUM_USAGE,
  DELETE_ENUM,
  GET_ALL_ENUMS,
  RESET_ALL_ENUMS_TO_DEFAULT,
  RESET_ENUM_TO_DEFAULT
} from '@/lib/graphql/queries';
import { EnumData, EnumOption } from '@/types';
import { useApolloClient, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { ArrowPathIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { EnumEditDialog } from '../../../../components/admin/enums/EnumEditDialog';
import { EnumOptionDialog } from '../../../../components/admin/enums/EnumOptionDialog';
import { EnumTable } from '../../../../components/admin/enums/EnumTable';

export default function EnumManagerPage() {
  const apolloClient = useApolloClient();
  const [selectedEnum, setSelectedEnum] = useState<EnumData | null>(null);
  const [selectedOption, setSelectedOption] = useState<EnumOption | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isOptionDialogOpen, setIsOptionDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetAllModalOpen, setIsResetAllModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ key: string; name: string } | null>(null);
  const [resetTarget, setResetTarget] = useState<{ key: string; name: string } | null>(null);
  const [debugResult, setDebugResult] = useState<string>('');

  const { data, loading, error, refetch } = useQuery(GET_ALL_ENUMS, {
    fetchPolicy: 'cache-and-network',
  });

  const [deleteEnum] = useMutation(DELETE_ENUM, {
    onCompleted: () => {
      toast.success('Enum deleted successfully!');
      refetch();
    },
    onError: (error) => {
      console.error('Error deleting enum:', error);
      toast.error('Failed to delete enum');
    },
  });

  const [resetEnum] = useMutation(RESET_ENUM_TO_DEFAULT, {
    onCompleted: () => {
      toast.success('Enum reset to default successfully!');
      refetch();
    },
    onError: (error) => {
      console.error('Error resetting enum:', error);
      toast.error('Failed to reset enum');
    },
  });

  const [resetAllEnums] = useMutation(RESET_ALL_ENUMS_TO_DEFAULT, {
    onCompleted: () => {
      toast.success('All enums reset to default successfully!');
      refetch();
    },
    onError: (error) => {
      console.error('Error resetting all enums:', error);
      toast.error('Failed to reset all enums');
    },
  });

  const [debugEnumUsage] = useLazyQuery(DEBUG_ENUM_USAGE, {
    onCompleted: (data) => {
      setDebugResult(data.debugEnumUsage);
    },
    onError: (error) => {
      console.error('Error debugging enum usage:', error);
      toast.error('Failed to debug enum usage');
    },
  });

  const enums = data?.enums || [];

  const handleEditEnum = (enumData: EnumData) => {
    setSelectedEnum(enumData);
    setIsEditDialogOpen(true);
  };

  const handleEditOption = (enumData: EnumData, option: EnumOption) => {
    setSelectedEnum(enumData);
    setSelectedOption(option);
    setIsOptionDialogOpen(true);
  };

  const handleAddOption = (enumData: EnumData) => {
    setSelectedEnum(enumData);
    setSelectedOption(null);
    setIsOptionDialogOpen(true);
  };

  const handleDeleteEnum = (key: string, name: string) => {
    setDeleteTarget({ key, name });
    setIsDeleteModalOpen(true);
  };

  const handleResetEnum = (key: string, name: string) => {
    setResetTarget({ key, name });
    setIsResetModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteEnum({ variables: { key: deleteTarget.key } });
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting enum:', error);
    }
  };

  const handleConfirmReset = async () => {
    if (!resetTarget) return;

    try {
      await resetEnum({ variables: { key: resetTarget.key } });
      setIsResetModalOpen(false);
      setResetTarget(null);
    } catch (error) {
      console.error('Error resetting enum:', error);
    }
  };

  const handleConfirmResetAll = async () => {
    try {
      await resetAllEnums();
      setIsResetAllModalOpen(false);
    } catch (error) {
      console.error('Error resetting all enums:', error);
    }
  };

  const handleDialogClose = () => {
    setIsEditDialogOpen(false);
    setIsOptionDialogOpen(false);
    setSelectedEnum(null);
    setSelectedOption(null);
  };

  const handleDialogSuccess = () => {
    handleDialogClose();
    refetch();

    // Invalidate related queries to refresh enum-dependent data
    apolloClient.refetchQueries({
      include: ['GetAppsPaginated', 'GetTimelineApps', 'ListApps', 'GetUsersPaginated', 'GetOrganizationsPaginated'],
    });
  };

  const handleDebugEnum = (key: string) => {
    debugEnumUsage({ variables: { key } });
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
        <p className="text-red-600">Error loading enums: {error.message}</p>
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
        title="Enum Manager"
        description="Manage system enums and their values"
        actionButton={{
          onClick: () => {
            setSelectedEnum(null);
            setIsEditDialogOpen(true);
          },
          text: "New Enum",
          icon: <PlusIcon className="h-4 w-4" />
        }}
      />

      {/* Reset All Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsResetAllModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Reset All to Default
        </button>
      </div>

      {/* Enum Table */}
      <EnumTable
        enums={enums}
        onEdit={handleEditEnum}
        onEditOption={handleEditOption}
        onAddOption={handleAddOption}
        onDelete={handleDeleteEnum}
        onReset={handleResetEnum}
        onDebug={handleDebugEnum}
      />

      {/* Debug Result */}
      {debugResult && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Debug Result</h3>
          </div>
          <div className="px-6 py-4">
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
              {debugResult}
            </pre>
            <button
              onClick={() => setDebugResult('')}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Edit Enum Dialog */}
      {isEditDialogOpen && (
        <EnumEditDialog
          enumData={selectedEnum}
          isOpen={isEditDialogOpen}
          onClose={handleDialogClose}
          onSuccess={handleDialogSuccess}
        />
      )}

      {/* Edit Option Dialog */}
      {isOptionDialogOpen && selectedEnum && (
        <EnumOptionDialog
          enumData={selectedEnum}
          option={selectedOption}
          isOpen={isOptionDialogOpen}
          onClose={handleDialogClose}
          onSuccess={handleDialogSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Enum"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Reset Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset Enum to Default"
        message={`Are you sure you want to reset "${resetTarget?.name}" to its default values? This will overwrite all current options.`}
        confirmText="Reset"
        cancelText="Cancel"
        type="warning"
      />

      {/* Reset All Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetAllModalOpen}
        onClose={() => setIsResetAllModalOpen(false)}
        onConfirm={handleConfirmResetAll}
        title="Reset All Enums to Default"
        message="Are you sure you want to reset ALL enums to their default values? This will overwrite all current options and cannot be undone."
        confirmText="Reset All"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
}
