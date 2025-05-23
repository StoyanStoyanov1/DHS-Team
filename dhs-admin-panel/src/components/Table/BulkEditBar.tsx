import React, { useState, useEffect, useCallback } from 'react';
import { Check, X, AlertTriangle, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';

export interface EditableColumn<T> {
  columnKey: Extract<keyof T, string>;
  label: string;
  type: 'text' | 'select' | 'boolean' | 'multiselect' | 'number';
  options?: Array<{ label: string; value: any }>;
  minValue?: number;
  maxValue?: number;
  step?: number;
  validator?: (value: any) => boolean | string;
  trueLabel?: string;
  falseLabel?: string;
}

interface BulkEditBarProps<T> {
  selectedItems: T[];
  editableColumns: EditableColumn<T>[];
  onBulkEdit: (selectedItems: T[], columnKey: string, newValue: any) => Promise<void>;
  onCancel: () => void;
  pageTitle?: string; // Name of the page/entity type (e.g., "Users", "Products")
}

function BulkEditBar<T>({
  selectedItems,
  editableColumns,
  onBulkEdit,
  onCancel,
  pageTitle = 'Items', // Default to "Items" if no page title is provided
}: BulkEditBarProps<T>) {
  // Add state to track client-side rendering
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state when component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Tracks which columns have been enabled for editing
  const [enabledColumns, setEnabledColumns] = useState<Record<string, boolean>>({});

  // Store field values being edited
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize enabledColumns and fieldValues
  useEffect(() => {
    const initialEnabled: Record<string, boolean> = {};
    const initialValues: Record<string, any> = {};

    editableColumns.forEach(column => {
      initialEnabled[column.columnKey as string] = false;

      // Set default values based on type
      if (column.type === 'boolean') {
        initialValues[column.columnKey as string] = null;
      } else if (column.type === 'select') {
        initialValues[column.columnKey as string] = '';
      } else if (column.type === 'multiselect') {
        initialValues[column.columnKey as string] = [];
      } else if (column.type === 'number') {
        initialValues[column.columnKey as string] = null;
      } else {
        initialValues[column.columnKey as string] = '';
      }
    });

    setEnabledColumns(initialEnabled);
    setFieldValues(initialValues);
  }, [editableColumns]);

  // Handle toggling a column for editing
  const handleToggleColumn = (columnKey: string) => {
    setEnabledColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  // Handle change in field value
  const handleFieldValueChange = (columnKey: string, value: any) => {
    setFieldValues(prev => ({
      ...prev,
      [columnKey]: value
    }));
  };

  // Check if any changes have been made
  const hasChanges = () => {
    return Object.entries(enabledColumns).some(([key, isEnabled]) => 
      isEnabled && fieldValues[key] !== null && fieldValues[key] !== '' && 
      (Array.isArray(fieldValues[key]) ? fieldValues[key].length > 0 : true)
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const enabledColumnsArray = Object.entries(enabledColumns)
      .filter(([_, isEnabled]) => isEnabled)
      .map(([key]) => key);

    if (enabledColumnsArray.length === 0) {
      setError('Please select at least one field to edit');
      return;
    }

    // For each enabled column, validate and apply changes
    try {
      setIsSubmitting(true);
      setError(null);

      // Process each enabled column one by one
      for (const columnKey of enabledColumnsArray) {
        const column = editableColumns.find(col => col.columnKey === columnKey);
        const value = fieldValues[columnKey];

        // Skip if no value is selected
        if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
          continue;
        }

        // Validate if there's a validator
        if (column?.validator) {
          const validationResult = column.validator(value);
          if (typeof validationResult === 'string') {
            setError(validationResult);
            setIsSubmitting(false);
            return;
          } else if (validationResult === false) {
            setError(`Invalid value for ${column.label}`);
            setIsSubmitting(false);
            return;
          }
        }

        // Apply the bulk edit
        await onBulkEdit(selectedItems, columnKey, value);
      }

      // Reset form after successful submission
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error occurred during processing');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle ESC key to close the modal
  const handleEscKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && !isSubmitting) {
      onCancel();
    } else if (e.key === 'Enter' && hasChanges() && !isSubmitting) {
      // Only trigger form submission with Enter if there are changes and not already submitting
      // This prevents accidental submission when using Enter in text inputs
      if (document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'SELECT' && 
          document.activeElement?.tagName !== 'TEXTAREA') {
        const form = document.getElementById('bulk-edit-form');
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }
    }
  }, [onCancel, hasChanges, isSubmitting]);

  // Add event listener for ESC key only when component is mounted
  useEffect(() => {
    if (isMounted) {
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [handleEscKey, isMounted]);

  // Render input control based on column type
  const renderInputControl = (column: EditableColumn<T>) => {
    const { columnKey, type, options, minValue, maxValue, step = 1 } = column;
    const value = fieldValues[columnKey];

    if (!enabledColumns[columnKey]) {
      return (
        <div className="text-gray-500 dark:text-gray-400 italic text-sm transition-colors duration-200">Enable this field to edit</div>
      );
    }

    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
            value={value || ''}
            onChange={(e) => handleFieldValueChange(columnKey, e.target.value)}
            placeholder={`Enter ${column.label.toLowerCase()}`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
            value={value === null ? '' : value}
            min={minValue}
            max={maxValue}
            step={step}
            onChange={(e) => handleFieldValueChange(columnKey, e.target.valueAsNumber || null)}
            placeholder={`Enter ${column.label.toLowerCase()}`}
          />
        );

      case 'select':
        return (
          <select
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            value={value === null ? '' : value}
            onChange={(e) => handleFieldValueChange(columnKey, e.target.value)}
          >
            <option value="" className="dark:bg-gray-700">-- Select {column.label.toLowerCase()} --</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value} className="dark:bg-gray-700">
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <select
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            value={value || []}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
              handleFieldValueChange(columnKey, selectedOptions);
            }}
            multiple
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value} className="dark:bg-gray-700">
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'boolean':
        const trueLabel = column.trueLabel || 'Active';
        const falseLabel = column.falseLabel || 'Inactive';

        return (
          <div className="space-y-3">
            <div 
              className={`flex items-center gap-3 p-2 rounded-md border cursor-pointer transition-all ${
                value === true 
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-400' 
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
              onClick={() => handleFieldValueChange(columnKey, true)}
            >
              <div className={`p-1 rounded-full ${value === true ? 'bg-indigo-600 dark:bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}>
                <ToggleRight size={18} />
              </div>
              <span className={`font-medium ${value === true ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'} transition-colors duration-200`}>{trueLabel}</span>
            </div>

            <div 
              className={`flex items-center gap-3 p-2 rounded-md border cursor-pointer transition-all ${
                value === false 
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-400' 
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
              onClick={() => handleFieldValueChange(columnKey, false)}
            >
              <div className={`p-1 rounded-full ${value === false ? 'bg-indigo-600 dark:bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}>
                <ToggleLeft size={18} />
              </div>
              <span className={`font-medium ${value === false ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300'} transition-colors duration-200`}>{falseLabel}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Don't render anything during SSR or if no items are selected
  if (!isMounted || selectedItems.length === 0) return null;

  // Convert pageTitle to singular if needed (simple English rule)
  const singularTitle = pageTitle.endsWith('s') ? pageTitle.slice(0, -1) : pageTitle;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center overflow-y-auto"
        onClick={(e) => {
          // Close when clicking the overlay (outside the modal)
          if (e.target === e.currentTarget) {
            onCancel();
          }
        }}
      >
        {/* Modal */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-black/30 p-6 w-[550px] max-w-[90%] z-50 animate-scale-in max-h-[90vh] overflow-y-auto transition-colors duration-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white transition-colors duration-200">
              Update {pageTitle}
            </h3>
            <button
              type="button"
              className="p-1 rounded-full text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
              onClick={onCancel}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">
              Updating {selectedItems.length} {selectedItems.length === 1 ? singularTitle : pageTitle}
            </p>
          </div>

          <form id="bulk-edit-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Fields to edit */}
            <div className="space-y-4">
              {editableColumns.map((column) => (
                <div key={column.columnKey} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-semibold text-gray-800 dark:text-white transition-colors duration-200">{column.label}</h4>
                    </div>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        enabledColumns[column.columnKey] ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                      onClick={() => handleToggleColumn(column.columnKey)}
                    >
                      <span 
                        className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-200 shadow ring-0 transition duration-200 ease-in-out ${
                          enabledColumns[column.columnKey] ? 'translate-x-5' : 'translate-x-0'
                        }`} 
                      />
                    </button>
                  </div>

                  <div className={`transition-all duration-300 ${enabledColumns[column.columnKey] ? 'opacity-100' : 'opacity-50'}`}>
                    {renderInputControl(column)}
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-3 border border-red-200 dark:border-red-800 transition-colors duration-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400 dark:text-red-300" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200
                  ${hasChanges() 
                    ? 'bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 dark:focus:ring-offset-gray-800' 
                    : 'bg-indigo-300 dark:bg-indigo-400/50 cursor-not-allowed'
                  }`}
                disabled={isSubmitting || !hasChanges()}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Applying...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    Apply Changes
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add keyframe animations in a style tag */}
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
          animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
}

export default BulkEditBar;
