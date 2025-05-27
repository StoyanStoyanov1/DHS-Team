import React, { useState, useEffect } from 'react';
import { Check, X, CircleDot } from 'lucide-react';

interface BooleanColumnFilterProps {
  value: string | boolean | null;
  onChange: (value: boolean | null) => void;
  onApply: (value: boolean | null) => void;
  onClose?: () => void;
  labelTrue?: string;
  labelFalse?: string;
  labelAll?: string;
}

const BooleanColumnFilter: React.FC<BooleanColumnFilterProps> = ({
  value = null,
  onChange,
  onApply,
  onClose,
  labelTrue = 'True',
  labelFalse = 'False',
  labelAll = 'All'
}) => {
  const getInitialValue = (): boolean | null => {
    if (typeof value === 'boolean') {
      return value;
    }
    
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    return null;
  };

  const [selectedValue, setSelectedValue] = useState<boolean | null>(getInitialValue());
  const [originalValue, setOriginalValue] = useState<boolean | null>(getInitialValue());

  useEffect(() => {
    const initialValue = getInitialValue();
    setSelectedValue(initialValue);
    setOriginalValue(initialValue);
  }, [value]);

  const handleSelect = (newValue: boolean | null) => {
    if (newValue === true) {
      setSelectedValue(true);
    } else if (newValue === false) {
      setSelectedValue(false);
    } else {
      setSelectedValue(null);
    }
  };

  const handleApply = () => {
    if (selectedValue === true) {
      onChange(true);
      onApply(true);
    } else if (selectedValue === false) {
      onChange(false);
      onApply(false);
    } else {
      onChange(null);
      onApply(null);
    }
  };

  const handleCancel = () => {
    if (originalValue === true) {
      setSelectedValue(true);
    } else if (originalValue === false) {
      setSelectedValue(false);
    } else {
      setSelectedValue(null);
    }
    
    if (onClose) onClose();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden w-56">
      <div className="p-2">
        <div className="space-y-1.5 mb-2">
          {/* All option */}
          <div 
            className={`flex items-center p-1.5 rounded cursor-pointer transition-colors
              ${selectedValue === null 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            onClick={() => handleSelect(null)}
          >
            <div className={`w-4 h-4 border-2 rounded-full mr-2 flex items-center justify-center
              ${selectedValue === null ? 'border-blue-500 dark:border-blue-400' : 'border-gray-300 dark:border-gray-600'}`}>
              {selectedValue === null && (
                <CircleDot size={12} className="text-blue-500 dark:text-blue-400" />
              )}
            </div>
            <span className={`text-xs ${selectedValue === null ? 'font-medium' : ''} dark:text-gray-200`}>{labelAll}</span>
          </div>

          {/* True option */}
          <div 
            className={`flex items-center p-1.5 rounded cursor-pointer transition-colors
              ${selectedValue === true 
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            onClick={() => handleSelect(true)}
          >
            <div className={`flex-shrink-0 w-4 h-4 rounded-full mr-2 flex items-center justify-center
              ${selectedValue === true ? 'bg-green-500 dark:bg-green-600' : 'bg-green-100 dark:bg-green-800/30'}`}>
              {selectedValue === true && (
                <Check size={10} className="text-white" />
              )}
            </div>
            <span className={`text-xs ${selectedValue === true ? 'font-medium' : ''} dark:text-gray-200`}>{labelTrue}</span>
          </div>

          {/* False option */}
          <div 
            className={`flex items-center p-1.5 rounded cursor-pointer transition-colors
              ${selectedValue === false 
                ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            onClick={() => handleSelect(false)}
          >
            <div className={`flex-shrink-0 w-4 h-4 rounded-full mr-2 flex items-center justify-center
              ${selectedValue === false ? 'bg-red-500 dark:bg-red-600' : 'bg-red-100 dark:bg-red-800/30'}`}>
              {selectedValue === false && (
                <X size={10} className="text-white" />
              )}
            </div>
            <span className={`text-xs ${selectedValue === false ? 'font-medium' : ''} dark:text-gray-200`}>{labelFalse}</span>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={handleCancel}
            className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-2 py-1 text-xs text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 rounded transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default BooleanColumnFilter;