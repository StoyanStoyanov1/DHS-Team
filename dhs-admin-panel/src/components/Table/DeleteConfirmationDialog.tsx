import React, { useEffect, useCallback } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  itemCount: number;
  itemType?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  itemCount,
  itemType = 'items',
  onConfirm,
  onCancel,
}) => {
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
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!isOpen) return null;

  // Determine the correct singular or plural form
  const displayItemType = itemCount === 1
    ? itemType.endsWith('s') ? itemType.slice(0, -1) : itemType
    : itemType.endsWith('s') ? itemType : `${itemType}s`;

  return (
    <div className="fixed inset-0 overflow-y-auto z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-md animate-scale-in">
          <div className="px-6 py-5">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-full p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">
                  Delete {itemCount} {displayItemType}?
                </h3>
              </div>
              <button 
                type="button" 
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onCancel}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-3">
              <p className="text-sm text-gray-600">
                Are you sure you want to delete {itemCount === 1 ? 'this' : 'these'} {itemCount} {displayItemType}?
                This action cannot be undone.
              </p>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={onConfirm}
              >
                Delete
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

export default DeleteConfirmationDialog;