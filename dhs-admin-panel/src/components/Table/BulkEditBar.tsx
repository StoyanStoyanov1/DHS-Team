import React, { useState } from 'react';
import { Check, X, AlertTriangle, Loader2 } from 'lucide-react';

// Define types for editable columns
export interface EditableColumn<T> {
  columnKey: Extract<keyof T, string>;
  label: string;
  type: 'text' | 'select' | 'boolean' | 'multiselect' | 'number';
  options?: Array<{ label: string; value: any }>;
  minValue?: number;
  maxValue?: number;
  step?: number;
  validator?: (value: any) => boolean | string;
}

interface BulkEditBarProps<T> {
  selectedItems: T[];
  editableColumns: EditableColumn<T>[];
  onBulkEdit: (selectedItems: T[], columnKey: string, newValue: any) => Promise<void>;
  onCancel: () => void;
}

function BulkEditBar<T>({
  selectedItems,
  editableColumns,
  onBulkEdit,
  onCancel,
}: BulkEditBarProps<T>) {
  const [selectedColumn, setSelectedColumn] = useState<EditableColumn<T> | null>(null);
  const [value, setValue] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reset the form when changing the selected column
  const handleColumnChange = (column: EditableColumn<T> | null) => {
    setSelectedColumn(column);
    setValue(null);
    setError(null);
  };
  
  // Handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedColumn) {
      setError('Моля, изберете поле за редактиране');
      return;
    }
    
    // Validate the input value
    if (selectedColumn.validator) {
      const validationResult = selectedColumn.validator(value);
      if (typeof validationResult === 'string') {
        setError(validationResult);
        return;
      } else if (validationResult === false) {
        setError('Въведената стойност не е валидна');
        return;
      }
    }
    
    // Perform the bulk edit operation
    try {
      setIsSubmitting(true);
      setError(null);
      await onBulkEdit(selectedItems, selectedColumn.columnKey, value);
      
      // Reset the form after successful submit
      setSelectedColumn(null);
      setValue(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Възникна грешка при обработката');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render the appropriate input control based on the column type
  const renderInputControl = () => {
    if (!selectedColumn) return null;
    
    switch (selectedColumn.type) {
      case 'text':
        return (
          <input
            type="text"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={value || ''}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Въведете ${selectedColumn.label.toLowerCase()}`}
          />
        );
        
      case 'number':
        return (
          <input
            type="number"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={value === null ? '' : value}
            min={selectedColumn.minValue}
            max={selectedColumn.maxValue}
            step={selectedColumn.step || 1}
            onChange={(e) => setValue(e.target.valueAsNumber || null)}
            placeholder={`Въведете ${selectedColumn.label.toLowerCase()}`}
          />
        );
        
      case 'select':
        return (
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={value === null ? '' : value}
            onChange={(e) => setValue(e.target.value)}
          >
            <option value="">-- Изберете {selectedColumn.label.toLowerCase()} --</option>
            {selectedColumn.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'multiselect':
        return (
          <select
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={value === null ? [] : value}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
              setValue(selectedOptions);
            }}
            multiple
          >
            {selectedColumn.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                name="booleanValue"
                checked={value === true}
                onChange={() => setValue(true)}
              />
              <span className="ml-2">Да</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                name="booleanValue"
                checked={value === false}
                onChange={() => setValue(false)}
              />
              <span className="ml-2">Не</span>
            </label>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // If no items are selected, don't render the bar
  if (selectedItems.length === 0) return null;
  
  return (
    <div className="fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-50 transform translate-y-0 transition-transform duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <form 
          onSubmit={handleSubmit}
          className="p-4 rounded-lg bg-gradient-to-r from-indigo-700 to-purple-700 shadow-xl sm:p-5 flex items-center flex-wrap md:flex-nowrap gap-2 border-t-2 border-indigo-400"
        >
          <div className="flex items-center justify-center bg-indigo-900/60 text-white px-4 py-2 rounded-md">
            <span className="text-white font-medium">{selectedItems.length} {selectedItems.length === 1 ? 'ред' : 'реда'} избрани</span>
          </div>
          
          <div className="flex-grow flex flex-col sm:flex-row gap-x-4 gap-y-2">
            <div className="w-full sm:w-1/3">
              <label htmlFor="columnSelect" className="sr-only">
                Изберете поле
              </label>
              <select
                id="columnSelect"
                className="block w-full px-3 py-2 border border-indigo-300 bg-indigo-800/30 text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-200 focus:border-indigo-300 sm:text-sm"
                value={selectedColumn?.columnKey || ''}
                onChange={(e) => {
                  const column = editableColumns.find(c => c.columnKey === e.target.value);
                  handleColumnChange(column || null);
                }}
              >
                <option value="">-- Изберете поле --</option>
                {editableColumns.map((column) => (
                  <option key={column.columnKey} value={column.columnKey}>
                    {column.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-full sm:w-2/3">
              {selectedColumn && (
                <div className="bg-white bg-opacity-90 rounded-md p-2">
                  <label htmlFor="valueInput" className="sr-only">
                    Нова стойност
                  </label>
                  {renderInputControl()}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-shrink-0 gap-2">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600/50 hover:bg-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
              onClick={onCancel}
            >
              Отказ
            </button>
            <button
              type="submit"
              className={`inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting || !selectedColumn || value === null}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Прилагане...
                </>
              ) : (
                'Прилагане'
              )}
            </button>
          </div>
          
          {error && (
            <div className="w-full mt-2">
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 rounded-sm">
                <p>{error}</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default BulkEditBar;