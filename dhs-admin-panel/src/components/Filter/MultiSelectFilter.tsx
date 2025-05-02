import React, { useState, useEffect, useMemo } from 'react';
import { Check, X, Filter, Search, ChevronUp, ChevronDown } from 'lucide-react';

interface MultiSelectFilterProps {
  options: Array<{ id: string | number; label: string; value: any }>;
  value: any[];
  onChange?: (value: any[]) => void;
  onApply: (value: any[]) => void;
  onClose?: () => void;
  defaultSelectAll?: boolean;
}

const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  options,
  value = [],
  onChange,
  onApply,
  onClose,
  defaultSelectAll = true
}) => {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sort options alphabetically by label
  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => a.label.localeCompare(b.label));
  }, [options]);
  
  // Initialize selected values based on the following priority:
  // 1. If active filter values exist (value array has items), use them
  // 2. If defaultSelectAll is true and no active filter, select all options
  // 3. Otherwise, start with empty selection
  const [selectedValues, setSelectedValues] = useState<any[]>(() => {
    if (Array.isArray(value) && value.length > 0) {
      // Active filter exists, use those values
      return [...value];
    } else if (defaultSelectAll) {
      // No active filter but defaultSelectAll is true
      return sortedOptions.map(option => option.value);
    }
    // Default to empty selection
    return [];
  });
  
  // Check if all options are selected
  const allSelected = selectedValues.length === sortedOptions.length &&
    sortedOptions.every(option => selectedValues.includes(option.value));
  
  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return sortedOptions;
    return sortedOptions.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, sortedOptions]);

  // Update local state when external value changes
  useEffect(() => {
    if (Array.isArray(value)) {
      // Only update if there are active filter values
      if (value.length > 0) {
        setSelectedValues([...value]);
      }
    }
  }, [value]);
  
  // Handle select/deselect all
  const handleToggleAll = () => {
    if (allSelected) {
      // Deselect all
      setSelectedValues([]);
    } else {
      // Select all
      setSelectedValues(sortedOptions.map(option => option.value));
    }
    
    if (onChange) {
      onChange(allSelected ? [] : sortedOptions.map(option => option.value));
    }
  };

  // Handle checkbox change for individual options
  const handleOptionToggle = (option: { id: string | number; label: string; value: any }) => {
    const isSelected = selectedValues.includes(option.value);
    let newValues: any[];
    
    if (isSelected) {
      // Remove the value if already selected
      newValues = selectedValues.filter(v => v !== option.value);
    } else {
      // Add the value if not selected
      newValues = [...selectedValues, option.value];
    }
    
    setSelectedValues(newValues);
    
    if (onChange) {
      onChange(newValues);
    }
  };

  // Apply filter
  const handleApply = () => {
    // If all options are selected or none are selected, pass null to indicate default state
    // This will prevent the filter from appearing in the active filters
    const isDefault = selectedValues.length === sortedOptions.length && 
      sortedOptions.every(option => selectedValues.includes(option.value));
      
    onApply(isDefault ? null : selectedValues);
  };

  // Cancel/close filter
  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Clear search term
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  // Calculate summary text for selected options
  const getSummaryText = () => {
    if (selectedValues.length === 0) {
      return 'None selected';
    }
    
    if (allSelected) {
      return 'All selected';
    }
    
    const selectedLabels = sortedOptions
      .filter(option => selectedValues.includes(option.value))
      .map(option => option.label);
    
    if (selectedLabels.length <= 2) {
      return selectedLabels.join(', ');
    }
    
    return `${selectedLabels.slice(0, 2).join(', ')} +${selectedLabels.length - 2} more`;
  };
  
  // Show search only when there are more than 6 options
  const showSearch = sortedOptions.length > 6;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-72 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter size={15} className="text-indigo-500 mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Filter by</h3>
          </div>
          <div className="text-xs text-gray-500">
            {selectedValues.length} of {sortedOptions.length}
          </div>
        </div>
      </div>
      
      {/* Selected summary - shows what is being filtered */}
      <div className="px-4 py-2 border-b border-gray-200 bg-indigo-50/30">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-800 font-medium truncate">
            {getSummaryText()}
          </div>
          <button
            type="button"
            onClick={handleToggleAll}
            className="ml-2 text-xs rounded px-1.5 py-0.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>
      
      {/* Search input - only shown when options > 6 */}
      {showSearch && (
        <div className="px-4 py-2 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={14} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search options..."
              className="w-full pl-9 pr-9 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {searchTerm && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button 
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Options list */}
      <div className="max-h-60 overflow-y-auto p-1">
        {filteredOptions.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No options match your search
          </div>
        ) : (
          filteredOptions.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            return (
              <div 
                key={option.id} 
                className={`flex items-center p-2.5 hover:bg-gray-50 rounded-md cursor-pointer transition-all duration-150 mx-1 my-0.5
                  ${isSelected ? 'bg-indigo-50 text-indigo-800' : 'text-gray-700'}`}
                onClick={() => handleOptionToggle(option)}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 border transition-colors duration-200 
                  ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                  {isSelected && <Check size={14} className="text-white" />}
                </div>
                <span className={`text-sm flex-1 truncate ${isSelected ? 'font-medium' : ''}`}>
                  {option.label}
                </span>
              </div>
            );
          })
        )}
      </div>
      
      {/* Footer with action buttons */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="px-3 py-1.5 text-xs text-white bg-indigo-600 border border-transparent rounded shadow-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default MultiSelectFilter;