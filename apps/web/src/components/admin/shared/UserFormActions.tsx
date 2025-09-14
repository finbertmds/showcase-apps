'use client';

interface UserFormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  submitText?: string;
  cancelText?: string;
}

export function UserFormActions({
  isSubmitting,
  onCancel,
  submitText = 'Create User',
  cancelText = 'Cancel',
}: UserFormActionsProps) {
  return (
    <div className="flex justify-end space-x-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        disabled={isSubmitting}
      >
        {cancelText}
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Processing...' : submitText}
      </button>
    </div>
  );
}
