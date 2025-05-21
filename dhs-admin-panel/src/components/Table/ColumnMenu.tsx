import React, { useState, useRef, useEffect } from 'react';
import { ITableColumn } from './interfaces';
import { 
  Eye, EyeOff, Filter as FilterIcon , X, Search as SearchIcon, 
  ListFilter, Calendar, Badge
} from 'lucide-react';
import { SelectedFilters } from '../Filter/interfaces';
import FilterRenderer from '../Filter/FilterRenderer';
import { DirectCalendarFilter } from '../Filter/DateRangeFilter';

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

  return (
    <div className="relative" ref={menuRef}>
      <div className={`flex items-center column-menu-actions ${hasActiveFilter ? 'active' : ''}`}>
        {column.filterable && (
          <div className="flex items-center">
            {hasActiveFilter && (
              <button 
                onClick={handleFilterClear}
                className="p-1 rounded-md mr-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none transition-colors duration-150"
                aria-label={`Clear filter for ${column.header}`}
                title={`Clear filter for ${column.header}`}
              >
                <X size={14} />
              </button>
            )}
            <button 
              onClick={toggleMenu}
              className={`p-1 rounded-md mr-1 focus:outline-none transition-colors duration-150 ${
                hasActiveFilter 
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' 
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
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
            className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-150"
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
        <>
          {column.filterType === 'daterange' ? (
            <div 
              className="absolute z-50 mt-1 right-0 transform origin-top-right"
              style={{
                animation: 'menuAppear 0.2s ease-out forwards'
              }}
            >
              <DirectCalendarFilter
                value={filterValue}
                onChange={(value) => {
                  setFilterValue(value);
                  handleFilterApply(value);
                }}
                placeholder=""
                columnName={column.header}
                onClearFilter={handleFilterClear}
              />
            </div>
          ) : (
            <div 
              className={`absolute z-50 mt-1 right-0 transform origin-top-right bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 min-w-[160px]`}
              style={{
                animation: 'menuAppear 0.2s ease-out forwards'
              }}
            >
              <div className="mb-2 pb-1 border-b border-gray-100 dark:border-gray-700 px-3 pt-2">
                <h3 className="font-medium text-sm text-gray-800 dark:text-gray-200">{column.header}</h3>
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
        </>
      )}
    </div>
  );
}
