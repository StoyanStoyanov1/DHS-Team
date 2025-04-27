'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface TableSizeControlsProps {
  itemsPerPage: number;
  setItemsPerPage: (size: number) => void;
  options?: Array<{size: number, available: boolean}>;
}

/**
 * Component for controlling the table size (rows per page)
 */
const TableSizeControls: React.FC<TableSizeControlsProps> = ({
  itemsPerPage,
  setItemsPerPage,
  options = [
    { size: 5, available: true },
    { size: 10, available: true },
    { size: 15, available: true },
    { size: 25, available: true },
    { size: 50, available: true }
  ],
}) => {
  const [isTableSizeOpen, setIsTableSizeOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsTableSizeOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTableSizeDropdown = () => {
    setIsTableSizeOpen(!isTableSizeOpen);
  };

  const handleRowCountSelect = (count: number, available: boolean) => {
    if (available) {
      setItemsPerPage(count);
      setIsTableSizeOpen(false);
    }
  };

  return (
    <div className="flex justify-end items-center">
      <label htmlFor="tableSize" className="text-sm font-medium text-gray-700 mr-2">
        Rows per page:
      </label>
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          type="button"
          onClick={toggleTableSizeDropdown}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 ease-in-out bg-white border border-gray-200 shadow-sm"
          id="table-size-button"
          aria-expanded={isTableSizeOpen}
          aria-haspopup="true"
        >
          <span>{itemsPerPage}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isTableSizeOpen ? 'rotate-180' : ''}`} />
        </button>

        {isTableSizeOpen && (
          <div 
            className="absolute right-0 z-50 mt-1 w-24 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none overflow-hidden transition-all duration-200 ease-in-out transform scale-100 opacity-100"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="table-size-button"
            tabIndex={-1}
          >
            <div className="py-1">
              {options.map((option) => (
                option.available ? (
                  <button
                    key={option.size}
                    onClick={() => handleRowCountSelect(option.size, option.available)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                      itemsPerPage === option.size
                        ? 'bg-blue-500 text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-50 cursor-pointer'
                    }`}
                    role="menuitem"
                    tabIndex={-1}
                  >
                    {option.size}
                  </button>
                ) : (
                  <div
                    key={option.size}
                    className="w-full text-left px-4 py-2 text-sm bg-gray-100 text-gray-500"
                    aria-disabled="true"
                  >
                    {option.size}
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableSizeControls;