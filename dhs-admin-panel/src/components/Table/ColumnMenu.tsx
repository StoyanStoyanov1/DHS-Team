import React, { useState, useRef, useEffect } from 'react';
import { ITableColumn } from './interfaces';
import { Eye, EyeOff, Filter as FilterIcon, Check, X, SearchIcon, ListFilter, ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
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

  // Check if column has an active filter
  const hasActiveFilter = activeFilters[column.key] !== undefined;
  
  // Check if menu should be shown (when there are available options)
  const shouldShowMenu = column.hideable || column.filterable;

  // Initialize filter value from active filters
  useEffect(() => {
    setFilterValue(activeFilters[column.key] || null);
  }, [activeFilters, column.key]);

  // Click outside handler to close any expanded elements
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleFilterApply = () => {
    onFilterChange(column.key, filterValue);
    setIsMenuOpen(false);
  };

  const handleFilterClear = () => {
    setFilterValue(null);
    onFilterChange(column.key, null);
    setIsMenuOpen(false);
  };

  const handleToggleVisibility = () => {
    onToggleVisibility(column.key);
    setIsMenuOpen(false);
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

  // Get appropriate filter icon based on column type
  const getFilterIcon = () => {
    switch (column.filterType) {
      case 'search':
        return <SearchIcon size={14} />;
      case 'select':
      case 'multiselect':
        return <ListFilter size={14} />;
      case 'range':
        return <FilterIcon size={14} />;
      default:
        return <FilterIcon size={14} />;
    }
  };

  const renderFilterControls = () => {
    switch (column.filterType) {
      case 'select':
        return (
          <select
            className="w-full p-1.5 border rounded-md text-sm bg-white transition-all duration-200"
            value={filterValue || ''}
            onChange={handleSelectChange}
            onClick={(e) => e.stopPropagation()}
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
          <div 
            className="max-h-32 overflow-y-auto border rounded-md bg-white shadow-sm transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {filterOptions.map((option) => (
              <label 
                key={option.id} 
                className="flex items-center p-1.5 hover:bg-indigo-50 text-sm cursor-pointer"
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
          <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-1.5 border rounded-md text-sm bg-white transition-all duration-200"
              value={filterValue || ''}
              onChange={(e) => {
                setFilterValue(e.target.value);
              }}
              autoFocus
            />
            <div className="flex space-x-1 mt-2">
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
          <div onClick={(e) => e.stopPropagation()}>
            <div className="flex space-x-1">
              <input
                type="number"
                placeholder="Min"
                className="w-1/2 p-1.5 border rounded-md text-sm bg-white transition-all duration-200"
                value={filterValue?.min || ''}
                onChange={(e) => {
                  setFilterValue({
                    ...filterValue || {},
                    min: e.target.value ? Number(e.target.value) : null
                  });
                }}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-1/2 p-1.5 border rounded-md text-sm bg-white transition-all duration-200"
                value={filterValue?.max || ''}
                onChange={(e) => {
                  setFilterValue({
                    ...filterValue || {},
                    max: e.target.value ? Number(e.target.value) : null
                  });
                }}
              />
            </div>
            <div className="flex space-x-1 mt-2">
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
        
      default:
        return null;
    }
  };

  // Only render the menu if there are options available
  if (!shouldShowMenu) {
    return null;
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Action buttons that appear on hover */}
      <div className={`flex items-center column-menu-actions ${hasActiveFilter ? 'active' : ''}`}>
        {/* Filter button - Show active status with color */}
        {column.filterable && (
          <button 
            onClick={toggleMenu}
            className={`p-1 rounded-md mr-1 focus:outline-none transition-colors duration-150 ${
              hasActiveFilter ? 'text-indigo-600 bg-indigo-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            aria-label={`Filter ${column.header}`}
            title={`Filter ${column.header}`}
          >
            {getFilterIcon()}
          </button>
        )}
        
        {/* Column visibility toggle */}
        {column.hideable && (
          <button 
            onClick={handleToggleVisibility}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors duration-150"
            aria-label={column.hidden ? "Show Column" : "Hide Column"}
            title={column.hidden ? "Show Column" : "Hide Column"}
          >
            {column.hidden ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        )}
      </div>
      
      {/* Menu with animation - shown only when isMenuOpen is true */}
      {isMenuOpen && (
        <div 
          className="absolute z-50 mt-1 min-w-[160px] p-3 bg-white rounded-md shadow-lg border border-gray-200 right-0"
          style={{
            animation: 'menuAppear 0.2s ease-out forwards',
            transformOrigin: 'top right'
          }}
        >
          <div className="mb-2 pb-1 border-b border-gray-100">
            <h3 className="font-medium text-sm text-gray-800">{column.header}</h3>
          </div>
          {renderFilterControls()}
        </div>
      )}
    </div>
  );
}