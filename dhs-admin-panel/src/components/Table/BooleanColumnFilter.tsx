import React, { useState, useEffect } from 'react';
import { Check, X, Filter } from 'lucide-react';

/**
 * Props for the BooleanColumnFilter component.
 */
interface BooleanColumnFilterProps {
  /** Current filter value - can be a boolean, string representation of boolean, or null (for "All") */
  value: string | boolean | null;
  /** Callback function triggered when the filter value changes */
  onChange: (value: boolean | null) => void;
  /** Callback function triggered when the Apply button is clicked */
  onApply: (value: boolean | null) => void;
  /** Optional callback function triggered when the filter is closed */
  onClose?: () => void;
  /** Custom label for the "True" option (default: "True") */
  labelTrue?: string;
  /** Custom label for the "False" option (default: "False") */
  labelFalse?: string;
  /** Custom label for the "All" option (default: "All") */
  labelAll?: string;
}

/**
 * A component that renders a filter for boolean values in table columns.
 * 
 * This component provides a user-friendly interface for filtering boolean values with three options:
 * - All (null): No filtering, show all values
 * - True: Show only true values
 * - False: Show only false values
 * 
 * The component supports customizable labels for each option and provides visual feedback
 * for the currently selected value.
 */
const BooleanColumnFilter: React.FC<BooleanColumnFilterProps> = ({
  value = null,
  onChange,
  onApply,
  onClose,
  labelTrue = 'True',
  labelFalse = 'False',
  labelAll = 'All'
}) => {
  /**
   * Converts the input value to a standardized boolean | null format.
   * Handles string representations of booleans ('true'/'false') and converts them to actual boolean values.
   * 
   * @returns {boolean | null} The normalized boolean value or null for "All" option
   */
  const getInitialValue = (): boolean | null => {
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return null;
  };

  // State to track the currently selected filter value
  const [selectedValue, setSelectedValue] = useState<boolean | null>(getInitialValue());

  // Update the selected value when the input value changes
  useEffect(() => {
    setSelectedValue(getInitialValue());
  }, [value]);

  /**
   * Updates the selected value when a user clicks on one of the filter options.
   * 
   * @param {boolean | null} newValue - The new filter value selected by the user
   */
  const handleSelect = (newValue: boolean | null) => {
    setSelectedValue(newValue);
  };

  /**
   * Applies the selected filter value when the user clicks the Apply button.
   * Calls both onChange and onApply callbacks with the selected value.
   */
  const handleApply = () => {
    onChange(selectedValue);
    onApply(selectedValue);
  };

  /**
   * Closes the filter dropdown/modal without applying changes.
   */
  const handleCancel = () => {
    if (onClose) onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 min-w-[180px]">
      <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-800 flex items-center">
          <Filter size={14} className="mr-1.5 text-gray-500" />
          Filter
        </h3>
      </div>

      <div className="space-y-2 mb-3">
        <div 
          className={`flex items-center p-2 rounded cursor-pointer transition-colors
            ${selectedValue === null ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}
          onClick={() => handleSelect(null)}
        >
          <div className={`w-4 h-4 border border-gray-300 rounded-full mr-2 flex items-center justify-center
            ${selectedValue === null ? 'border-indigo-500 bg-indigo-100' : ''}`}>
            {selectedValue === null && (
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            )}
          </div>
          <span className="text-sm">{labelAll}</span>
        </div>

        <div 
          className={`flex items-center p-2 rounded cursor-pointer transition-colors
            ${selectedValue === true ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50'}`}
          onClick={() => handleSelect(true)}
        >
          <div className={`flex-shrink-0 w-4 h-4 rounded-full mr-2 flex items-center justify-center
            ${selectedValue === true ? 'bg-green-500' : 'bg-green-100'}`}>
            {selectedValue === true && (
              <Check size={10} className="text-white" />
            )}
          </div>
          <span className="text-sm">{labelTrue}</span>
        </div>

        <div 
          className={`flex items-center p-2 rounded cursor-pointer transition-colors
            ${selectedValue === false ? 'bg-red-50 text-red-700' : 'hover:bg-gray-50'}`}
          onClick={() => handleSelect(false)}
        >
          <div className={`flex-shrink-0 w-4 h-4 rounded-full mr-2 flex items-center justify-center
            ${selectedValue === false ? 'bg-red-500' : 'bg-red-100'}`}>
            {selectedValue === false && (
              <X size={10} className="text-white" />
            )}
          </div>
          <span className="text-sm">{labelFalse}</span>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={handleCancel}
          className="px-3 py-1 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="px-3 py-1 text-xs text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default BooleanColumnFilter;
