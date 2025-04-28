'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ITableColumn } from './interfaces';
import { ChevronDown, Eye, EyeOff, Filter as FilterIcon, Check, X } from 'lucide-react';
import { FilterGroup, SelectedFilters } from '../Filter/interfaces';

interface ColumnMenuProps<T> {
  column: ITableColumn<T>;
  data: T[];
  onFilterChange: (columnKey: string, value: any) => void;
  onToggleVisibility: (columnKey: string) => void;
  activeFilters: SelectedFilters;
}

export default function ColumnMenu<T>({
  column,
  data,
  onFilterChange,
  onToggleVisibility,
  activeFilters,
}: ColumnMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<any>(activeFilters[column.key] || null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Get filter options either from column config or generate dynamically from data
  const filterOptions = column.getFilterOptions 
    ? column.getFilterOptions(data)
    : column.filterOptions || [];

  // Handle click outside to close the menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize filter value from active filters
  useEffect(() => {
    setFilterValue(activeFilters[column.key] || null);
  }, [activeFilters, column.key]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterApply = () => {
    onFilterChange(column.key, filterValue);
    setIsOpen(false);
  };

  const handleFilterClear = () => {
    setFilterValue(null);
    onFilterChange(column.key, null);
    setIsOpen(false);
  };

  const handleToggleVisibility = () => {
    onToggleVisibility(column.key);
    setIsOpen(false);
  };

  const renderFilterControls = () => {
    switch (column.filterType) {
      case 'select':
        return (
          <select
            className="w-full p-2 border rounded-md text-sm"
            value={filterValue || ''}
            onChange={(e) => setFilterValue(e.target.value)}
          >
            <option value="">All</option>
            {filterOptions.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'multiselect':
        return (
          <div className="max-h-40 overflow-y-auto border rounded-md">
            {filterOptions.map((option) => (
              <label 
                key={option.id} 
                className="flex items-center p-2 hover:bg-indigo-50 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="rounded text-indigo-600 mr-2"
                  checked={Array.isArray(filterValue) && filterValue.includes(option.value)}
                  onChange={(e) => {
                    const newValue = Array.isArray(filterValue) ? [...filterValue] : [];
                    if (e.target.checked) {
                      newValue.push(option.value);
                    } else {
                      const index = newValue.indexOf(option.value);
                      if (index !== -1) newValue.splice(index, 1);
                    }
                    setFilterValue(newValue);
                  }}
                />
                {option.label}
              </label>
            ))}
          </div>
        );
        
      case 'search':
        return (
          <input
            type="text"
            placeholder="Search..."
            className="w-full p-2 border rounded-md text-sm"
            value={filterValue || ''}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        );
        
      case 'range':
        return (
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/2 p-2 border rounded-md text-sm"
              value={filterValue?.min || ''}
              onChange={(e) => setFilterValue({
                ...filterValue || {},
                min: e.target.value ? Number(e.target.value) : null
              })}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/2 p-2 border rounded-md text-sm"
              value={filterValue?.max || ''}
              onChange={(e) => setFilterValue({
                ...filterValue || {},
                max: e.target.value ? Number(e.target.value) : null
              })}
            />
          </div>
        );
        
      default:
        return <p className="text-xs text-gray-500 italic">No filter available</p>;
    }
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="ml-2 text-gray-400 hover:text-gray-700 focus:outline-none"
        aria-label="Column options"
      >
        <ChevronDown size={14} />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-60 p-2 bg-white rounded-md shadow-lg border border-gray-200">
          <div className="mb-3 py-1 border-b border-gray-100">
            <h3 className="font-medium text-sm text-gray-800 mb-1">Column: {column.header}</h3>
          </div>
          
          {column.hideable && (
            <div className="py-1 mb-2 border-b border-gray-100">
              <button
                onClick={handleToggleVisibility}
                className="flex items-center w-full px-2 py-1 text-sm text-left hover:bg-gray-50 rounded-md"
              >
                {column.hidden ? (
                  <>
                    <Eye size={15} className="mr-2 text-indigo-600" />
                    <span>Show Column</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={15} className="mr-2 text-gray-600" />
                    <span>Hide Column</span>
                  </>
                )}
              </button>
            </div>
          )}
          
          {column.filterable && (
            <div className="py-1">
              <div className="mb-2">
                <div className="flex items-center mb-1">
                  <FilterIcon size={14} className="mr-1.5 text-indigo-600" />
                  <span className="text-sm font-medium">Filter</span>
                </div>
                {renderFilterControls()}
              </div>
              
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  onClick={handleFilterClear}
                  className="px-2 py-1 text-xs border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  Clear
                </button>
                <button
                  onClick={handleFilterApply}
                  className="px-2 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}