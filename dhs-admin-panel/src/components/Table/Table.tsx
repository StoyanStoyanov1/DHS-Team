'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ITableProps } from './interfaces';
import { TableService } from './TableService';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TablePagination from './TablePagination';
import PageSizeControl from './PageSizeControl';
import TableContextMenu from './TableContextMenu';
import BulkEditBar from './BulkEditBar';
import { Eye, FilterIcon, Hash, RotateCcw, GripVertical, X } from 'lucide-react';
import { useTableFilters } from './hooks/useTableFilters';
import { useTableSort } from './hooks/useTableSort';
import { useTableSelection } from './hooks/useTableSelection';
import { addTableStyles, isSortableColumn } from './utils';

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
}: ITableProps<T>) {
  const tableService = useMemo(() => new TableService<T>(), []);
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(externalItemsPerPage);
  const [columns, setColumns] = useState<typeof initialColumns>(initialColumns);
  const [showColumnFilterSummary, setShowColumnFilterSummary] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [showBulkEditBar, setShowBulkEditBar] = useState(false);

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
      (window as any).__currentColumnForContextMenu = null;
    }
  };

  // Handle cell context menu
  const handleCellContextMenu = (e: React.MouseEvent, item: T, column?: typeof initialColumns[0]) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    
    // Store the current column for the context menu
    if (column) {
      (window as any).__currentColumnForContextMenu = column;
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

    if (autoResizeColumns) {
      // Defer execution to next frame to ensure DOM is updated
      const timer = setTimeout(() => {
        import('./utils').then(({ autoResizeTableColumns }) => {
          autoResizeTableColumns(tableId, minColumnWidth, maxColumnWidth, columnPadding);
        });
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [data, visibleColumns, autoResizeColumns, tableId, minColumnWidth, maxColumnWidth, columnPadding]);

  // Show bulk edit bar when items are selected
  useEffect(() => {
    // Only show bulk edit bar if we have editable columns and selected items
    if (editableColumns.length > 0 && selectedItems.length > 0) {
      setShowBulkEditBar(true);
      hasShownBulkEditBarRef.current = true;
    } else if (hasShownBulkEditBarRef.current) {
      // If we've shown the bar before but now have no selections, hide it
      setShowBulkEditBar(false);
    }
  }, [selectedItems.length, editableColumns.length]);

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
      <div className={`bg-white rounded-lg shadow ${className}`}>
        {/* Move item count and page size control above table */}
        <div className="px-6 py-3 flex flex-wrap items-center justify-between border-b border-gray-200 bg-white relative">
          <div className="flex items-center space-x-4">
            <h2 className="text-sm font-medium text-gray-700">
              {sortedData.length} {sortedData.length === 1 ? 'item' : 'items'}
            </h2>

            {activeColumnFilterCount > 0 && (
              <div className="relative" ref={filterSummaryRef}>
                <button 
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  onClick={() => setShowColumnFilterSummary(!showColumnFilterSummary)}
                >
                  <FilterIcon size={14} className="mr-1.5" />
                  {activeColumnFilterCount} {activeColumnFilterCount === 1 ? 'filter' : 'filters'}
                </button>

                {/* Filter summary popup menu */}
                {showColumnFilterSummary && (
                  <div className="absolute left-0 top-full mt-1 z-50 w-64 bg-white rounded-md shadow-lg border border-gray-200 p-3">
                    <div className="mb-2 pb-1 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-800">Active Filters</h3>
                        <button 
                          className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                          onClick={resetColumnFilters}
                        >
                          <RotateCcw size={12} className="mr-1" />
                          Clear All
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Drag and drop items to reorder</p>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {filterOrder.map((key, index) => {
                        const value = columnFilters[key];
                        if (value === undefined) return null;

                        const displayValue = formatFilterDisplayValue(value, key);

                        return (
                          <div 
                            key={key} 
                            className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded-md cursor-grab active:cursor-grabbing sort-criteria-item"
                            draggable={true}
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', JSON.stringify({ index }));
                              e.currentTarget.classList.add('dragging');
                            }}
                            onDragEnd={(e) => {
                              e.currentTarget.classList.remove('dragging');
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.add('drop-target');
                            }}
                            onDragLeave={(e) => {
                              e.currentTarget.classList.remove('drop-target');
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove('drop-target');
                              try {
                                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                                if (data.index !== undefined && data.index !== index) {
                                  // Move the filter from the source index to the target index
                                  setFilterOrder(prevOrder => {
                                    const newOrder = [...prevOrder];
                                    const [movedItem] = newOrder.splice(data.index, 1);
                                    newOrder.splice(index, 0, movedItem);
                                    return newOrder;
                                  });
                                }
                              } catch (error) {
                                console.error('Error handling filter drop:', error);
                              }
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 mr-1" title="Drag to reorder">
                                <GripVertical size={14} />
                              </span>
                              <span className="font-medium text-gray-700">
                                {/* Show column header instead of key */}
                                {columns.find(col => col.key === key)?.header || key}:
                              </span>
                              <span className="text-gray-600">{displayValue}</span>
                            </div>
                            <button 
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              onClick={() => handleColumnFilterChange(key, null)}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Multi-sort criteria indicator */}
            {multiSort && sortCriteria.length > 0 && (
              <div className="relative" ref={sortCriteriaRef}>
                <button 
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  onClick={() => setShowSortCriteriaSummary(!showSortCriteriaSummary)}
                >
                  <Hash size={14} className="mr-1.5" />
                  {sortCriteria.length} {sortCriteria.length === 1 ? 'sort' : 'sorts'}
                </button>

                {/* Sort criteria popup menu */}
                {showSortCriteriaSummary && (
                  <div className="absolute left-0 top-full mt-1 z-50 w-72 bg-white rounded-md shadow-lg border border-gray-200 p-3">
                    <div className="mb-2 pb-1 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-800">Sort Order</h3>
                        <button 
                          className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                          onClick={handleClearAllSorting}
                        >
                          <RotateCcw size={12} className="mr-1" />
                          Clear All
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Drag and drop items to reorder</p>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {sortCriteria.map((criterion, index) => {
                        const column = columns.find(col => col.key === criterion.key);
                        if (!column) return null;

                        return (
                          <div 
                            key={index} 
                            className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded-md cursor-grab active:cursor-grabbing sort-criteria-item"
                            draggable={true}
                            onDragStart={(e) => {
                              e.dataTransfer.setData('text/plain', JSON.stringify({ index }));
                              e.currentTarget.classList.add('dragging');
                            }}
                            onDragEnd={(e) => {
                              e.currentTarget.classList.remove('dragging');
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.add('drop-target');
                            }}
                            onDragLeave={(e) => {
                              e.currentTarget.classList.remove('drop-target');
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove('drop-target');
                              try {
                                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                                if (data.index !== undefined && data.index !== index) {
                                  // Move the criterion from the source index to the target index
                                  const newCriteria = [...sortCriteria];
                                  const [movedItem] = newCriteria.splice(data.index, 1);
                                  newCriteria.splice(index, 0, movedItem);
                                  
                                  // Update the sort criteria
                                  setSortCriteria(newCriteria);
                                }
                              } catch (error) {
                                console.error('Error handling sort criteria drop:', error);
                              }
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 mr-1" title="Drag to reorder">
                                <GripVertical size={14} />
                              </span>
                              <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 text-xs px-1.5 font-medium text-indigo-700 min-w-[1.5rem] h-6">
                                {index + 1}
                              </span>
                              <span className="font-medium text-gray-700">{column.header}</span>
                              <span className="text-gray-600">
                                {criterion.direction === 'asc' ? '↑ Ascending' : '↓ Descending'}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1">
                              <button 
                                className="p-1 text-gray-500 hover:text-red-500 hover:bg-gray-200 rounded"
                                onClick={() => handleRemoveSortCriterion(index)}
                                title="Remove"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Add page size control to the top toolbar */}
          {showTableSizeControls && (
            <PageSizeControl
              itemsPerPage={itemsPerPage}
              setItemsPerPage={handleItemsPerPageChange}
              options={rowsPerPageOptions.map(size => ({
                size, 
                available: size <= Math.max(...rowsPerPageOptions, sortedData.length)
              }))}
              label="Rows per page:"
            />
          )}
        </div>

        {columns.some(col => col.hidden) && (
          <div className="px-6 py-2 bg-indigo-50/40 border-b border-indigo-100 flex flex-wrap items-center">
            <span className="text-xs font-medium text-gray-700 mr-2">Hidden Columns:</span>
            <div className="flex flex-wrap gap-2">
              {columns.filter(col => col.hidden).map(column => (
                <button 
                  key={column.key}
                  className="text-xs px-2 py-1 bg-white border border-indigo-200 text-indigo-600 rounded-md hover:bg-indigo-50 flex items-center"
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
          className="overflow-x-auto"
          onContextMenu={handleTableRightClick}
        >
          <table id={tableId} className="min-w-full divide-y divide-gray-200">
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

        {/* Keep pagination at the bottom but without item count and page size control */}
        <div className="px-6 py-3 flex items-center justify-end border-t border-gray-200 bg-white">
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
      />

      {/* Bulk Edit Bar */}
      {showBulkEditBar && onBulkEdit && (
        <BulkEditBar
          selectedItems={selectedItems}
          editableColumns={editableColumns}
          onBulkEdit={handleBulkEdit}
          onCancel={() => {
            clearSelection();
            setShowBulkEditBar(false);
          }}
        />
      )}
    </div>
  );
}