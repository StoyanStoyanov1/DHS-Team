import React, { useEffect, useCallback, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface EditConfirmationDialogProps {
  isOpen: boolean;
  fieldName: string;
  oldValue: any;
  newValue: any;
  onConfirm: () => void;
  onCancel: () => void;
}

const EditConfirmationDialog: React.FC<EditConfirmationDialogProps> = ({
  isOpen,
  fieldName,
  oldValue,
  newValue,
  onConfirm,
  onCancel,
}) => {
  // Add state to track client-side rendering
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state when component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle ESC key to close and ENTER key to confirm
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'Enter') {
      // Only trigger if not typing in an input field
      if (document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA') {
        onConfirm();
      }
    }
  }, [isOpen, onCancel, onConfirm]);

  // Add event listener for keyboard shortcuts
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, isOpen]);

  // Don't render anything during SSR or if dialog is closed
  if (!isMounted || !isOpen) return null;

  // Format values for display
  const formatValue = (value: any) => {
    if (value === null || value === undefined) return 'None';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  };

  const displayOldValue = formatValue(oldValue);
  const displayNewValue = formatValue(newValue);

  return (
    <div className="fixed inset-0 overflow-y-auto z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-md animate-scale-in">
          <div className="px-6 py-5">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-full p-3">
                  <AlertCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 ml-3">
                  Confirm Changes
                </h3>
              </div>
              <button 
                type="button" 
                className="rounded-md bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none"
                onClick={onCancel}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to update the following field?
              </p>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                <div className="mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Field: </span>
                  <span className="text-gray-900 dark:text-gray-100">{fieldName}</span>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">From: </span>
                  <span className="text-gray-900 dark:text-gray-100">{displayOldValue}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">To: </span>
                  <span className="text-gray-900 dark:text-gray-100">{displayNewValue}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 dark:bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                onClick={onConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EditConfirmationDialog;
