'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ITableProps, ITableColumn, SortDirection, SortCriterion } from './interfaces';
import { TableService } from './TableService';
import TablePagination from './TablePagination';
import PageSizeControl from './PageSizeControl';
import ColumnMenu from './ColumnMenu';
import TableContextMenu from './TableContextMenu';
import { Filter } from '../Filter';
import { SelectedFilters } from '../Filter/interfaces';
import { Filter as FilterIcon, RotateCcw, X, Eye, ArrowUp, ArrowDown, Hash, GripVertical } from 'lucide-react';

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
  const [filterOrder, setFilterOrder] = useState<string[]>([]);
  const [columns, setColumns] = useState<ITableColumn<T>[]>(initialColumns);
  const [showColumnFilterSummary, setShowColumnFilterSummary] = useState(false);

  // Legacy single sort state - maintain for backward compatibility
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection || null);

  // New multi-sort state
  const [sortCriteria, setSortCriteria] = useState<SortCriterion[]>(
    defaultSortCriteria || (defaultSortKey && defaultSortDirection ? 
      [{ key: defaultSortKey, direction: defaultSortDirection as 'asc'|'desc' }] : 
      [])
  );

  // Add state for context menu
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const currentPage = externalCurrentPage ?? internalCurrentPage;
  const setCurrentPage = externalSetCurrentPage ?? setInternalCurrentPage;
  const itemsPerPage = externalItemsPerPage ?? internalItemsPerPage;
  const setItemsPerPage = externalSetItemsPerPage ?? setInternalItemsPerPage;

  const allFilters = useMemo(() => {
    return { ...filters, ...columnFilters };
  }, [filters, columnFilters]);

  const filteredData = useMemo(() => {
    let result = [...data];

    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value === null || value === '') return;

      const column = columns.find(col => col.key === key);
      if (!column) return;

      switch (column.filterType) {
        case 'select':
          result = result.filter(item => (item as any)[key] === value);
          break;

        case 'boolean':
          if (value !== null) {
            const boolValue = value === true || value === 'true';
            result = result.filter(item => {
              const itemValue = Boolean((item as any)[key]);
              return itemValue === boolValue;
            });
          }
          break;

        case 'multiselect':
          if (Array.isArray(value) && value.length > 0) {
            result = result.filter(item => value.includes((item as any)[key]));
          }
          break;

        case 'daterange':
          if (value && (value.start || value.end)) {
            result = result.filter(item => {
              const itemDateValue = (item as any)[key];

              if (itemDateValue === null || itemDateValue === undefined) return true;

              let itemDate: Date;

              if (itemDateValue instanceof Date) {
                itemDate = itemDateValue;
              } else if (typeof itemDateValue === 'number') {
                itemDate = new Date(itemDateValue);
              } else if (typeof itemDateValue === 'string') {
                itemDate = new Date(itemDateValue);
              } else {
                return true;
              }

              if (isNaN(itemDate.getTime())) return true;

              if (value.start) {
                const startDate = new Date(value.start);
                if (startDate > itemDate) {
                  return false;
                }
              }

              if (value.end) {
                const endDate = new Date(value.end);
                endDate.setHours(23, 59, 59, 999);
                if (endDate < itemDate) {
                  return false;
                }
              }

              return true;
            });
          }
          break;

        case 'search':
          if (typeof value === 'object' && value !== null && value.term !== undefined) {
            const { term, field, method } = value;

            if (term === null) break;

            if (!term && !['isEmpty', 'isNotEmpty'].includes(method)) break;

            const searchTerm = String(term).toLowerCase();
            result = result.filter(item => {
              let itemValue;
              if (field && field !== key) {
                itemValue = String((item as any)[field] || '').toLowerCase();
              } else {
                itemValue = String((item as any)[key] || '').toLowerCase();
              }

              switch(method) {
                case 'contains':
                  return itemValue.includes(searchTerm);
                case 'equals':
                  return itemValue === searchTerm;
                case 'startsWith':
                  return itemValue.startsWith(searchTerm);
                case 'endsWith':
                  return itemValue.endsWith(searchTerm);
                case 'notContains':
                  return !itemValue.includes(searchTerm);
                case 'isEmpty':
                  return !itemValue || itemValue.trim() === '';
                case 'isNotEmpty':
                  return itemValue && itemValue.trim() !== '';
                case 'regex':
                  try {
                    return new RegExp(searchTerm).test(itemValue);
                  } catch (e) {
                    return false;
                  }
                default:
                  return itemValue.includes(searchTerm);
              }
            });
          } 
          else if (typeof value === 'string' && value.trim() !== '') {
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

  const sortedData = useMemo(() => {
    if (multiSort && sortCriteria.length > 0) {
      return tableService.multiSortData(filteredData, sortCriteria, columns);
    } else if (sortKey && sortDirection) {
      const column = columns.find(col => col.key === sortKey);
      return tableService.sortData(filteredData, sortKey, sortDirection, column?.sortFn);
    }
    return filteredData;
  }, [tableService, filteredData, sortKey, sortDirection, sortCriteria, columns, multiSort]);

  const isSortableColumn = (column: ITableColumn<T>) => {
    if (column.filterType === 'select' || 
        column.filterType === 'multiselect' || 
        column.filterType === 'boolean') {
      return false;
    }

    return column.sortable === true;
  };

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column || !isSortableColumn(column)) return;

    if (multiSort) {
      setSortCriteria(prevCriteria => {
        // Check if this column is already in the criteria
        const existingIndex = prevCriteria.findIndex(c => c.key === columnKey);

        if (existingIndex >= 0) {
          // Column already exists in criteria, toggle its direction or remove it
          const existing = prevCriteria[existingIndex];
          const newCriteria = [...prevCriteria];

          if (existing.direction === 'asc') {
            // Change to descending
            newCriteria[existingIndex] = { ...existing, direction: 'desc' };
          } else {
            // Remove this criterion
            newCriteria.splice(existingIndex, 1);
          }

          return newCriteria;
        } else {
          // Add new sorting criterion
          return [...prevCriteria, { key: columnKey, direction: 'asc' }];
        }
      });

      // Also update legacy state for backward compatibility
      const existingIndex = sortCriteria.findIndex(c => c.key === columnKey);
      if (existingIndex >= 0) {
        const existing = sortCriteria[existingIndex];
        if (existing.direction === 'asc') {
          setSortKey(columnKey);
          setSortDirection('desc');
        } else {
          setSortKey(undefined);
          setSortDirection(null);
        }
      } else {
        setSortKey(columnKey);
        setSortDirection('asc');
      }
    } else {
      // Original single-sort behavior
      setSortKey(columnKey);
      if (sortKey === columnKey) {
        if (sortDirection === null) setSortDirection('asc');
        else if (sortDirection === 'asc') setSortDirection('desc');
        else setSortDirection(null);
      } else {
        setSortDirection('asc');
      }

      // Keep sortCriteria in sync with legacy sort state
      if (sortDirection === 'asc' || sortDirection === 'desc') {
        setSortCriteria([{ key: columnKey, direction: sortDirection }]);
      } else {
        setSortCriteria([]);
      }
    }
  };

  const handleRemoveSortCriterion = (index: number) => {
    setSortCriteria(prevCriteria => {
      const newCriteria = [...prevCriteria];
      newCriteria.splice(index, 1);

      // Update legacy sort state to match
      if (newCriteria.length > 0) {
        setSortKey(newCriteria[0].key);
        setSortDirection(newCriteria[0].direction);
      } else {
        setSortKey(undefined);
        setSortDirection(null);
      }

      return newCriteria;
    });
  };

  const handleClearAllSorting = () => {
    setSortCriteria([]);
    setSortKey(undefined);
    setSortDirection(null);
  };

  const handleColumnFilterChange = (columnKey: string, value: any) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      if (value === null) {
        delete newFilters[columnKey];
        // Remove from filter order when filter is removed
        setFilterOrder(prevOrder => prevOrder.filter(key => key !== columnKey));
      } else {
        newFilters[columnKey] = value;
        // Add to filter order if not already present
        setFilterOrder(prevOrder => {
          if (!prevOrder.includes(columnKey)) {
            return [...prevOrder, columnKey];
          }
          return prevOrder;
        });
      }
      return newFilters;
    });
    setCurrentPage(1);
  };

  const handleFilterChange = (selectedFilters: SelectedFilters) => {
    setFilters(selectedFilters);
    setCurrentPage(1);

    if (onFilterChange) {
      onFilterChange(selectedFilters);
    }
  };

  const handleToggleColumnVisibility = (columnKey: string) => {
    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.key === columnKey ? { ...col, hidden: !col.hidden } : col
      )
    );

    const column = columns.find(col => col.key === columnKey);
    if (column && !column.hidden && columnFilters[columnKey] !== undefined) {
      setColumnFilters(prev => {
        const newFilters = { ...prev };
        delete newFilters[columnKey];
        return newFilters;
      });
      // Also remove from filter order
      setFilterOrder(prevOrder => prevOrder.filter(key => key !== columnKey));
    }
  };

  const resetColumnFilters = () => {
    setColumnFilters({});
    setFilterOrder([]);
    setShowColumnFilterSummary(false);
  };

  const visibleColumns = useMemo(() => {
    return columns.filter(column => !column.hidden);
  }, [columns]);

  const activeColumnFilterCount = useMemo(() => 
    Object.keys(columnFilters).length, 
    [columnFilters]
  );

  const filterSummaryRef = useRef<HTMLDivElement>(null);
  const sortCriteriaRef = useRef<HTMLDivElement>(null);
  const [showSortCriteriaSummary, setShowSortCriteriaSummary] = useState(false);

  // Handle right click on table to show context menu
  const handleTableRightClick = (e: React.MouseEvent) => {
    // Prevent default browser context menu
    e.preventDefault();

    // Check if the click target is a table cell or header
    // If it is, the cell's own context menu handler will take care of it
    const target = e.target as HTMLElement;
    const isTableCell = target.tagName === 'TD' || 
                        target.closest('td') !== null || 
                        target.tagName === 'TH' || 
                        target.closest('th') !== null;

    // Only show the generic context menu if we're not clicking on a cell or header
    // and we have filterable columns
    if (!isTableCell && columns.some(col => col.filterable)) {
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      // Clear any previously set column
      (window as any).__currentColumnForContextMenu = null;
    }
  };

  // Close context menu
  const handleCloseContextMenu = () => {
    setContextMenuPosition(null);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if ((filterSummaryRef.current && !filterSummaryRef.current.contains(event.target as Node)) ||
          (sortCriteriaRef.current && !sortCriteriaRef.current.contains(event.target as Node))) {
        setShowColumnFilterSummary(false);
        setShowSortCriteriaSummary(false);
      }
    }

    if (showColumnFilterSummary || showSortCriteriaSummary) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColumnFilterSummary, showSortCriteriaSummary]);

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

  const renderSortIndicator = (columnKey: string) => {
    if (!multiSort) {
      // Single draggable sort indicator
      const isColumnSorted = sortKey === columnKey;
      return (
        <div 
          className={`flex items-center ml-1 cursor-grab active:cursor-grabbing ${isColumnSorted ? 'sort-active' : ''}`}
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', columnKey);
            e.dataTransfer.effectAllowed = 'move';
            const img = new Image();
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
            e.dataTransfer.setDragImage(img, 0, 0);
            e.currentTarget.classList.add('dragging');
          }}
          onDragEnd={(e) => {
            e.currentTarget.classList.remove('dragging');
          }}
        >
          <div 
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
              isColumnSorted 
                ? sortDirection === 'asc' 
                  ? 'bg-indigo-100 text-indigo-600 rotate-0' 
                  : 'bg-indigo-100 text-indigo-600 rotate-180' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
            title={isColumnSorted 
              ? sortDirection === 'asc' 
                ? 'Sorted ascending. Click to sort descending.' 
                : 'Sorted descending. Click to clear sort.' 
              : 'Click to sort ascending. Drag to reorder columns.'}
          >
            <ArrowUp size={14} className="transform transition-transform duration-200" />
          </div>
        </div>
      );
    }

    // Multi-sort indicator
    const criterionIndex = sortCriteria.findIndex(c => c.key === columnKey);
    if (criterionIndex === -1) {
      return (
        <div 
          className="flex items-center ml-1 cursor-grab active:cursor-grabbing"
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', columnKey);
            e.dataTransfer.effectAllowed = 'move';
            const img = new Image();
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
            e.dataTransfer.setDragImage(img, 0, 0);
            e.currentTarget.classList.add('dragging');
          }}
          onDragEnd={(e) => {
            e.currentTarget.classList.remove('dragging');
          }}
        >
          <div className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 flex items-center justify-center">
            <ArrowUp size={14} />
          </div>
        </div>
      );
    }

    const criterion = sortCriteria[criterionIndex];
    return (
      <div 
        className="flex items-center ml-1 gap-1 cursor-grab active:cursor-grabbing"
        draggable={true}
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', JSON.stringify({ key: columnKey, index: criterionIndex }));
          e.dataTransfer.effectAllowed = 'move';
          const img = new Image();
          img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
          e.dataTransfer.setDragImage(img, 0, 0);
          e.currentTarget.classList.add('dragging');
        }}
        onDragEnd={(e) => {
          e.currentTarget.classList.remove('dragging');
        }}
      >
        {criterionIndex > 0 && (
          <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 text-xs px-1.5 font-medium text-indigo-700 min-w-[1.5rem] h-5">
            {criterionIndex + 1}
          </span>
        )}
        <div 
          className={`w-5 h-5 rounded-full flex items-center justify-center ${
            criterion.direction === 'asc' 
              ? 'bg-indigo-100 text-indigo-600 rotate-0' 
              : 'bg-indigo-100 text-indigo-600 rotate-180'
          }`}
          title={criterion.direction === 'asc' 
            ? 'Sorted ascending. Click to sort descending.' 
            : 'Sorted descending. Click to clear sort.'}
        >
          <ArrowUp size={14} className="transform transition-transform duration-200" />
        </div>
      </div>
    );
  };

  // Add CSS for animation
  // Handle drop event for sort indicators
  const handleSortDrop = (e: React.DragEvent<HTMLTableCellElement>, targetColumnKey: string) => {
    e.preventDefault();

    try {
      // Check if this is a multi-sort criterion
      const data = e.dataTransfer.getData('text/plain');
      if (data.startsWith('{')) {
        // This is a multi-sort criterion being reordered
        const { key, index } = JSON.parse(data);

        if (key && index !== undefined) {
          // Move the criterion to a new position
          setSortCriteria(prevCriteria => {
            const newCriteria = [...prevCriteria];
            const item = newCriteria.splice(index, 1)[0];

            // Find the target index
            const targetIndex = newCriteria.findIndex(c => c.key === targetColumnKey);
            if (targetIndex !== -1) {
              newCriteria.splice(targetIndex, 0, item);
            } else {
              // If target column is not in criteria, add it to the end
              newCriteria.push(item);
            }

            // Update legacy sort state
            if (newCriteria.length > 0) {
              setSortKey(newCriteria[0].key);
              setSortDirection(newCriteria[0].direction);
            }

            return newCriteria;
          });
        }
      } else {
        // This is a single column being dragged to create a sort
        const sourceColumnKey = data;
        const sourceColumn = columns.find(col => col.key === sourceColumnKey);
        const targetColumn = columns.find(col => col.key === targetColumnKey);

        if (sourceColumn && targetColumn && isSortableColumn(sourceColumn) && isSortableColumn(targetColumn)) {
          if (multiSort) {
            // In multi-sort mode, add the source column as a new criterion
            setSortCriteria(prevCriteria => {
              const existingIndex = prevCriteria.findIndex(c => c.key === sourceColumnKey);

              if (existingIndex >= 0) {
                // If source column is already in criteria, move it
                const newCriteria = [...prevCriteria];
                const item = newCriteria.splice(existingIndex, 1)[0];

                // Find the target index
                const targetIndex = newCriteria.findIndex(c => c.key === targetColumnKey);
                if (targetIndex !== -1) {
                  newCriteria.splice(targetIndex, 0, item);
                } else {
                  // If target column is not in criteria, add it to the end
                  newCriteria.push(item);
                }

                return newCriteria;
              } else {
                // Add new sorting criterion
                return [...prevCriteria, { key: sourceColumnKey, direction: 'asc' }];
              }
            });
          } else {
            // In single-sort mode, just set the source column as the sort key
            setSortKey(sourceColumnKey);
            setSortDirection('asc');
          }
        }
      }
    } catch (error) {
      console.error('Error handling sort drop:', error);
    }
  };

  useEffect(() => {
    // Create style element for menu animation if it doesn't exist
    if (!document.getElementById('table-context-menu-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'table-context-menu-styles';
      styleElement.textContent = `
        @keyframes menuAppear {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .sort-indicator-dragging {
          opacity: 0.5;
        }

        th.sort-drop-target {
          background-color: rgba(79, 70, 229, 0.1);
        }

        .sort-criteria-item {
          transition: all 0.2s ease;
        }

        .sort-criteria-item.dragging {
          opacity: 0.5;
          transform: scale(0.98);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .sort-criteria-item.drop-target {
          background-color: rgba(79, 70, 229, 0.1);
          border: 1px dashed rgba(79, 70, 229, 0.5);
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, []);

  return (
    <div className="space-y-4">
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
        <div className="px-6 py-3 flex items-center justify-between border-b border-gray-200 bg-white">
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
                        const column = columns.find(col => col.key === key);
                        if (!column || value === undefined) return null;

                        let displayValue: string;
                        if (Array.isArray(value)) {
                          displayValue = `${value.length} selected`;
                        } else if (typeof value === 'object' && value !== null) {
                          if (value.start || value.end) {
                            const formatDate = (date: Date | string | null | undefined) => {
                              if (!date) return '—';
                              const dateObj = typeof date === 'string' ? new Date(date) : date;
                              return dateObj.toLocaleDateString('bg-BG', { 
                                day: '2-digit', 
                                month: '2-digit', 
                                year: 'numeric' 
                              });
                            };

                            const start = formatDate(value.start);
                            const end = formatDate(value.end);
                            displayValue = `${start} - ${end}`;
                          } else if (value.min !== undefined || value.max !== undefined) {
                            const min = value.min !== undefined && value.min !== null ? value.min : '—';
                            const max = value.max !== undefined && value.max !== null ? value.max : '—';
                            displayValue = `${min} - ${max}`;
                          } else if (value.term !== undefined) {
                            displayValue = `"${value.term}"`;
                          } else {
                            displayValue = "Custom filter";
                          }
                        } else {
                          displayValue = String(value);
                        }

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
                              <span className="font-medium text-gray-700">{column.header}:</span>
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
                                  setSortCriteria(prevCriteria => {
                                    const newCriteria = [...prevCriteria];
                                    const [movedItem] = newCriteria.splice(data.index, 1);
                                    newCriteria.splice(index, 0, movedItem);

                                    // Update legacy sort state
                                    if (newCriteria.length > 0) {
                                      setSortKey(newCriteria[0].key);
                                      setSortDirection(newCriteria[0].direction);
                                    }

                                    return newCriteria;
                                  });
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
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {visibleColumns.map((column) => (
                  <th 
                    key={column.key}
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 table-column-header transition-colors duration-200 ${column.className || ''}`}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      const rect = e.currentTarget.getBoundingClientRect();
                      setContextMenuPosition({ x: e.clientX, y: rect.bottom });
                      // Store the current column for the context menu
                      (window as any).__currentColumnForContextMenu = column;
                    }}
                    onDragOver={(e) => {
                      if (isSortableColumn(column)) {
                        e.preventDefault();
                        e.currentTarget.classList.add('sort-drop-target');
                      }
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('sort-drop-target');
                    }}
                    onDrop={(e) => {
                      e.currentTarget.classList.remove('sort-drop-target');
                      if (isSortableColumn(column)) {
                        handleSortDrop(e, column.key);
                      }
                    }}
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
                  {paginatedData.map((item) => (
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
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setContextMenuPosition({ x: e.clientX, y: e.clientY });
                            // Store the current column for the context menu
                            (window as any).__currentColumnForContextMenu = column;
                          }}
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
          showPageSizeControl={false} // We're showing it above
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
    </div>
  );
}
