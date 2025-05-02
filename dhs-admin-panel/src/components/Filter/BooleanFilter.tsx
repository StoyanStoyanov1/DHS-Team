// filepath: c:\Users\Besitzer\Desktop\DHS\DHS-Team\dhs-admin-panel\src\components\Filter\BooleanFilter.tsx
import React from 'react';
import { Check, X, ListFilter } from 'lucide-react';

interface BooleanFilterProps {
  value: string | boolean | null; // Current selected value: true, false, or null (for all)
  onChange: (value: string | boolean | null) => void; // Callback when the value changes
  className?: string;
  labelTrue?: string;
  labelFalse?: string;
  labelAll?: string;
  stats?: {
    all: number;
    true: number;
    false: number;
  };
}

const BooleanFilter: React.FC<BooleanFilterProps> = ({ 
  value = null, 
  onChange, 
  className = '',
  labelTrue = 'Active',
  labelFalse = 'Inactive',
  labelAll = 'All',
  stats
}) => {
  // Convert string 'true'/'false' to boolean if needed
  const currentValue = typeof value === 'string' 
    ? value === 'true' ? true : value === 'false' ? false : null
    : value;

  // Handle value change
  const handleValueChange = (newValue: boolean | null) => {
    onChange(newValue);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center text-sm font-medium text-gray-700">
            <ListFilter size={16} className="mr-1.5 text-gray-500" />
            Filter
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-col space-y-2">
            {/* All option - circle with gray border */}
            <button
              onClick={() => handleValueChange(null)}
              className={`flex items-center px-3 py-2 rounded-md text-sm transition-all
                ${currentValue === null
                  ? 'bg-gray-100 border-gray-300 shadow-sm' 
                  : 'bg-white hover:bg-gray-50'}`}
            >
              <div className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center
                ${currentValue === null ? 'border-indigo-500' : 'border-gray-300'}`}>
                {currentValue === null && (
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                )}
              </div>
              <span className="flex-1">{labelAll}</span>
              {stats && (
                <span className={`text-xs px-2 py-0.5 rounded-full ml-2 
                  ${currentValue === null ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-600'}`}>
                  {stats.all}
                </span>
              )}
            </button>
            
            {/* True option - green circle */}
            <button
              onClick={() => handleValueChange(true)}
              className={`flex items-center px-3 py-2 rounded-md text-sm transition-all
                ${currentValue === true
                  ? 'bg-green-50 border-green-200 shadow-sm' 
                  : 'bg-white hover:bg-gray-50'}`}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center
                ${currentValue === true ? 'bg-green-500' : 'bg-green-100'}`}>
                {currentValue === true && (
                  <Check size={10} className="text-white" />
                )}
              </div>
              <span className="flex-1 ml-2">{labelTrue}</span>
              {stats && (
                <span className={`text-xs px-2 py-0.5 rounded-full ml-2 
                  ${currentValue === true ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {stats.true}
                </span>
              )}
            </button>
            
            {/* False option - red circle */}
            <button
              onClick={() => handleValueChange(false)}
              className={`flex items-center px-3 py-2 rounded-md text-sm transition-all
                ${currentValue === false
                  ? 'bg-red-50 border-red-200 shadow-sm' 
                  : 'bg-white hover:bg-gray-50'}`}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center
                ${currentValue === false ? 'bg-red-500' : 'bg-red-100'}`}>
                {currentValue === false && (
                  <X size={10} className="text-white" />
                )}
              </div>
              <span className="flex-1 ml-2">{labelFalse}</span>
              {stats && (
                <span className={`text-xs px-2 py-0.5 rounded-full ml-2 
                  ${currentValue === false ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'}`}>
                  {stats.false}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooleanFilter;