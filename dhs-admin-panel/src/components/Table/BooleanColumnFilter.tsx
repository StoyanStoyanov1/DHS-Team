import React, { useState, useEffect } from 'react';
import { Check, X, Filter } from 'lucide-react';

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
    if (value === true || value === 'true') return true;
    if (value === false || value === 'false') return false;
    return null;
  };
    
  const [selectedValue, setSelectedValue] = useState<boolean | null>(getInitialValue());
  
  useEffect(() => {
    setSelectedValue(getInitialValue());
  }, [value]);
  
  const handleSelect = (newValue: boolean | null) => {
    setSelectedValue(newValue);
  };
  
  const handleApply = () => {
    onChange(selectedValue);
    onApply(selectedValue);
  };
  
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