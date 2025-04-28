import React, { useState, useRef, useEffect } from 'react';
import { ITableColumn } from './interfaces';
import { MoreVertical, Eye, EyeOff, Filter as FilterIcon, Check, X } from 'lucide-react';
import { FilterGroup, SelectedFilters } from '../Filter/interfaces';

interface ColumnMenuProps<T> {
  column: ITableColumn<T>;
  data: T[];
  onFilterChange: (columnKey: string, value: any) => void;
  onToggleVisibility: (columnKey: string) => void;
  activeFilters: SelectedFilters;
  onSortChange?: (columnKey: string) => void;
  currentSortKey?: string;
  currentSortDirection?: 'asc' | 'desc' | null;
}

export default function ColumnMenu<T>({
  column,
  data,
  onFilterChange,
  onToggleVisibility,
  activeFilters,
  onSortChange,
  currentSortKey,
  currentSortDirection,
}: ColumnMenuProps<T>) {
  const [filterValue, setFilterValue] = useState<any>(activeFilters[column.key] || null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Get filter options either from column config or generate dynamically from data
  const filterOptions = column.getFilterOptions 
    ? column.getFilterOptions(data)
    : column.filterOptions || [];

  // Check if menu should be shown (when there are available options)
  const shouldShowMenu = column.hideable || column.filterable;
  
  // Check if any filters are active across all columns
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  // Handle clicks outside to close the menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
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
    setIsMenuOpen(!isMenuOpen);
  };

  const handleFilterApply = () => {
    onFilterChange(column.key, filterValue);
    setIsMenuOpen(false); // Close menu after applying filter
  };

  const handleFilterClear = () => {
    setFilterValue(null);
    onFilterChange(column.key, null);
    setIsMenuOpen(false); // Close menu after clearing filter
  };

  const handleToggleVisibility = () => {
    onToggleVisibility(column.key);
    setIsMenuOpen(false); // Close menu after toggling visibility
  };

  // Handle select option change with auto-apply
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterValue(value);
    onFilterChange(column.key, value === '' ? null : value);
    setIsMenuOpen(false); // Close menu after selection
  };

  // Handle checkbox change with auto-apply for multiselect
  const handleCheckboxChange = (value: any, checked: boolean) => {
    const newValue = Array.isArray(filterValue) ? [...filterValue] : [];
    
    if (checked) {
      newValue.push(value);
    } else {
      const index = newValue.indexOf(value);
      if (index !== -1) newValue.splice(index, 1);
    }
    
    setFilterValue(newValue);
    
    // Only apply filter if there are values selected, otherwise clear it
    if (newValue.length > 0) {
      onFilterChange(column.key, newValue);
    } else {
      onFilterChange(column.key, null);
    }
  };

  const renderFilterControls = () => {
    switch (column.filterType) {
      case 'select':
        return (
          <select
            className="w-full p-2 border rounded-md text-sm"
            value={filterValue || ''}
            onChange={handleSelectChange}
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
                  onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                />
                {option.label}
              </label>
            ))}
          </div>
        );
        
      case 'search':
        return (
          <div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border rounded-md text-sm"
              value={filterValue || ''}
              onChange={(e) => setFilterValue(e.target.value)}
            />
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
        );
        
      case 'range':
        return (
          <>
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
          </>
        );
        
      default:
        return <p className="text-xs text-gray-500 italic">No filter available</p>;
    }
  };

  // Only render the menu button if there are options available
  if (!shouldShowMenu) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Button with three dots that toggles the menu */}
      <button 
        onClick={toggleMenu}
        className="text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label="Column Menu"
      >
        <MoreVertical size={14} />
      </button>
      
      {/* Menu with animation - shown only when isMenuOpen is true */}
      {isMenuOpen && (
        <div 
          className="fixed z-50 mt-1 w-60 p-2 bg-white rounded-md shadow-lg border border-gray-200"
          style={{
            animation: 'menuAppear 0.2s ease-out forwards',
            transformOrigin: 'top right',
            top: menuRef.current ? menuRef.current.getBoundingClientRect().bottom + window.scrollY : 0,
            left: menuRef.current ? menuRef.current.getBoundingClientRect().right - 240 : 0,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}