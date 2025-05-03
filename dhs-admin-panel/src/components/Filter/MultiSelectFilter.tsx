import React, { useState, useEffect, useMemo } from 'react';
import { Check, X, Filter, Search } from 'lucide-react';

interface MultiSelectFilterProps {
  options: Array<{ id: string | number; label: string; value: any }>;
  value: any[];
  onChange?: (value: any[]) => void;
  onApply: (value: any[]) => void;
  onClose?: () => void;
  defaultSelectAll?: boolean;
  columnName?: string;
}

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  options,
  value = [],
  onChange,
  onApply,
  onClose,
  defaultSelectAll = true,
  columnName
}) => {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sort options alphabetically
  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => a.label.localeCompare(b.label));
  }, [options]);
  
  // Original values for cancel operation
  const [originalValues, setOriginalValues] = useState<any[]>([]);
  
  // Check if this is a role filter
  const isRoleFilter = useMemo(() => {
    if (!columnName || !columnName.toLowerCase().includes('role')) return false;
    const roleLabels = options.map(opt => opt.label.toLowerCase());
    return (
      roleLabels.includes('admin') && 
      roleLabels.includes('editor') && 
      roleLabels.length <= 3
    );
  }, [options, columnName]);
  
  // Initialize selected values
  const [selectedValues, setSelectedValues] = useState<any[]>(() => {
    if (Array.isArray(value) && value.length > 0) {
      return [...value];
    } else if (isRoleFilter || defaultSelectAll) {
      return sortedOptions.map(option => option.value);
    }
    return [];
  });
  
  // Store original values when component mounts
  useEffect(() => {
    if (Array.isArray(value) && value.length > 0) {
      setOriginalValues([...value]);
    } else if (isRoleFilter || defaultSelectAll) {
      setOriginalValues(sortedOptions.map(option => option.value));
    } else {
      setOriginalValues([]);
    }
    
    // Initialize selected values with original values
    if (Array.isArray(value) && value.length > 0) {
      setSelectedValues([...value]);
    } else if (isRoleFilter || defaultSelectAll) {
      setSelectedValues(sortedOptions.map(option => option.value));
    } else {
      setSelectedValues([]);
    }
  }, []);
  
  // Check if all options are selected
  const allSelected = selectedValues.length === sortedOptions.length &&
    sortedOptions.every(option => selectedValues.includes(option.value));
  
  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return sortedOptions;
    return sortedOptions.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, sortedOptions]);

  // Update local state when external value changes
  useEffect(() => {
    if (Array.isArray(value) && value.length > 0) {
      setSelectedValues([...value]);
      setOriginalValues([...value]);
    }
  }, [value]);
  
  // Handle select/deselect all
  const handleToggleAll = () => {
    const newValues = allSelected ? [] : sortedOptions.map(option => option.value);
    setSelectedValues(newValues);
    if (onChange) onChange(newValues);
  };

  // Handle checkbox change for individual options
  const handleOptionToggle = (option: { id: string | number; label: string; value: any }) => {
    const isSelected = selectedValues.includes(option.value);
    let newValues = isSelected
      ? selectedValues.filter(v => v !== option.value)
      : [...selectedValues, option.value];
    
    setSelectedValues(newValues);
    if (onChange) onChange(newValues);
  };

  // Apply filter
  const handleApply = () => {
    const isDefault = selectedValues.length === sortedOptions.length && 
      sortedOptions.every(option => selectedValues.includes(option.value));
    onApply(isDefault ? null : selectedValues);
  };
  
  // Check if Apply button should be disabled
  const isApplyDisabled = selectedValues.length === 0;

  // Cancel/close filter
  const handleCancel = () => {
    // Reset to original values without saving changes
    setSelectedValues([...originalValues]);
    // Don't call onChange here to avoid updating parent state
    if (onClose) onClose();
  };
  
  // Show search only when there are more than 5 options
  const showSearch = sortedOptions.length > 5;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 w-72 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <Filter size={14} className="text-indigo-500 mr-1.5" />
          <h3 className="text-xs font-medium text-gray-700">Filter</h3>
        </div>
        <button
          type="button"
          onClick={handleToggleAll}
          className="text-xs rounded px-2 py-0.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      
      {/* Search input */}
      {showSearch && (
        <div className="px-3 py-2 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <Search size={12} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="w-full pl-7 pr-7 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {searchTerm && (
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <button 
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100"
                >
                  <X size={10} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Options list */}
      <div className="max-h-48 overflow-y-auto py-1">
        {filteredOptions.length === 0 ? (
          <div className="p-3 text-center text-gray-500 text-xs">
            No matching options
          </div>
        ) : (
          filteredOptions.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <div 
                key={option.id} 
                className={`flex items-center px-3 py-1.5 hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-indigo-50' : ''}`}
                onClick={() => handleOptionToggle(option)}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center mr-2 border ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'}`}>
                  {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                </div>
                <span className={`text-xs truncate ${isSelected ? 'font-medium text-indigo-700' : 'text-gray-700'}`}>
                  {option.label}
                </span>
              </div>
            );
          })
        )}
      </div>
      
      {/* Footer */}
      <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-3 py-1 text-xs text-gray-600 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleApply}
          disabled={isApplyDisabled}
          className={`px-3 py-1 text-xs text-white border border-transparent rounded shadow-sm
            ${isApplyDisabled 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-indigo-500 hover:bg-indigo-600'}`}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default MultiSelectFilter;