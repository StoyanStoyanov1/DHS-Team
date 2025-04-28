'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface PageSizeProps {
  itemsPerPage: number;
  setItemsPerPage: (size: number) => void;
  options?: number[];
}

/**
 * Component for controlling the page size (rows per page)
 */
const PageSize: React.FC<PageSizeProps> = ({
  itemsPerPage,
  setItemsPerPage,
  options = [5, 10, 15, 25, 50],
}) => {
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);

  // Handle click on dropdown
  const togglePageSizeDropdown = () => {
    setIsPageSizeOpen(!isPageSizeOpen);
  };

  // Handle selection of row count
  const handleRowCountSelect = (count: number) => {
    setItemsPerPage(count);
    setIsPageSizeOpen(false);
  };

  return (
    <div className="relative">
      <label htmlFor="pageSize" className="block text-sm font-semibold text-gray-700 mb-1">
        Page Size:
      </label>
      <div className="relative inline-block text-left w-40">
        <button
          type="button"
          onClick={togglePageSizeDropdown}
          className="inline-flex w-full justify-between items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="page-size-button"
          aria-expanded={isPageSizeOpen}
          aria-haspopup="true"
        >
          <span className="font-medium">{itemsPerPage} rows</span>
          <ChevronDown className="h-4 w-4 ml-2" aria-hidden="true" />
        </button>

        {/* Dropdown Menu */}
        {isPageSizeOpen && (
          <div 
            className="absolute right-0 z-10 mt-1 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="page-size-button"
            tabIndex={-1}
          >
            <div className="py-1">
              {options.map((size) => (
                <button
                  key={size}
                  onClick={() => handleRowCountSelect(size)}
                  className={`w-full text-left px-4 py-2 text-sm ${
                    itemsPerPage === size
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  role="menuitem"
                  tabIndex={-1}
                >
                  {size} rows
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click outside listener */}
      {isPageSizeOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsPageSizeOpen(false)}
        />
      )}
    </div>
  );
};

export default PageSize;