import React, { useState, useEffect, useMemo } from 'react';
import { Check, X, Filter, Search, ChevronUp, ChevronDown } from 'lucide-react';

interface MultiSelectFilterProps {
  options: Array<{ id: string | number; label: string; value: any }>;
  value: any[];
  onChange?: (value: any[]) => void;
  onApply: (value: any[]) => void;
  onClose?: () => void;
  defaultSelectAll?: boolean;
  columnName?: string; // Added to identify column for special handling
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
  
  // Sort options alphabetically by label
  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => a.label.localeCompare(b.label));
  }, [options]);
  
  // Store original values for cancel operation
  const [originalValues, setOriginalValues] = useState<any[]>([]);
  
  // Check if this is a role-based filter with admin and editor only
  const isRoleFilter = useMemo(() => {
    if (!columnName || !columnName.toLowerCase().includes('role')) return false;
    
    // Check if options only contain admin and editor (case insensitive)
    const roleLabels = options.map(opt => opt.label.toLowerCase());
    return (
      roleLabels.includes('admin') && 
      roleLabels.includes('editor') && 
      roleLabels.length <= 3 // Allow for at most one additional role
    );
  }, [options, columnName]);
  
  // Initialize selected values based on the following priority:
  // 1. If active filter values exist (value array has items), use them
  // 2. If it's a role filter with admin and editor, select all options by default
  // 3. If defaultSelectAll is true and no active filter, select all options
  // 4. Otherwise, start with empty selection
  const [selectedValues, setSelectedValues] = useState<any[]>(() => {
    if (Array.isArray(value) && value.length > 0) {
      // Active filter exists, use those values
      return [...value];
    } else if (isRoleFilter) {
      // Special case: role filter with admin and editor should select all by default
      return sortedOptions.map(option => option.value);
    } else if (defaultSelectAll) {
      // No active filter but defaultSelectAll is true
      return sortedOptions.map(option => option.value);
    }
    // Default to empty selection
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
  }, []);
  
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
        setOriginalValues([...value]);
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

  // Cancel/close filter - restore original selections
  const handleCancel = () => {
    setSelectedValues([...originalValues]);
    
    if (onChange) {
      onChange([...originalValues]);
    }
    
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
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-80 overflow-hidden">
      {/* Header with subtle gradient */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter size={16} className="text-indigo-500 mr-2.5" />
            <h3 className="text-sm font-semibold text-gray-700">Filter by</h3>
          </div>
          <div className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
            {selectedValues.length} of {sortedOptions.length}
          </div>
        </div>
      </div>
      
      {/* Selected summary - shows what is being filtered */}
      <div className="px-5 py-3 border-b border-gray-200 bg-indigo-50/40">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-800 font-medium truncate">
            {getSummaryText()}
          </div>
          <button
            type="button"
            onClick={handleToggleAll}
            className="ml-2 text-xs rounded-md px-2.5 py-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium transition-all shadow-sm hover:shadow-md"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>
      
      {/* Search input - only shown when options > 6 */}
      {showSearch && (
        <div className="px-5 py-3 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={15} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search options..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-sm"
            />
            {searchTerm && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button 
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Options list with improved visual feedback */}
      <div className="max-h-64 overflow-y-auto py-2 px-2">
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
                className={`flex items-center p-2.5 hover:bg-gray-50 rounded-md cursor-pointer transition-all duration-200 mx-1 my-1
                  ${isSelected ? 'bg-indigo-50 text-indigo-800 shadow-sm' : 'text-gray-700'}`}
                onClick={() => handleOptionToggle(option)}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center mr-3 border transition-all duration-200 
                  ${isSelected 
                    ? 'bg-indigo-600 border-indigo-600 shadow-md' 
                    : 'border-gray-300 hover:border-indigo-300'}`}>
                  {isSelected && <Check size={14} className="text-white" strokeWidth={3} />}
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
      <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200 flex justify-end space-x-3">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 hover:shadow"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 hover:shadow"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default MultiSelectFilter;