'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ITableProps } from './interfaces';

// Define interface for window object extension
interface WindowWithTableContext extends Window {
  __currentColumnForContextMenu: any;
}

// Add CSS for refresh button animation
const refreshButtonAnimationStyle = `
@keyframes rotate360 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}
.refresh-rotate {
  animation: rotate360 0.5s ease-in-out forwards;
}
`;
import { TableService } from './TableService';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TablePagination from './TablePagination';
import PageSizeControl from './PageSizeControl';
import TableContextMenu from './TableContextMenu';
import BulkEditBar from './BulkEditBar';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { Eye, PencilIcon, Trash2, RotateCcw } from 'lucide-react';
import { useTableFilters } from './hooks/useTableFilters';
import { useTableSort } from './hooks/useTableSort';
import { useTableSelection } from './hooks/useTableSelection';
import { addTableStyles, isSortableColumn } from './utils';
import { ActiveFiltersDisplay, ActiveFilterItem } from '../Filter';

export default function Table<T>({
  columns: initialColumns,
  data,
  keyExtractor,
  emptyMessage = "No data available",
  className = "",
  rowClassName = "",
  itemsPerPage: externalItemsPerPage = 10,
  setItemsPerPage: externalSetItemsPerPage,
  currentPage: externalCurrentPage = 1,
  setCurrentPage: externalSetCurrentPage,
  rowsPerPageOptions = [10, 15, 25], 
  showTableSizeControls = true,
  defaultSortKey,
  defaultSortDirection,
  defaultSortCriteria = [],
  multiSort = false,
  autoResizeColumns = false,
  minColumnWidth,
  maxColumnWidth,
  columnPadding,
  tableId = `table-${Math.random().toString(36).substr(2, 9)}`,
  selectedItems: externalSelectedItems,
  onSelectionChange: externalOnSelectionChange,
  showSelectionColumn = false,
  editableColumns = [],
  onBulkEdit,
  itemType = 'items',
}: ITableProps<T>) {
  const tableService = useMemo(() => new TableService<T>(), []);
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(externalItemsPerPage);
  const [columns, setColumns] = useState<typeof initialColumns>(initialColumns);
  const [showColumnFilterSummary, setShowColumnFilterSummary] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [showBulkEditBar, setShowBulkEditBar] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentPage = externalCurrentPage ?? internalCurrentPage;
  const setCurrentPage = externalSetCurrentPage ?? setInternalCurrentPage;
  const itemsPerPage = externalItemsPerPage ?? internalItemsPerPage;
  const setItemsPerPage = externalSetItemsPerPage ?? setInternalItemsPerPage;

  // Create a ref to track if we've shown the bulk edit bar before
  const hasShownBulkEditBarRef = useRef(false);

  // Add missing references
  const filterSummaryRef = useRef<HTMLDivElement>(null);
  const sortCriteriaRef = useRef<HTMLDivElement>(null);

  // Add missing handleItemsPerPageChange function
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Add formatFilterDisplayValue function
  const formatFilterDisplayValue = (value: any, columnKey: string): string => {
    if (value === null || value === undefined) return 'Not set';

    // Get the column object to access labels
    const column = columns.find(col => col.key === columnKey);

    if (typeof value === 'boolean') {
      // Use column specific labels if available
      if (column) {
        if (value) {
          return column.labelTrue || 'Active';
        } else {
          return column.labelFalse || 'Inactive';
        }
      }
      return value ? 'Yes' : 'No';
    } 

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return `${value.length} selected`;
      }

      if (value.term !== undefined) {
        const methodDisplay: Record<string, string> = {
          'contains': 'contains',
          'equals': 'equals',
          'startsWith': 'starts with',
          'endsWith': 'ends with',
          'notContains': 'doesn\'t contain',
          'isEmpty': 'is empty',
          'isNotEmpty': 'is not empty',
          'regex': 'matches regex'
        };

        return value.method ? `${methodDisplay[value.method] || value.method} "${value.term}"` : `contains "${value.term}"`;
      }

      if (value.start || value.end) {
        const start = value.start ? new Date(value.start).toLocaleDateString() : 'any';
        const end = value.end ? new Date(value.end).toLocaleDateString() : 'any';
        return `${start} to ${end}`;
      }

      if (value.min !== undefined || value.max !== undefined) {
        const min = value.min !== undefined ? value.min : 'any';
        const max = value.max !== undefined ? value.max : 'any';
        return `${min} to ${max}`;
      }

      return JSON.stringify(value);
    }

    return String(value);
  };

  // Get visible columns
  const visibleColumns = useMemo(() => {
    return columns.filter(column => !column.hidden);
  }, [columns]);

  // Use our custom hooks for table functionality
  const {
    columnFilters,
    filterOrder,
    filteredData,
    handleColumnFilterChange,
    resetColumnFilters,
    activeColumnFilterCount,
    setFilterOrder,
  } = useTableFilters({ data, columns });

  const {
    sortedData,
    sortKey,
    sortDirection,
    sortCriteria,
    handleSort,
    handleRemoveSortCriterion,
    handleClearAllSorting,
    showSortCriteriaSummary,
    setShowSortCriteriaSummary,
    setSortCriteria,
  } = useTableSort({
    data: filteredData,
    columns,
    defaultSortKey,
    defaultSortDirection,
    defaultSortCriteria,
    multiSort,
  });

  const {
    selectedItems,
    selectedItemIds,
    isAllSelected,
    isPartiallySelected,
    toggleSelectAll,
    toggleSelectItem,
    isItemSelected,
    clearSelection
  } = useTableSelection({
    data: sortedData,
    keyExtractor,
    onSelectionChange: externalOnSelectionChange,
    initialSelectedItems: externalSelectedItems,
    currentPage,
    itemsPerPage,
  });

  // Calculate pagination
  const totalPages = useMemo(() => 
    Math.max(1, tableService.calculateTotalPages(sortedData.length, itemsPerPage)),
    [tableService, sortedData.length, itemsPerPage]
  );

  const paginatedData = useMemo(() => 
    tableService.getPaginatedData(sortedData, currentPage, itemsPerPage),
    [tableService, sortedData, currentPage, itemsPerPage]
  );

  const emptyRows = useMemo(() => 
    Math.max(0, itemsPerPage - paginatedData.length),
    [itemsPerPage, paginatedData.length]
  );

  // Handle toggling column visibility
  const handleToggleColumnVisibility = (columnKey: string) => {
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.key === columnKey ? { ...col, hidden: !col.hidden } : col
      )
    );

    const column = columns.find(col => col.key === columnKey);
    if (column && !column.hidden && columnFilters[columnKey] !== undefined) {
      handleColumnFilterChange(columnKey, null);
    }
  };

  // Handle sort drop for drag and drop sorting
  const handleSortDrop = (e: React.DragEvent<HTMLTableCellElement>, targetColumnKey: string) => {
    e.preventDefault();

    try {
      // Check if this is a multi-sort criterion
      const data = e.dataTransfer.getData('text/plain');
      if (data.startsWith('{')) {
        // This is a multi-sort criterion being reordered
        const { key, index } = JSON.parse(data);

        if (key && index !== undefined) {
          // Logic for reordering would call appropriate method from useTableSort
        }
      } else {
        // This is a single column being dragged to create a sort
        const sourceColumnKey = data;
        const sourceColumn = columns.find(col => col.key === sourceColumnKey);
        const targetColumn = columns.find(col => col.key === targetColumnKey);

        if (sourceColumn && targetColumn && isSortableColumn(sourceColumn) && isSortableColumn(targetColumn)) {
          handleSort(sourceColumnKey);
        }
      }
    } catch (error) {
      console.error('Error handling sort drop:', error);
    }
  };

  // Handle right click on table to show context menu
  const handleTableRightClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // Check if the click target is a table cell or header
    const target = e.target as HTMLElement;
    const isTableCell = target.tagName === 'TD' || 
                        target.closest('td') !== null || 
                        target.tagName === 'TH' || 
                        target.closest('th') !== null;

    // Only show the generic context menu if we're not clicking on a cell or header
    if (!isTableCell && columns.some(col => col.filterable)) {
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      // Clear any previously set column
      ((window as unknown) as WindowWithTableContext).__currentColumnForContextMenu = null;
    }
  };

  // Handle cell context menu
  const handleCellContextMenu = (e: React.MouseEvent, item: T, column?: typeof initialColumns[0]) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });

    // Store the current column for the context menu
    if (column) {
      ((window as unknown) as WindowWithTableContext).__currentColumnForContextMenu = column;
    }
  };

  // Close context menu
  const handleCloseContextMenu = () => {
    setContextMenuPosition(null);
  };

  // Handle bulk edit
  const handleBulkEdit = async (selectedItems: T[], columnKey: string, newValue: any) => {
    if (onBulkEdit) {
      await onBulkEdit(selectedItems, columnKey, newValue);
    }
  };

  // Add CSS for animation and auto-resize columns
  useEffect(() => {
    addTableStyles();

    // Add refresh button animation style
    const styleElement = document.createElement('style');
    styleElement.textContent = refreshButtonAnimationStyle;
    document.head.appendChild(styleElement);

    if (autoResizeColumns) {
      // Defer execution to next frame to ensure DOM is updated
      const timer = setTimeout(() => {
        import('./utils').then(({ autoResizeTableColumns }) => {
          autoResizeTableColumns(tableId, minColumnWidth, maxColumnWidth, columnPadding);
        });
      }, 0);

      return () => {
        clearTimeout(timer);
        document.head.removeChild(styleElement);
      };
    }

    return () => {
      document.head.removeChild(styleElement);
    };
  }, [data, visibleColumns, autoResizeColumns, tableId, minColumnWidth, maxColumnWidth, columnPadding]);

  // BulkEditBar is now shown only when the Update button is clicked

  // Handle outside clicks to close drop-down menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close filter summary when clicking outside
      if (filterSummaryRef.current && 
          !filterSummaryRef.current.contains(event.target as Node) &&
          showColumnFilterSummary) {
        setShowColumnFilterSummary(false);
      }

      // Close sort criteria summary when clicking outside
      if (sortCriteriaRef.current && 
          !sortCriteriaRef.current.contains(event.target as Node) &&
          showSortCriteriaSummary) {
        setShowSortCriteriaSummary(false);
      }
    }

    // Add event listener when dropdown is open
    if (showColumnFilterSummary || showSortCriteriaSummary) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColumnFilterSummary, showSortCriteriaSummary]);

  return (
    <div className="space-y-4">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
        {/* Top toolbar with selections, actions and filters */}
        <div className="px-6 py-3 flex flex-wrap items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 relative">
          <div className="flex items-center space-x-4">
            <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {sortedData.length} {sortedData.length === 1 ? 'item' : 'items'}
              {selectedItems.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {selectedItems.length} selected
                </span>
              )}
