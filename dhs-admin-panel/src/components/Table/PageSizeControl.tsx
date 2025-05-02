'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// More flexible options interface that supports both simple and advanced use cases
export interface PageSizeOption {
  size: number;
  available?: boolean;
  label?: string;
}

interface PageSizeControlProps {
  itemsPerPage: number;
  setItemsPerPage: (size: number) => void;
  options?: number[] | PageSizeOption[];
  label?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  labelPosition?: 'left' | 'top';
  showRowsText?: boolean;
  compact?: boolean;
}

/**
 * Unified component for controlling page size (rows per page)
 * Can be used in various contexts with flexible styling options
 */
const PageSizeControl: React.FC<PageSizeControlProps> = ({
  itemsPerPage,
  setItemsPerPage,
  options = [5, 10, 15, 25, 50],
  label = 'Rows per page:',
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
  labelPosition = 'left',
  showRowsText = false,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options to consistent format
  const normalizedOptions: PageSizeOption[] = Array.isArray(options) && typeof options[0] === 'number'
    ? (options as number[]).map(size => ({ size, available: true }))
    : (options as PageSizeOption[]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleRowCountSelect = (option: PageSizeOption) => {
    if (option.available !== false) {
      setItemsPerPage(option.size);
      setIsOpen(false);
    }
  };

  const containerClasses = `
    ${labelPosition === 'top' ? 'flex flex-col' : 'flex items-center'}
    ${className}
  `;

  const buttonClasses = `
    inline-flex items-center justify-between gap-2 rounded-md
    ${compact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'}
    font-medium text-gray-700 hover:bg-gray-50 focus:outline-none
    focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
    transition-all duration-200 ease-in-out
    bg-white border border-gray-200 shadow-sm
    ${buttonClassName}
  `;

  const labelClasses = `
    ${compact ? 'text-xs' : 'text-sm'} font-medium text-gray-700
    ${labelPosition === 'left' ? 'mr-2' : 'mb-1'}
  `;

  return (
    <div className={containerClasses}>
      {label && (
        <label htmlFor="pageSize" className={labelClasses}>
          {label}
        </label>
      )}
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          type="button"
          onClick={toggleDropdown}
          className={buttonClasses}
          id="page-size-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="font-medium">
            {itemsPerPage}{showRowsText && " rows"}
          </span>
          <ChevronDown 
            className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            aria-hidden="true" 
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div 
            className={`
              absolute right-0 z-50 mt-1 w-auto min-w-[80px] origin-top-right
              rounded-md bg-white shadow-lg ring-1 ring-black/5
              focus:outline-none overflow-hidden
              transition-all duration-200 ease-in-out
              transform scale-100 opacity-100
              ${dropdownClassName}
            `}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="page-size-button"
            tabIndex={-1}
          >
            <div className="py-1">
              {normalizedOptions.map((option) => (
                option.available !== false ? (
                  <button
                    key={option.size}
                    onClick={() => handleRowCountSelect(option)}
                    className={`
                      w-full text-left px-4 py-2
                      ${compact ? 'text-xs' : 'text-sm'}
                      transition-colors duration-150
                      ${itemsPerPage === option.size
                        ? 'bg-blue-500 text-white font-medium'
                        : 'text-gray-700 hover:bg-gray-50 cursor-pointer'
                      }
                    `}
                    role="menuitem"
                    tabIndex={-1}
                  >
                    {option.label || option.size}{showRowsText && " rows"}
                  </button>
                ) : (
                  <div
                    key={option.size}
                    className={`
                      w-full text-left px-4 py-2 
                      ${compact ? 'text-xs' : 'text-sm'} 
                      bg-gray-100 text-gray-500
                    `}
                    aria-disabled="true"
                  >
                    {option.label || option.size}{showRowsText && " rows"}
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

export default PageSizeControl;