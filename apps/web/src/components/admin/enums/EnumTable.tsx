'use client';

import { EnumData, EnumOption } from '@/types';
import {
  ArrowPathIcon,
  BugAntIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface EnumTableProps {
  enums: EnumData[];
  onEdit: (enumData: EnumData) => void;
  onEditOption: (enumData: EnumData, option: EnumOption) => void;
  onAddOption: (enumData: EnumData) => void;
  onDelete: (key: string, name: string) => void;
  onReset: (key: string, name: string) => void;
  onDebug?: (key: string) => void;
}

export function EnumTable({
  enums,
  onEdit,
  onEditOption,
  onAddOption,
  onDelete,
  onReset,
  onDebug,
}: EnumTableProps) {
  if (enums.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="text-center py-12">
          <div className="text-gray-500">
            <div className="text-lg font-medium mb-2">No enums found</div>
            <div className="text-sm">Create your first enum to get started</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enum Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Options
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enums.map((enumData) => (
              <tr key={enumData.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {enumData.key}
                  </div>
                  <div className="text-sm text-gray-500">
                    {enumData.options.length} options
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2 max-w-md">
                    {enumData.options.map((option) => (
                      <div
                        key={option.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        <span className="font-mono text-xs mr-1" title={`Value: ${option.value}`}>{option.value}</span>
                        <span className="text-xs">•</span>
                        <span className="ml-1">{option.label}</span>
                        <button
                          onClick={() => onEditOption(enumData, option)}
                          className="ml-1 text-primary-600 hover:text-primary-800"
                          title="Edit option"
                        >
                          <PencilIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => onAddOption(enumData)}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200"
                      title="Add option"
                    >
                      <PlusIcon className="h-3 w-3 mr-1" />
                      Add
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(enumData.updatedAt).toLocaleDateString()} {new Date(enumData.updatedAt).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {onDebug && (
                      <button
                        onClick={() => onDebug(enumData.key)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50"
                        title="Debug enum usage"
                      >
                        <BugAntIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(enumData)}
                      className="text-primary-600 hover:text-primary-900 p-1 rounded-md hover:bg-primary-50"
                      title="Edit enum"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onReset(enumData.key, enumData.key)}
                      className="text-yellow-600 hover:text-yellow-900 p-1 rounded-md hover:bg-yellow-50"
                      title="Reset to default"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(enumData.key, enumData.key)}
                      className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                      title="Delete enum"
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
    </div>
  );
}
