import React, { useState, useRef, useEffect } from 'react';
import { ITableColumn, SortDirection } from './interfaces';
import { 
  Filter as FilterIcon,
  X,
  ListFilter,
  ArrowUpAZ,
  ArrowDownAZ,
  EyeOff,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Trash2,
  CheckSquare,
  PencilIcon
} from 'lucide-react';
import { SelectedFilters, FilterRenderer } from './Filter';
import { isSortableColumn } from './utils';

interface TableContextMenuProps<T> {
  columns: ITableColumn<T>[];
  data: T[];
  onFilterChange: (columnKey: string, value: any) => void;
  activeFilters: SelectedFilters;
  position: { x: number, y: number } | null;
  onClose: () => void;
  onSortChange?: (columnKey: string) => void;
  currentSortKey?: string;
  currentSortDirection?: SortDirection;
  onToggleVisibility?: (columnKey: string) => void;
  onResetColumnFilter?: (columnKey: string) => void;
  onResetAllFilters?: () => void;
  selectedItemCount?: number;
  onDeleteSelected?: () => void;
  onUpdateSelected?: () => void;
  onSelectAll?: () => void;
  onSelectAllPages?: () => void;
  onClearSelection?: () => void;
  totalItemCount?: number;
  showUpdateOption?: boolean;
}

