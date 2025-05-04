'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ITableProps } from './interfaces';
import { TableService } from './TableService';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableControls from './TableControls';
import TableContextMenu from './TableContextMenu';
import BulkEditBar from './BulkEditBar';
import { Eye } from 'lucide-react';
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

  return (
    <div className="space-y-4">
      <div className={`bg-white rounded-lg shadow ${className}`}>
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

        <TableControls
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalItems={sortedData.length}
          totalPages={totalPages}
          rowsPerPageOptions={rowsPerPageOptions}
          showTableSizeControls={showTableSizeControls}
          showColumnFilterSummary={showColumnFilterSummary}
          setShowColumnFilterSummary={setShowColumnFilterSummary}
          activeColumnFilterCount={activeColumnFilterCount}
          resetColumnFilters={resetColumnFilters}
          multiSort={multiSort}
          sortCriteria={sortCriteria}
          showSortCriteriaSummary={showSortCriteriaSummary}
          setShowSortCriteriaSummary={setShowSortCriteriaSummary}
          handleClearAllSorting={handleClearAllSorting}
          handleRemoveSortCriterion={handleRemoveSortCriterion}
          setFilterOrder={setFilterOrder}
          filterOrder={filterOrder}
          columnFilters={columnFilters}
        />
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