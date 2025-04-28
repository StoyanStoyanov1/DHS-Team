'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ITableProps, ITableColumn, SortDirection } from './interfaces';
import { TableService } from './TableService';
import TablePagination from './TablePagination';
import TableSizeControls from './TableSizeControls';
import ColumnMenu from './ColumnMenu';
import { Filter } from '../Filter';
import { SelectedFilters } from '../Filter/interfaces';
import { Filter as FilterIcon, RotateCcw, X, Eye, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';

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
  // Filter related props
  filterGroups = [],
  initialFilterValues = {},
  onFilterChange,
  showFilter = false,
  filterTitle = "Table Filters",
}: ITableProps<T>) {
  const tableService = useMemo(() => new TableService<T>(), []);
  
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(externalItemsPerPage);
  const [filters, setFilters] = useState<SelectedFilters>(initialFilterValues);
  const [columnFilters, setColumnFilters] = useState<SelectedFilters>({});
  const [columns, setColumns] = useState<ITableColumn<T>[]>(initialColumns);
  const [showColumnFilterSummary, setShowColumnFilterSummary] = useState(false);
  // Инициализирай sortKey като undefined, независимо от defaultSortKey, за да няма сортиране по подразбиране
  const [sortKey, setSortKey] = useState<string | undefined>(undefined);
  // Инициализирай sortDirection като null, независимо от defaultSortDirection, за да няма сортиране по подразбиране
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  const currentPage = externalCurrentPage ?? internalCurrentPage;
  const setCurrentPage = externalSetCurrentPage ?? setInternalCurrentPage;
  const itemsPerPage = externalItemsPerPage ?? internalItemsPerPage;
  const setItemsPerPage = externalSetItemsPerPage ?? setInternalItemsPerPage;

  // All filters combined (global + column-specific)
  const allFilters = useMemo(() => {
    return { ...filters, ...columnFilters };
  }, [filters, columnFilters]);

  // Apply column filters to the data
  const filteredData = useMemo(() => {
    let result = [...data];
    
    // Apply column-specific filters
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value === null || value === '') return;
      
      const column = columns.find(col => col.key === key);
      if (!column) return;
      
      switch (column.filterType) {
        case 'select':
          result = result.filter(item => (item as any)[key] === value);
          break;
          
        case 'multiselect':
          if (Array.isArray(value) && value.length > 0) {
            result = result.filter(item => value.includes((item as any)[key]));
          }
          break;
          
        case 'search':
          if (typeof value === 'string' && value.trim() !== '') {
            const searchTerm = value.toLowerCase();
            result = result.filter(item => {
              const itemValue = String((item as any)[key] || '').toLowerCase();
              return itemValue.includes(searchTerm);
            });
          }
          break;
          
        case 'range':
          if (value.min !== undefined && value.min !== null) {
            result = result.filter(item => (item as any)[key] >= value.min);
          }
          if (value.max !== undefined && value.max !== null) {
            result = result.filter(item => (item as any)[key] <= value.max);
          }
          break;
      }
    });
    
    return result;
  }, [data, columnFilters, columns]);

  // Apply sorting to the filtered data
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    
    const column = columns.find(col => col.key === sortKey);
    return tableService.sortData(
      filteredData, 
      sortKey, 
      sortDirection, 
      column?.sortFn
    );
  }, [tableService, filteredData, sortKey, sortDirection, columns]);

  // Function to determine if a column should be sortable based on its type
  const isSortableColumn = (column: ITableColumn<T>) => {
    // Don't allow sorting for select/multiselect columns (like Role, Status) 
    // as these are meant for filtering only
    if (column.filterType === 'select' || column.filterType === 'multiselect') {
      return false;
    }
    
    // Otherwise, respect the column's sortable property
    return column.sortable === true;
  };

  // Handle sorting when a sortable column header is clicked
  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column) return;
    
    // Don't sort if the column shouldn't be sortable
    if (!isSortableColumn(column)) return;
    
    // Prevent sorting when filters are active
    if (Object.keys(columnFilters).length > 0) {
      return;
    }
    
    setSortKey(columnKey);
    if (sortKey === columnKey) {
      // Cycle through sort directions: null -> asc -> desc -> null
      if (sortDirection === null) setSortDirection('asc');
      else if (sortDirection === 'asc') setSortDirection('desc');
      else setSortDirection(null);
    } else {
      // Default to ascending for a new sort column
      setSortDirection('asc');
    }
  };

  // Handle column filter changes
  const handleColumnFilterChange = (columnKey: string, value: any) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      if (value === null) {
        delete newFilters[columnKey];
      } else {
        newFilters[columnKey] = value;
      }
      return newFilters;
    });
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle global filter changes
  const handleFilterChange = (selectedFilters: SelectedFilters) => {
    setFilters(selectedFilters);
    setCurrentPage(1); // Reset to first page when filters change
    
    // Call external filter change handler if provided
    if (onFilterChange) {
      onFilterChange(selectedFilters);
    }
  };

  // Toggle column visibility
  const handleToggleColumnVisibility = (columnKey: string) => {
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.key === columnKey ? { ...col, hidden: !col.hidden } : col
      )
    );
  };

  // Reset all column filters
  const resetColumnFilters = () => {
    setColumnFilters({});
    setShowColumnFilterSummary(false); // Close the filter dropdown after clearing
  };

  // Visible columns (exclude hidden ones)
  const visibleColumns = useMemo(() => {
    return columns.filter(column => !column.hidden);
  }, [columns]);

  // Get filter summary counts
  const activeColumnFilterCount = useMemo(() => 
    Object.keys(columnFilters).length, 
    [columnFilters]
  );
  
  // Reference for the filter summary dropdown
  const filterSummaryRef = useRef<HTMLDivElement>(null);
  
  // Close filter summary when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterSummaryRef.current && !filterSummaryRef.current.contains(event.target as Node)) {
        setShowColumnFilterSummary(false);
      }
    }
    
    if (showColumnFilterSummary) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColumnFilterSummary]);

  useEffect(() => {
    if (externalItemsPerPage !== undefined) {
      setInternalItemsPerPage(externalItemsPerPage);
    }
  }, [externalItemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortedData.length, setCurrentPage]);
  
  const totalPages = useMemo(() => 
    Math.max(1, tableService.calculateTotalPages(sortedData.length, itemsPerPage)),
    [tableService, sortedData.length, itemsPerPage]
  );
  
  const paginatedData = useMemo(() => 
    tableService.getPaginatedData(sortedData, currentPage, itemsPerPage),
    [tableService, sortedData, currentPage, itemsPerPage]
  );

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const emptyRows = itemsPerPage - paginatedData.length;

  // Function to render sort indicator
  const renderSortIndicator = (columnKey: string) => {
    if (sortKey !== columnKey) return <ChevronDown size={14} className="ml-1 text-gray-400" />;
    
    if (sortDirection === 'asc') return <ArrowUp size={14} className="ml-1 text-indigo-600" />;
    if (sortDirection === 'desc') return <ArrowDown size={14} className="ml-1 text-indigo-600" />;
    
    return <ChevronDown size={14} className="ml-1 text-gray-400" />;
  };

  return (
    <div className="space-y-4">
      {/* Render Filter component if showFilter is true and filterGroups are provided */}
      {showFilter && filterGroups.length > 0 && (
        <Filter
          filterGroups={filterGroups}
          initialValues={initialFilterValues}
          onFilterChange={handleFilterChange}
          title={filterTitle}
          layout="horizontal"
          animated={true}
          showReset={true}
          compact={false}
        />
      )}
      
      <div className={`bg-white rounded-lg shadow ${className}`}>
        {/* Table controls section */}
        <div className="px-6 py-3 flex items-center justify-between border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            <h2 className="text-sm font-medium text-gray-700">
              {sortedData.length} {sortedData.length === 1 ? 'item' : 'items'}
            </h2>
            
            {/* Column filter summary */}
            {activeColumnFilterCount > 0 && (
              <div className="relative" ref={filterSummaryRef}>
                <button 
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                  onClick={() => setShowColumnFilterSummary(!showColumnFilterSummary)}
                >
                  <FilterIcon size={14} className="mr-1.5" />
                  {activeColumnFilterCount} {activeColumnFilterCount === 1 ? 'filter' : 'filters'}
                </button>
                
                {showColumnFilterSummary && (
                  <div className="absolute left-0 top-full mt-1 z-10 w-64 bg-white rounded-md shadow-lg border border-gray-200 p-3">
                    <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-800">Active Filters</h3>
                      <button 
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                        onClick={resetColumnFilters}
                      >
                        <RotateCcw size={12} className="mr-1" />
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {Object.entries(columnFilters).map(([key, value]) => {
                        const column = columns.find(col => col.key === key);
                        if (!column) return null;
                        
                        let displayValue: string;
                        if (Array.isArray(value)) {
                          displayValue = `${value.length} selected`;
                        } else if (typeof value === 'object' && value !== null) {
                          // Range filter
                          const min = value.min !== undefined && value.min !== null ? value.min : '—';
                          const max = value.max !== undefined && value.max !== null ? value.max : '—';
                          displayValue = `${min} - ${max}`;
                        } else {
                          displayValue = String(value);
                        }
                        
                        return (
                          <div key={key} className="flex justify-between items-center text-xs">
                            <span className="font-medium text-gray-700">{column.header}:</span>
                            <div className="flex items-center">
                              <span className="text-gray-600">{displayValue}</span>
                              <button 
                                className="ml-2 text-gray-400 hover:text-gray-600"
                                onClick={() => handleColumnFilterChange(key, null)}
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
          
          {/* Table size controls */}
          {showTableSizeControls && (
            <TableSizeControls
              itemsPerPage={itemsPerPage}
              setItemsPerPage={handleItemsPerPageChange}
              options={rowsPerPageOptions.map(size => ({
                size, 
                available: size <= Math.max(...rowsPerPageOptions, sortedData.length)
              }))}
            />
          )}
        </div>
        
        {/* Show a discrete dropdown for hidden columns for better mobile/tablet experience */}
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
        
        {/* Table data */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {visibleColumns.map((column) => (
                  <th 
                    key={column.key}
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 ${column.className || ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {isSortableColumn(column) ? (
                          <button 
                            className="flex items-center hover:text-gray-700 focus:outline-none" 
                            onClick={() => handleSort(column.key)}
                          >
                            {column.header}
                            {renderSortIndicator(column.key)}
                          </button>
                        ) : (
                          <span>{column.header}</span>
                        )}
                      </div>
                      
                      {/* Column Menu */}
                      <ColumnMenu
                        column={column}
                        data={data}
                        onFilterChange={handleColumnFilterChange}
                        onToggleVisibility={handleToggleColumnVisibility}
                        activeFilters={columnFilters}
                        onSortChange={handleSort}
                        currentSortKey={sortKey}
                        currentSortDirection={sortDirection}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.length === 0 ? (
                <>
                  <tr>
                    <td 
                      colSpan={visibleColumns.length} 
                      className="px-6 py-4 text-center text-gray-500 border-b border-gray-200"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                  {Array.from({ length: Math.max(0, itemsPerPage - 1) }, (_, index) => (
                    <tr key={`filler-row-${index}`} className="h-14 border-b border-gray-200">
                      {visibleColumns.map((column) => (
                        <td 
                          key={`filler-${index}-${column.key}`} 
                          className="px-6 py-4 h-14 border-b border-gray-200"
                        >
                          &nbsp;
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ) : (
                <>
                  {paginatedData.map((item, index) => (
                    <tr 
                      key={keyExtractor(item)}
                      className={`h-14 border-b border-gray-200 ${
                        rowClassName && typeof rowClassName === 'function' 
                          ? rowClassName(item) 
                          : rowClassName
                      }`}
                    >
                      {visibleColumns.map((column) => (
                        <td 
                          key={`${keyExtractor(item)}-${column.key}`}
                          className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}
                        >
                          {column.render ? column.render(item) : (item as any)[column.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  
                  {emptyRows > 0 && 
                    Array.from({ length: emptyRows }, (_, index) => (
                      <tr key={`filler-row-${index}`} className="h-14 border-b border-gray-200">
                        {visibleColumns.map((column) => (
                          <td 
                            key={`filler-${index}-${column.key}`} 
                            className="px-6 py-4 h-14 border-b border-gray-200"
                          >
                            &nbsp;
                          </td>
                        ))}
                      </tr>
                    ))
                  }
                </>
              )}
            </tbody>
          </table>
        </div>
        
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={sortedData.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </div>
    </div>
  );
}