'use client';

import React, { useRef } from 'react';
import { ITableProps } from './interfaces';
import { TableProvider, useTableContext } from './context/TableContext';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TablePagination from './TablePagination';
import PageSizeControl from './PageSizeControl';
import TableContextMenu from './TableContextMenu';
import TableSettings from './TableSettings';
import BulkEditBar from './BulkEditBar';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { EditConfirmationPortal } from './TableRow';
import EditRowModal from './EditRowModal';
import { RotateCcw } from 'lucide-react';
import { ActiveFiltersDisplay } from '../Filter';
import SelectionActionsMenu from './SelectionActionsMenu';

// TablePresenter component - handles the presentation logic
function TablePresenter<T>() {
  // Get all the state and functions from the context
  const {
    // Data
    data,
    sortedData,
    paginatedData,
    emptyRows,
    
    // Columns
    columns,
    visibleColumns,
    handleToggleColumnVisibility,
    
    // Filtering
    columnFilters,
    handleColumnFilterChange,
    resetColumnFilters,
    activeColumnFilterCount,
    
    // Sorting
    sortKey,
    sortDirection,
    sortCriteria,
    handleSort,
    handleRemoveSortCriterion,
    handleClearAllSorting,
    showSortCriteriaSummary,
    setShowSortCriteriaSummary,
    setSortCriteria,
    handleSortDrop,
    
    // Pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    
    // Selection
    selectedItems,
    selectedItemIds,
    isAllSelected,
    isPartiallySelected,
    toggleSelectAll,
    toggleSelectItem,
    clearSelection,
    selectCurrentPageItems,
    selectAllItems,
    
    // Context menu
    contextMenuPosition,
    handleTableRightClick,
    handleCellContextMenu,
    handleCloseContextMenu,
    
    // Bulk edit
    showBulkEditBar,
    setShowBulkEditBar,
    handleBulkEdit,
    
    // Delete
    showDeleteConfirmation,
    setShowDeleteConfirmation,
    
    // Edit
    editingItem,
    setEditingItem,
    handleEdit,
    
    // Appearance
    density,
    theme,
    showGridLines,
    stripedRows,
    highlightOnHover,
    stickyHeader,
    effectiveTheme,
    tableClassNames,
    
    // Refresh
    isRefreshing,
    handleRefreshData,
    
    // Export
    handleExportData,
    handlePrint,
    
    // Other
    keyExtractor,
    emptyMessage,
    rowClassName,
    tableId,
    editableColumns,
    onBulkEdit,
    onEdit,
    onDelete,
    itemType,
  } = useTableContext<T>();
  
  // Create a ref for the table element
  const tableRef = useRef<HTMLDivElement>(null);
  
  // Helper function to format filter display values
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
  
  return (
    <div className="space-y-4">
      <div 
        ref={tableRef}
        className={`${effectiveTheme === 'dark' ? 'dark' : ''} bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700`}>
        {/* Top toolbar with selections, actions and filters */}
        <div className="px-6 py-3 flex flex-wrap items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 relative">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {sortedData.length} {sortedData.length === 1 ? 'item' : 'items'}
                {selectedItems.length > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    {selectedItems.length} selected
                  </span>
                )}
              </h2>
              {selectedItems.length > 0 && (
                <div className="flex items-center">
                  <SelectionActionsMenu
                    selectedCount={selectedItems.length}
                    onUpdate={() => setShowBulkEditBar(true)}
                    onDelete={() => setShowDeleteConfirmation(true)}
                    showUpdateOption={editableColumns.length > 0}
                  />
                </div>
              )}
            </div>

            {/* Active filters and sorting display */}
            {(sortCriteria.length > 0) || activeColumnFilterCount > 0 ? (
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
              onClick={handleRefreshData}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
              title="Refresh table"
            >
              <RotateCcw 
                size={16} 
                className={isRefreshing ? 'refresh-rotate' : ''}
              />
            </button>

            <PageSizeControl
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              options={[10, 15, 25, 50, 100].map(size => ({
                size, 
                available: size <= Math.max(100, sortedData.length)
              }))}
              label="Rows:"
            />
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
                  {column.header}
                </button>
              ))}
            </div>
          </div>
        )}

        <div 
          className={`overflow-x-auto bg-white dark:bg-gray-800 ${stickyHeader ? 'sticky-header' : ''}`}
          onContextMenu={handleTableRightClick}
        >
          <table id={tableId} className={tableClassNames}>
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
              multiSort={true}
              handleSortDrop={handleSortDrop}
              showSelectionColumn={selectedItems !== undefined}
              isAllSelected={isAllSelected}
              isPartiallySelected={isPartiallySelected}
              toggleSelectAll={toggleSelectAll}
              selectedCount={selectedItems.length}
              totalCount={sortedData.length}
              currentPageCount={paginatedData.length}
              onSelectCurrentPage={selectCurrentPageItems}
              onSelectAll={selectAllItems}
              onClearSelection={clearSelection}

              // TableSettings props
              onResetAllFilters={resetColumnFilters}
              onClearAllSorting={handleClearAllSorting}
              onRefreshData={handleRefreshData}
              onExportData={handleExportData}
              onPrint={handlePrint}

              // Table appearance settings
              density={density}
              theme={theme}
            />

            <TableBody
              data={paginatedData}
              emptyRows={emptyRows}
              visibleColumns={visibleColumns}
              keyExtractor={keyExtractor}
              rowClassName={rowClassName}
              emptyMessage={emptyMessage}
              showSelectionColumn={selectedItems !== undefined}
              selectedItemIds={selectedItemIds}
              onToggleSelectItem={toggleSelectItem}
              onContextMenu={handleCellContextMenu}
              onBulkEdit={onBulkEdit}
              onEdit={handleEdit}
              onDelete={onDelete}

              // Table settings props
              columns={columns}
              onToggleColumnVisibility={handleToggleColumnVisibility}
              onResetAllFilters={resetColumnFilters}
              onClearAllSorting={handleClearAllSorting}
              onRefreshData={handleRefreshData}
              onExportData={handleExportData}
              onPrint={handlePrint}

              // Table appearance settings
              density={density}
              theme={theme}
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
            onItemsPerPageChange={setItemsPerPage}
            rowsPerPageOptions={[10, 15, 25, 50, 100]}
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
          setShowDeleteConfirmation(true);
          handleCloseContextMenu();
        } : undefined}
        onUpdateSelected={selectedItems.length > 0 && editableColumns.length > 0 ? () => {
          setShowBulkEditBar(true);
          handleCloseContextMenu();
        } : undefined}
        showUpdateOption={editableColumns.length > 0}
        onSelectAll={() => toggleSelectAll()}
        onSelectAllPages={() => selectAllItems()}
        onClearSelection={clearSelection}
        totalItemCount={sortedData.length}
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

      {/* Edit Confirmation Portal - renders dialogs outside the table structure */}
      <EditConfirmationPortal />

      {/* Edit Row Modal */}
      {editingItem && (
        <EditRowModal
          isOpen={!!editingItem}
          item={editingItem}
          columns={columns}
          onSave={(updatedItem) => {
            if (onBulkEdit) {
              // Create an array of promises for each field that changed
              const updatePromises = Object.keys(updatedItem).map(key => {
                // Skip if the value hasn't changed
                if ((editingItem as any)[key] === (updatedItem as any)[key]) {
                  return Promise.resolve();
                }
                // Update the field
                return onBulkEdit([editingItem], key, (updatedItem as any)[key]);
              });

              // Wait for all updates to complete
              Promise.all(updatePromises)
                .then(() => {
                  setEditingItem(null);
                })
                .catch(error => {
                  console.error('Failed to update item:', error);
                });
            }
          }}
          onCancel={() => {
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

// Main Table component - handles the container logic
export default function Table<T>(props: ITableProps<T>) {
  return (
    <TableProvider {...props}>
      <TablePresenter />
    </TableProvider>
  );
}