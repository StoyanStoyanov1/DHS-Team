import React, { useState, useRef, useEffect } from 'react';
import { ITableColumn } from './interfaces';
import { 
  Eye, EyeOff, Filter as FilterIcon, Check, X, Search as SearchIcon, 
  ListFilter, ArrowDownAZ, ArrowUpAZ, Calendar, RotateCcw, Badge
} from 'lucide-react';
import { SelectedFilters } from '../Filter/interfaces';
import FilterRenderer from './FilterRenderer';

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
  const [showSearchFilter, setShowSearchFilter] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const hasActiveFilter = activeFilters[column.key] !== undefined;
  const shouldShowMenu = column.hideable || column.filterable;

  useEffect(() => {
    setFilterValue(activeFilters[column.key] || null);
  }, [activeFilters, column.key]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setShowSearchFilter(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    if (column.filterType === 'search') {
      setShowSearchFilter(!showSearchFilter);
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(!isMenuOpen);
      setShowSearchFilter(false);
    }
  };

  const handleFilterApply = (value: any) => {
    onFilterChange(column.key, value);
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

  const getFilterIcon = () => {
    switch (column.filterType) {
      case 'search':
        return <SearchIcon size={14} />;
      case 'select':
      case 'multiselect':
        return <ListFilter size={14} />;
      case 'daterange':
        return <Calendar size={14} />;
      case 'range':
        return <FilterIcon size={14} />;
      default:
        return <FilterIcon size={14} />;
    }
  };

  if (!shouldShowMenu) {
    return null;
  }

  // Function to get a simplified display of the current filter value
  const getFilterDisplayValue = () => {
    const value = activeFilters[column.key];
    if (!value) return null;

    if (Array.isArray(value)) {
      return `${value.length} selected`;
    } else if (typeof value === 'object' && value !== null) {
      if (value.start || value.end) {
        return 'Date range';
      } else if (value.min !== undefined || value.max !== undefined) {
        return 'Range';
      } else if (value.term !== undefined) {
        return value.term ? `"${value.term}"` : 'Empty';
      }
    } else if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    } else if (value !== '') {
      return String(value);
    }

    return 'Active';
  };

  return (
    <div className="relative" ref={menuRef}>
      <div className={`flex items-center column-menu-actions ${hasActiveFilter ? 'active' : ''}`}>
        {column.filterable && (
          <div className="flex items-center">
            {hasActiveFilter && (
              <div className="flex items-center mr-1">
                <span 
                  className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 cursor-pointer hover:bg-indigo-200"
                  onClick={toggleMenu}
                  title="Click to edit filter"
                >
                  <Badge size={10} className="mr-1" />
                  {getFilterDisplayValue()}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterClear();
                    }}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                    title="Clear filter"
                  >
                    <X size={10} />
                  </button>
                </span>
              </div>
            )}
            <button 
              onClick={toggleMenu}
              className={`p-1 rounded-md mr-1 focus:outline-none transition-colors duration-150 ${
                hasActiveFilter ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              aria-label={`${hasActiveFilter ? 'Edit' : 'Add'} filter for ${column.header}`}
              title={`${hasActiveFilter ? 'Edit' : 'Add'} filter for ${column.header}`}
            >
              {getFilterIcon()}
            </button>
          </div>
        )}

        {column.hideable && (
          <button 
            onClick={handleToggleVisibility}
            className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors duration-150"
            aria-label={column.hidden ? "Show Column" : "Hide Column"}
            title={column.hidden ? "Show Column" : "Hide Column"}
          >
            {column.hidden ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        )}
      </div>

      {showSearchFilter && column.filterType === 'search' && (
        <div 
          className="absolute z-50 mt-1 right-0 transform origin-top-right"
          style={{
            animation: 'menuAppear 0.2s ease-out forwards'
          }}
        >
          <FilterRenderer
            column={column}
            data={data}
            filterValue={filterValue}
            onFilterValueChange={setFilterValue}
            onFilterApply={handleFilterApply}
            onFilterClear={handleFilterClear}
            onClose={() => setShowSearchFilter(false)}
          />
        </div>
      )}

      {isMenuOpen && column.filterType !== 'search' && (
        <div 
          className={`absolute z-50 mt-1 right-0 transform origin-top-right bg-white rounded-md shadow-lg border border-gray-200 ${column.filterType === 'daterange' ? 'min-w-[320px]' : 'min-w-[160px]'}`}
          style={{
            animation: 'menuAppear 0.2s ease-out forwards'
          }}
        >
          <div className="mb-2 pb-1 border-b border-gray-100 px-3 pt-2">
            <h3 className="font-medium text-sm text-gray-800">{column.header}</h3>
          </div>

          <FilterRenderer
            column={column}
            data={data}
            filterValue={filterValue}
            onFilterValueChange={setFilterValue}
            onFilterApply={handleFilterApply}
            onFilterClear={handleFilterClear}
            onClose={() => setIsMenuOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
