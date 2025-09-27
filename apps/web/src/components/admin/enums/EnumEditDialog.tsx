'use client';

import { CREATE_ENUM, UPDATE_ENUM } from '@/lib/graphql/queries';
import { EnumData, EnumOption } from '@/types';
import { useMutation } from '@apollo/client';
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface EnumEditDialogProps {
  enumData: EnumData | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EnumEditDialog({
  enumData,
  isOpen,
  onClose,
  onSuccess,
}: EnumEditDialogProps) {
  const [key, setKey] = useState('');
  const [options, setOptions] = useState<EnumOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = !!enumData;

  const [createEnum] = useMutation(CREATE_ENUM, {
    onCompleted: () => {
      toast.success('Enum created successfully!');
      onSuccess();
    },
    onError: (error) => {
      console.error('Error creating enum:', error);
      toast.error('Failed to create enum');
      setIsSubmitting(false);
    },
  });

  const [updateEnum] = useMutation(UPDATE_ENUM, {
    onCompleted: () => {
      toast.success('Enum updated successfully!');
      onSuccess();
    },
    onError: (error) => {
      console.error('Error updating enum:', error);
      toast.error('Failed to update enum');
      setIsSubmitting(false);
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (enumData) {
        setKey(enumData.key);
        setOptions([...enumData.options]);
      } else {
        setKey('');
        setOptions([]);
      }
    }
  }, [isOpen, enumData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!key.trim()) {
      toast.error('Enum key is required');
      return;
    }

    if (options.length === 0) {
      toast.error('At least one option is required');
      return;
    }

    // Validate unique values
    const values = options.map(option => option.id);
    const uniqueValues = new Set(values);
    if (values.length !== uniqueValues.size) {
      toast.error('Option values must be unique');
      return;
    }

    // Validate empty values/labels
    for (const option of options) {
      if (!option.id.trim() || !option.label.trim()) {
        toast.error('All options must have both value and label');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Clean options to remove __typename and preserve id
      const cleanOptions = options.map(option => ({
        id: option.id,
        value: option.value,
        label: option.label,
      }));

      if (isEdit) {
        await updateEnum({
          variables: {
            key: enumData!.key,
            input: { options: cleanOptions },
          },
        });
      } else {
        await createEnum({
          variables: {
            input: {
              key: key.trim(),
              options: cleanOptions,
            },
          },
        });
      }
    } catch (error) {
      console.error('Error saving enum:', error);
    }
  };

  const addOption = () => {
    setOptions([...options, { id: '', value: '', label: '' }]);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index: number, field: 'value' | 'label', value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {isEdit ? 'Edit Enum' : 'Create New Enum'}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Enum Key */}
              <div className="mb-4">
                <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-2">
                  Enum Key
                </label>
                <input
                  type="text"
                  id="key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  disabled={isEdit}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${isEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  placeholder="e.g., APP_STATUS"
                  required
                />
                {isEdit && (
                  <p className="mt-1 text-xs text-gray-500">
                    Enum key cannot be changed after creation
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Options
                  </label>
                  <button
                    type="button"
                    onClick={addOption}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100"
                  >
                    <PlusIcon className="h-3 w-3 mr-1" />
                    Add Option
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={option.value}
                          onChange={(e) => updateOption(index, 'value', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                          placeholder="Value (e.g., DRAFT)"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={option.label}
                          onChange={(e) => updateOption(index, 'label', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                          placeholder="Label (e.g., Draft)"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                        disabled={options.length === 1}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {options.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No options added yet. Click "Add Option" to get started.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSubmitting || !key.trim() || options.length === 0}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : (isEdit ? 'Update Enum' : 'Create Enum')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