</h2>

            {/* Action buttons */}
            {selectedItems.length > 0 && (
              <div className="flex items-center space-x-2">
                {/* Update button for bulk edits - only show when items are selected */}
                {editableColumns.length > 0 && (
                  <button
                    onClick={() => setShowBulkEditBar(true)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white text-sm rounded-md shadow dark:shadow-indigo-900/30 transition-all duration-200 flex items-center"
                  >
                    <PencilIcon size={14} className="mr-1.5" />
                    Update
                  </button>
                )}

                {/* Delete button */}
                {onBulkEdit && (
                  <button
                    onClick={() => setShowDeleteConfirmation(true)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-sm rounded-md shadow dark:shadow-red-900/30 transition-all duration-200 flex items-center"
                  >
                    <Trash2 size={14} className="mr-1.5" />
                    Delete
                  </button>
                )}
              </div>
            )}

            {/* Active filters and sorting display */}
            {(multiSort && sortCriteria.length > 0) || activeColumnFilterCount > 0 ? (
              <ActiveFiltersDisplay
                sortCriteria={sortCriteria}
                activeFilters={Object.keys(columnFilters)
                  .filter(key => columnFilters[key] !== undefined && columnFilters[key] !== null)
                  .map(key => ({
                    id: key,
                    column: key,
                    displayValue: formatFilterDisplayValue(columnFilters[key], key),
                    value: columnFilters[key]
                  }))}
                columns={columns}
                onRemoveSortCriterion={handleRemoveSortCriterion}
                onMoveSortCriterion={(sourceIndex, destinationIndex) => {
                  const newCriteria = [...sortCriteria];
                  const [removed] = newCriteria.splice(sourceIndex, 1);
                  newCriteria.splice(destinationIndex, 0, removed);
                  setSortCriteria(newCriteria);
                }}
                onRemoveFilter={(filterId) => {
                  handleColumnFilterChange(filterId, null);
                }}
                onClearAllFilters={resetColumnFilters}
                onClearAllSorting={handleClearAllSorting}
                className="ml-2"
              />
            ) : null}
          </div>

          {/* Add page size control to the top toolbar */}
          <div className="flex items-center space-x-2">
            {/* Refresh icon button - elegant circle design with animation */}
            <button
              onClick={() => {
                // Set refreshing state to trigger animation
                setIsRefreshing(true);

                // Execute refresh actions
                resetColumnFilters();
                handleClearAllSorting();
                setCurrentPage(1);
                clearSelection(); // Clear all selected items

                // Reset the refreshing state after animation completes
                setTimeout(() => {
                  setIsRefreshing(false);
                }, 500); // Match animation duration
              }}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
              title="Refresh table"
            >
              <RotateCcw 
                size={16} 
                className={isRefreshing ? 'refresh-rotate' : ''}
              />
            </button>

            {showTableSizeControls && (
              <PageSizeControl
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleItemsPerPageChange}
                options={rowsPerPageOptions.map(size => ({
                  size, 
                  available: size <= Math.max(...rowsPerPageOptions, sortedData.length)
                }))}
                label="Rows:"
              />
            )}
          </div>
        </div>

        {columns.some(col => col.hidden) && (
          <div className="px-6 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex flex-wrap items-center">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mr-2">Hidden Columns:</span>
            <div className="flex flex-wrap gap-2">
              {columns.filter(col => col.hidden).map(column => (
                <button 
                  key={column.key}
                  className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
                  onClick={() => handleToggleColumnVisibility(column.key)}
                >
                  <Eye size={12} className="mr-1" />
                  {column.header}
                </button>
              ))}
            </div>
          </div>
        )}

        <div 
          className="overflow-x-auto bg-white dark:bg-gray-800"
          onContextMenu={handleTableRightClick}
        >
          <table id={tableId} className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <TableHeader 
              columns={columns}
              visibleColumns={visibleColumns}
              sortKey={sortKey}
              sortDirection={sortDirection}
              sortCriteria={sortCriteria}
              handleSort={handleSort}
              handleColumnFilterChange={handleColumnFilterChange}
              handleToggleColumnVisibility={handleToggleColumnVisibility}
              activeFilters={columnFilters}
              multiSort={multiSort}
              handleSortDrop={handleSortDrop}
              showSelectionColumn={showSelectionColumn}
              isAllSelected={isAllSelected}
              isPartiallySelected={isPartiallySelected}
              toggleSelectAll={toggleSelectAll}
            />

            <TableBody
              data={paginatedData}
              emptyRows={emptyRows}
              visibleColumns={visibleColumns}
              keyExtractor={keyExtractor}
              rowClassName={rowClassName}
              emptyMessage={emptyMessage}
              showSelectionColumn={showSelectionColumn}
              selectedItemIds={selectedItemIds}
              onToggleSelectItem={toggleSelectItem}
              onContextMenu={handleCellContextMenu}
            />
          </table>
        </div>

        {/* Pagination at the bottom with styling */}
        <div className="px-6 py-3 flex items-center justify-end border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={sortedData.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            rowsPerPageOptions={rowsPerPageOptions}
            showPageSizeControl={false} // Don't show page size control here since we moved it to the top
          />
        </div>
      </div>

      {/* Add the table context menu */}
      <TableContextMenu
        columns={columns}
        data={data}
        onFilterChange={handleColumnFilterChange}
        activeFilters={columnFilters}
        position={contextMenuPosition}
        onClose={handleCloseContextMenu}
        onSortChange={handleSort}
        currentSortKey={sortKey}
        currentSortDirection={sortDirection}
        onToggleVisibility={handleToggleColumnVisibility}
        onResetColumnFilter={(columnKey) => handleColumnFilterChange(columnKey, null)}
        onResetAllFilters={resetColumnFilters}
        selectedItemCount={selectedItems.length}
        onDeleteSelected={selectedItems.length > 0 ? () => {
          clearSelection();
          setShowBulkEditBar(false);
        } : undefined}
        onSelectAll={() => toggleSelectAll()}
      />

      {/* Bulk Edit Bar */}
      {showBulkEditBar && onBulkEdit && (
        <BulkEditBar
          selectedItems={selectedItems}
          editableColumns={editableColumns}
          onBulkEdit={handleBulkEdit}
          onCancel={() => {
            // Only hide the bulk edit bar without clearing selection
            setShowBulkEditBar(false);
          }}
          pageTitle={data.length > 0 && typeof data[0] === 'object' && data[0] !== null ? Object.keys(data[0] as object)[0]?.charAt(0).toUpperCase() + Object.keys(data[0] as object)[0]?.slice(1) : 'Items'}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <DeleteConfirmationDialog
          isOpen={showDeleteConfirmation}
          itemCount={selectedItems.length}
          itemType={itemType}
          onConfirm={() => {
            // Handle the deletion of selected items
            if (onBulkEdit && selectedItems.length > 0) {
              // Pass a special action to indicate deletion
              onBulkEdit(selectedItems, '_delete', true)
                .then(() => {
                  clearSelection();
                  setShowDeleteConfirmation(false);
                })
                .catch((error) => {
                  console.error('Failed to delete items:', error);
                });
            }
          }}
          onCancel={() => {
            setShowDeleteConfirmation(false);
          }}
        />
      )}
    </div>
  );
}
