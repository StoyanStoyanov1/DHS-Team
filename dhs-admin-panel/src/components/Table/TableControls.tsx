import React from 'react';
import { FilterIcon, RotateCcw, Hash } from 'lucide-react';
import TablePagination from './TablePagination';
import PageSizeControl from './PageSizeControl';
import { SortCriterion } from './interfaces';

interface TableControlsProps<T> {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (size: number) => void;
  totalItems: number;
  totalPages: number;
  rowsPerPageOptions: number[];
  showTableSizeControls: boolean;
  showColumnFilterSummary: boolean;
  setShowColumnFilterSummary: (show: boolean) => void;
  activeColumnFilterCount: number;
  resetColumnFilters: () => void;
  multiSort: boolean;
  sortCriteria: SortCriterion[];
  showSortCriteriaSummary: boolean;
  setShowSortCriteriaSummary: (show: boolean) => void;
  handleClearAllSorting: () => void;
  handleRemoveSortCriterion: (index: number) => void;
  setFilterOrder: (order: string[] | ((prevOrder: string[]) => string[])) => void;
  filterOrder: string[];
  columnFilters: Record<string, any>;
}

function TableControls<T>({
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalItems,
  totalPages,
  rowsPerPageOptions,
  showTableSizeControls,
  showColumnFilterSummary,
  setShowColumnFilterSummary,
  activeColumnFilterCount,
  resetColumnFilters,
  multiSort,
  sortCriteria,
  showSortCriteriaSummary,
  setShowSortCriteriaSummary,
  handleClearAllSorting,
  handleRemoveSortCriterion,
  setFilterOrder,
  filterOrder,
  columnFilters,
}: TableControlsProps<T>) {
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Format filter display value for the summary display
  const formatFilterDisplayValue = (value: any): string => {
    if (value === null || value === undefined) return 'Not set';
    
    if (typeof value === 'boolean') {
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
    <>
      <div className="px-6 py-3 flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <h2 className="text-sm font-medium text-gray-700">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </h2>

          {activeColumnFilterCount > 0 && (
            <div className="relative">
              <button 
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                onClick={() => setShowColumnFilterSummary(!showColumnFilterSummary)}
              >
                <FilterIcon size={14} className="mr-1.5" />
                {activeColumnFilterCount} {activeColumnFilterCount === 1 ? 'filter' : 'filters'}
              </button>

              {showColumnFilterSummary && (
                <div className="absolute left-0 top-full mt-1 z-10 w-64 bg-white rounded-md shadow-lg border border-gray-200 p-3">
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

                      const displayValue = formatFilterDisplayValue(value);

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
                                setFilterOrder((prevOrder: string[]) => {
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
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="4" y1="9" x2="20" y2="9" />
                                <line x1="4" y1="15" x2="20" y2="15" />
                              </svg>
                            </span>
                            <span className="font-medium text-gray-700">{key}:</span>
                            <span className="text-gray-600">{displayValue}</span>
                          </div>
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
            <div className="relative">
              <button 
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                onClick={() => setShowSortCriteriaSummary(!showSortCriteriaSummary)}
              >
                <Hash size={14} className="mr-1.5" />
                {sortCriteria.length} {sortCriteria.length === 1 ? 'sort' : 'sorts'}
              </button>

              {showSortCriteriaSummary && (
                <div className="absolute left-0 top-full mt-1 z-10 w-72 bg-white rounded-md shadow-lg border border-gray-200 p-3">
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
                    {sortCriteria.map((criterion, index) => (
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
                              // Logic for reordering sort criteria would be implemented here
                              // This should connect to a function passed from the parent
                            }
                          } catch (error) {
                            console.error('Error handling sort criteria drop:', error);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 mr-1" title="Drag to reorder">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="4" y1="9" x2="20" y2="9" />
                              <line x1="4" y1="15" x2="20" y2="15" />
                            </svg>
                          </span>
                          <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 text-xs px-1.5 font-medium text-indigo-700 min-w-[1.5rem] h-6">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-700">{criterion.key}</span>
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
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {showTableSizeControls && (
          <PageSizeControl
            itemsPerPage={itemsPerPage}
            setItemsPerPage={handleItemsPerPageChange}
            options={rowsPerPageOptions.map(size => ({
              size, 
              available: size <= Math.max(...rowsPerPageOptions, totalItems)
            }))}
            label="Rows per page:"
          />
        )}
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        rowsPerPageOptions={rowsPerPageOptions}
        showPageSizeControl={false} // We're showing it above
      />
    </>
  );
}

export default TableControls;