export default function TableContextMenu<T>({
  columns,
  data,
  onFilterChange,
  activeFilters,
  position,
  onClose,
  onSortChange,
  currentSortKey,
  currentSortDirection,
  onToggleVisibility,
  onResetColumnFilter,
  onResetAllFilters,
  selectedItemCount = 0,
  onDeleteSelected,
  onUpdateSelected,
  onSelectAll,
  onSelectAllPages,
  onClearSelection,
  totalItemCount = 0,
  showUpdateOption = false,
}: TableContextMenuProps<T>) {
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [filterValue, setFilterValue] = useState<any>(null);
  const [activeSubmenu, setActiveSubmenu] = useState<'sort' | 'filter' | null>(null);
  const [headerColumn, setHeaderColumn] = useState<ITableColumn<T> | null>(null);
  const [adjustedPosition, setAdjustedPosition] = useState<{ x: number, y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const filterableColumns = columns.filter(col => col.filterable && !col.hidden);

  useEffect(() => {
    // Reset selected column and filter value when menu is closed
    if (!position) {
      setSelectedColumn(null);
      setFilterValue(null);
      setActiveSubmenu(null);
      setHeaderColumn(null);
      setAdjustedPosition(null);
    } else {
      // Check if we have a column from right-click on header
      const currentColumnForContextMenu = (window as any).__currentColumnForContextMenu;
      if (currentColumnForContextMenu) {
        setHeaderColumn(currentColumnForContextMenu);
        // Clear the global variable
        (window as any).__currentColumnForContextMenu = null;
      } else {
        setHeaderColumn(null);
      }

      // Initialize adjusted position with the original position
      setAdjustedPosition(position);
    }
  }, [position]);

  useEffect(() => {
    // Update filter value when column is selected
    if (selectedColumn) {
      const currentValue = activeFilters[selectedColumn] || null;
      setFilterValue(currentValue);
    }
  }, [selectedColumn, activeFilters]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (position) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [position, onClose]);

  // Check if menu extends beyond viewport boundaries and adjust position
  useEffect(() => {
    if (!adjustedPosition || !menuRef.current) return;

    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newX = adjustedPosition.x;
    let newY = adjustedPosition.y;

    // Check if menu extends beyond right edge of viewport
    if (adjustedPosition.x + menuRect.width > viewportWidth) {
      newX = viewportWidth - menuRect.width - 10; // 10px padding
    }

    // Check if menu extends beyond bottom edge of viewport
    if (adjustedPosition.y + menuRect.height > viewportHeight) {
      newY = viewportHeight - menuRect.height - 10; // 10px padding
    }

    // Ensure menu doesn't go off the left or top edge
    newX = Math.max(10, newX);
    newY = Math.max(10, newY);

    // Only update if position has changed
    if (newX !== adjustedPosition.x || newY !== adjustedPosition.y) {
      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [adjustedPosition, activeSubmenu, selectedColumn]);

  const handleColumnSelect = (columnKey: string) => {
    setSelectedColumn(columnKey);
  };

  const handleFilterApply = (value: any) => {
    if (selectedColumn) {
      onFilterChange(selectedColumn, value);
      onClose();
    }
  };

  const handleFilterClear = () => {
    if (selectedColumn) {
      setFilterValue(null);
      onFilterChange(selectedColumn, null);
    }
    setSelectedColumn(null);
  };

  const handleSortAscending = () => {
    if (headerColumn && onSortChange) {
      if (currentSortKey === headerColumn.key && currentSortDirection === 'asc') {
        // Already sorted ascending, do nothing
      } else {
        onSortChange(headerColumn.key);
        if (currentSortKey !== headerColumn.key || currentSortDirection !== 'asc') {
          // Need to call again to ensure it's ascending
          if (currentSortDirection === null || currentSortDirection === 'desc') {
            onSortChange(headerColumn.key);
          }
        }
      }
      onClose();
    }
  };

  const handleSortDescending = () => {
    if (headerColumn && onSortChange) {
      if (currentSortKey === headerColumn.key && currentSortDirection === 'desc') {
        // Already sorted descending, do nothing
      } else {
        onSortChange(headerColumn.key);
        if (currentSortKey !== headerColumn.key) {
          // Need to call twice to get to descending
          onSortChange(headerColumn.key);
        } else if (currentSortDirection === null) {
          // Need to call twice to get to descending
          onSortChange(headerColumn.key);
          onSortChange(headerColumn.key);
        } else if (currentSortDirection === 'asc') {
          // Need to call once more to get to descending
          onSortChange(headerColumn.key);
        }
      }
      onClose();
    }
  };

  const handleHideColumn = () => {
    if (headerColumn && onToggleVisibility) {
      onToggleVisibility(headerColumn.key);
      onClose();
    }
  };

  const handleResetColumn = () => {
    if (headerColumn && onResetColumnFilter) {
      onResetColumnFilter(headerColumn.key);
      onClose();
    }
  };

  const handleResetAllFilters = () => {
    if (onResetAllFilters) {
      onResetAllFilters();
      onClose();
    }
  };

  const handleOpenSortSubmenu = () => {
    setActiveSubmenu('sort');
  };

  const handleOpenFilterSubmenu = () => {
    if (headerColumn) {
      setActiveSubmenu('filter');
      setSelectedColumn(headerColumn.key);
      setFilterValue(activeFilters[headerColumn.key] || null);
    }
  };

  const handleBackFromSubmenu = () => {
    setActiveSubmenu(null);
  };

  const getColumnIcon = (column: ITableColumn<T>) => {
    // Show if column has active filter
    const hasFilter = activeFilters[column.key] !== undefined;

    switch (column.filterType) {
      case 'search':
        return hasFilter ? <FilterIcon size={14} className="text-indigo-600" /> : <FilterIcon size={14} />;
      case 'select':
      case 'multiselect':
        return hasFilter ? <ListFilter size={14} className="text-indigo-600" /> : <ListFilter size={14} />;
      default:
        return hasFilter ? <FilterIcon size={14} className="text-indigo-600" /> : <FilterIcon size={14} />;
    }
  };

  if (!position) return null;

  return (
    <div 
      ref={menuRef}
      className="fixed bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 min-w-[200px] max-w-md"
      style={{
        top: `${adjustedPosition?.y || position.y}px`,
        left: `${adjustedPosition?.x || position.x}px`,
        animation: 'menuAppear 0.15s ease-out forwards'
      }}
    >
      {/* Column Header Context Menu */}
      {headerColumn && !activeSubmenu && (
        <>
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-sm text-gray-800 dark:text-white">{headerColumn.header}</h3>
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          </div>
          <div className="py-1">
            {/* Sort Option */}
            {isSortableColumn(headerColumn) && (
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
                onClick={handleOpenSortSubmenu}
              >
                <div className="flex items-center">
                  <ArrowUpAZ size={16} className="mr-2 text-gray-500 dark:text-gray-300" />
                  <span className="dark:text-white">Sort</span>
                </div>
                <ChevronRight size={16} className="text-gray-500 dark:text-gray-300" />
              </button>
            )}

            {/* Filter Option */}
            {headerColumn.filterable && (
              <button
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between ${
                  activeFilters[headerColumn.key] ? 'text-indigo-600 dark:text-indigo-300 font-medium' : 'text-gray-800 dark:text-white'
                }`}
                onClick={handleOpenFilterSubmenu}
              >
                <div className="flex items-center">
                  <FilterIcon size={16} className={`mr-2 ${activeFilters[headerColumn.key] ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-500 dark:text-gray-300'}`} />
                  <span>Filter</span>
                </div>
                <ChevronRight size={16} className="text-gray-500 dark:text-gray-300" />
              </button>
            )}

            {/* GroupBy Option - Placeholder for future implementation */}
            <button
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center text-gray-400 dark:text-gray-500"
              disabled
            >
              <ListFilter size={16} className="mr-2" />
              <span>GroupBy</span>
            </button>

            {/* Hide Column Option */}
            {onToggleVisibility && (
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                onClick={handleHideColumn}
              >
                <EyeOff size={16} className="mr-2 text-gray-500 dark:text-gray-300" />
                <span className="dark:text-white">Hide Column</span>
              </button>
            )}

            {/* Reset Column Option */}
            {onResetColumnFilter && activeFilters[headerColumn.key] && (
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                onClick={handleResetColumn}
              >
                <RotateCcw size={16} className="mr-2 text-gray-500 dark:text-gray-300" />
                <span className="dark:text-white">Reset Column</span>
              </button>
            )}

            {/* Reset All Filters Option */}
            {onResetAllFilters && Object.keys(activeFilters).length > 0 && (
              <button
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                onClick={handleResetAllFilters}
              >
                <RotateCcw size={16} className="mr-2 text-gray-500 dark:text-gray-300" />
                <span className="dark:text-white">Reset All Filters</span>
              </button>
            )}
          </div>
        </>
      )}

      {/* Sort Submenu */}
      {headerColumn && activeSubmenu === 'sort' && (
        <>
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <button 
                className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                onClick={handleBackFromSubmenu}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <h3 className="font-medium text-sm text-gray-800 dark:text-white">Sort</h3>
            </div>
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          </div>
          <div className="py-1">
            <button
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${
                currentSortKey === headerColumn.key && currentSortDirection === 'asc' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-800 dark:text-white'
              }`}
              onClick={handleSortAscending}
            >
              <ArrowUp size={16} className={`mr-2 ${
                currentSortKey === headerColumn.key && currentSortDirection === 'asc' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-300'
              }`} />
              <span>Ascending</span>
            </button>
            <button
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${
                currentSortKey === headerColumn.key && currentSortDirection === 'desc' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-800 dark:text-white'
              }`}
              onClick={handleSortDescending}
            >
              <ArrowDown size={16} className={`mr-2 ${
                currentSortKey === headerColumn.key && currentSortDirection === 'desc' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-300'
              }`} />
              <span>Descending</span>
            </button>
          </div>
        </>
      )}

      {/* Filter Submenu */}
      {headerColumn && activeSubmenu === 'filter' && selectedColumn && (
        <>
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <button 
                className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                onClick={handleBackFromSubmenu}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <h3 className="font-medium text-sm text-gray-800 dark:text-white">Filter</h3>
            </div>
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          </div>

          <FilterRenderer
            column={columns.find(col => col.key === selectedColumn)!}
            data={data}
            filterValue={filterValue}
            onFilterValueChange={setFilterValue}
            onFilterApply={handleFilterApply}
            onFilterClear={handleFilterClear}
            onClose={onClose}
          />
        </>
      )}

      {/* Regular Table Context Menu (when right-clicking on the table, not a header) */}
      {!headerColumn && !selectedColumn && (
        <>
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium text-sm text-gray-800 dark:text-white">Options</h3>
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          </div>

          {/* Selection specific actions */}
          {selectedItemCount > 0 && (
            <div className="py-1 border-b border-gray-100 dark:border-gray-700">
              {showUpdateOption && onUpdateSelected && (
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center"
                  onClick={() => {
                    onUpdateSelected();
                    onClose();
                  }}
                >
                  <PencilIcon size={16} className="mr-2 text-indigo-500 dark:text-indigo-400" />
                  <span className="dark:text-white">Update Selected ({selectedItemCount})</span>
                </button>
              )}
              {onDeleteSelected && (
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 flex items-center"
                  onClick={() => {
                    onDeleteSelected();
                    onClose();
                  }}
                >
                  <Trash2 size={16} className="mr-2 text-red-500 dark:text-red-400" />
                  <span className="dark:text-white">Delete Selected ({selectedItemCount})</span>
                </button>
              )}
            </div>
          )}

          {/* Selection options - always shown */}
          {(onSelectAll || onSelectAllPages) && (
            <div className="py-1 border-b border-gray-100 dark:border-gray-700">
              {onSelectAll && (
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                  onClick={() => {
                    onSelectAll();
                    onClose();
                  }}
                >
                  <CheckSquare size={16} className="mr-2 text-gray-500 dark:text-gray-300" />
                  <span className="dark:text-white">Select all on this page</span>
                </button>
              )}

              {onSelectAllPages && (
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                  onClick={() => {
                    onSelectAllPages();
                    onClose();
                  }}
                >
                  <CheckSquare size={16} className="mr-2 text-indigo-600 dark:text-indigo-400" />
                  <span className="dark:text-white">Select all items ({totalItemCount})</span>
                </button>
              )}

              {selectedItemCount > 0 && onClearSelection && (
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center text-red-600 dark:text-red-400"
                  onClick={() => {
                    onClearSelection();
                    onClose();
                  }}
                >
                  <X size={16} className="mr-2" />
                  <span>Clear selection</span>
                </button>
              )}
            </div>
          )}

          <div className="py-1">
            <div className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              Filter by column
            </div>

            <div className="max-h-[400px] overflow-y-auto py-1">
              {filterableColumns.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                  No filterable columns available.
                </div>
              )}

              {filterableColumns.map((column) => (
                <button
                  key={column.key}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between ${
                    activeFilters[column.key] !== undefined ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-800 dark:text-white'
                  }`}
                  onClick={() => handleColumnSelect(column.key)}
                >
                  <span>{column.header}</span>
                  {getColumnIcon(column)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Regular Filter Menu (when a column is selected from the table context menu) */}
      {!headerColumn && selectedColumn && (
        <>
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <button 
                className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                onClick={() => setSelectedColumn(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <h3 className="font-medium text-sm text-gray-800 dark:text-white">
                {columns.find(col => col.key === selectedColumn)?.header}
              </h3>
            </div>
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              onClick={onClose}
            >
              <X size={16} />
            </button>
          </div>

          {selectedColumn && (
            <FilterRenderer
              column={columns.find(col => col.key === selectedColumn)!}
              data={data}
              filterValue={filterValue}
              onFilterValueChange={setFilterValue}
              onFilterApply={handleFilterApply}
              onFilterClear={handleFilterClear}
              onClose={onClose}
            />
          )}
        </>
      )}
    </div>
  );
}
