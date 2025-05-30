import React, { useEffect, useCallback, useState } from 'react';
import { X } from 'lucide-react';
import { ITableColumn } from './interfaces';

interface AddItemModalProps<T> {
  isOpen: boolean;
  columns: ITableColumn<T>[];
  onSave: (newItem: T) => void;
  onCancel: () => void;
}

function AddItemModal<T>({
  isOpen,
  columns,
  onSave,
  onCancel,
}: AddItemModalProps<T>) {
  // Add state to track client-side rendering
  const [isMounted, setIsMounted] = useState(false);
  
  // Create an empty item based on columns
  const createEmptyItem = useCallback(() => {
    const emptyItem = {} as T;
    columns.forEach(column => {
      if (column.key && column.key !== '_actions') {
        // Set default values based on field type
        if (column.fieldDataType === 'boolean') {
          (emptyItem as any)[column.key] = false;
        } else if (column.fieldDataType === 'number') {
          (emptyItem as any)[column.key] = 0;
        } else if (column.fieldDataType === 'date') {
          (emptyItem as any)[column.key] = null;
        } else if (column.fieldDataType === 'array') {
          (emptyItem as any)[column.key] = [];
        } else {
          (emptyItem as any)[column.key] = '';
        }
      }
    });
    return emptyItem;
  }, [columns]);

  // State to store the new item values
  const [newItem, setNewItem] = useState<T>(createEmptyItem());

  // Set mounted state when component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset the form when modal opens
  useEffect(() => {
    if (isOpen) {
      setNewItem(createEmptyItem());
    }
  }, [isOpen, createEmptyItem]);

  // Handle ESC key to close
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      onCancel();
    }
  }, [isOpen, onCancel]);

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

  // Handle input change
  const handleInputChange = (columnKey: string, value: any) => {
    setNewItem(prev => ({
      ...prev,
      [columnKey]: value
    }));
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-3xl animate-scale-in">
          <div className="px-6 py-5">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Add New Item
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

            <div className="mt-3 max-h-[60vh] overflow-y-auto px-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {columns.map((column) => {
                  // Skip columns that don't have a key or are not meant to be displayed
                  if (!column.key || column.key === '_actions') return null;

                  const value = (newItem as any)[column.key];

                  return (
                    <div key={column.key} className="mb-4 w-full">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {column.header}
                      </label>

                      {column.fieldDataType === 'boolean' ? (
                        <select
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                          value={value ? 'true' : 'false'}
                          onChange={(e) => handleInputChange(column.key, e.target.value === 'true')}
                        >
                          <option value="true">{column.labelTrue || 'Active'}</option>
                          <option value="false">{column.labelFalse || 'Inactive'}</option>
                        </select>
                      ) : column.fieldDataType === 'enum' || column.fieldDataType === 'role' ? (
                        <select
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                          value={value}
                          onChange={(e) => handleInputChange(column.key, e.target.value)}
                        >
                          <option value="">Select {column.header}</option>
                          {column.filterOptions ? (
                            column.filterOptions.map(option => (
                              <option key={option.id} value={option.value}>
                                {option.label}
                              </option>
                            ))
                          ) : column.getFilterOptions ? (
                            // Use getFilterOptions to generate options from data
                            column.getFilterOptions([]).map(option => (
                              <option key={option.id} value={option.value}>
                                {option.label}
                              </option>
                            ))
                          ) : column.fieldDataType === 'role' ? (
                            // Default role options if none provided
                            <>
                              <option value="admin">Admin</option>
                              <option value="user">User</option>
                              <option value="editor">Editor</option>
                              <option value="viewer">Viewer</option>
                            </>
                          ) : (
                            <option value={value}>{value}</option>
                          )}
                        </select>
                      ) : column.fieldDataType === 'date' ? (
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                          value={value ? new Date(value).toISOString().split('T')[0] : ''}
                          onChange={(e) => handleInputChange(column.key, e.target.value ? new Date(e.target.value) : null)}
                        />
                      ) : (
                        <input
                          type={column.fieldDataType === 'number' ? 'number' : 'text'}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                          value={value || ''}
                          onChange={(e) => handleInputChange(column.key, column.fieldDataType === 'number' ? Number(e.target.value) : e.target.value)}
                        />
                      )}
                    </div>
                  );
                })}
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
                onClick={() => onSave(newItem)}
              >
                Add Item
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
}

export default AddItemModal;