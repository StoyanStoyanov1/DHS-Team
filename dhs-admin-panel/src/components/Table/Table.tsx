'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ITableProps } from './interfaces';
import { useTheme } from '../ThemeProvider';

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
import TableSettings from './TableSettings';
import BulkEditBar from './BulkEditBar';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { EditConfirmationPortal } from './TableRow';
import EditRowModal from './EditRowModal';
import { Eye, PencilIcon, Trash2, RotateCcw } from 'lucide-react';
import { useTableFilters } from './hooks/useTableFilters';
import { useTableSort } from './hooks/useTableSort';
import { useTableSelection } from './hooks/useTableSelection';
import { addTableStyles, isSortableColumn } from './utils';
import { ActiveFiltersDisplay, ActiveFilterItem } from '../Filter';
import SelectionOptionsMenu from './SelectionOptionsMenu';
import SelectionActionsMenu from './SelectionActionsMenu';

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
  onEdit,
  onDelete,
  itemType = 'items',
  // Table appearance settings
  density: propDensity = 'normal',
  theme: propTheme = 'site',
  showGridLines: propShowGridLines = false,
  stripedRows: propStripedRows = false,
  highlightOnHover: propHighlightOnHover = true,
  stickyHeader: propStickyHeader = false,
  // Export options
  onExportData,
  onPrint,
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
  const [editingItem, setEditingItem] = useState<T | null>(null);

  // Table appearance settings
  const [density, setDensity] = useState<'compact' | 'normal' | 'relaxed'>(propDensity);
  const [theme, setTheme] = useState<'light' | 'dark' | 'site'>(propTheme);
  const [showGridLines, setShowGridLines] = useState(propShowGridLines);
  const [stripedRows, setStripedRows] = useState(propStripedRows);
  const [highlightOnHover, setHighlightOnHover] = useState(propHighlightOnHover);
  const [stickyHeader, setStickyHeader] = useState(propStickyHeader);

  // Update settings when props change
  useEffect(() => {
    setDensity(propDensity);
  }, [propDensity]);

  useEffect(() => {
    setTheme(propTheme);
  }, [propTheme]);

  useEffect(() => {
    setShowGridLines(propShowGridLines);
  }, [propShowGridLines]);

  useEffect(() => {
    setStripedRows(propStripedRows);
  }, [propStripedRows]);

  useEffect(() => {
    setHighlightOnHover(propHighlightOnHover);
  }, [propHighlightOnHover]);

  useEffect(() => {
    setStickyHeader(propStickyHeader);
  }, [propStickyHeader]);

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
    clearSelection,
    selectCurrentPageItems,
    selectAllItems
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
    // Check if we're trying to hide a column
    const column = columns.find(col => col.key === columnKey);
    if (column && !column.hidden) {
      // Count currently visible columns
      const visibleColumnCount = columns.filter(col => !col.hidden).length;
      // Only allow hiding if there will still be at least 2 visible columns
      if (visibleColumnCount <= 2) {
        console.warn('Cannot hide column: At least 2 columns must remain visible');
        return;
      }
    }

    setColumns(prevColumns => 
      prevColumns.map(col => 
        col.key === columnKey ? { ...col, hidden: !col.hidden } : col
      )
    );

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

  // Handle edit for a single item
  const handleEdit = (item: T) => {
    setEditingItem(item);
  };

  // Table appearance settings handlers
  const handleChangeDensity = (newDensity: 'compact' | 'normal' | 'relaxed') => {
    setDensity(newDensity);
  };

  const handleChangeTheme = (newTheme: 'light' | 'dark' | 'site') => {
    setTheme(newTheme);
  };

  const handleToggleGridLines = () => {
    setShowGridLines(prev => !prev);
  };

  const handleToggleStripedRows = () => {
    setStripedRows(prev => !prev);
  };

  const handleToggleHighlightOnHover = () => {
    setHighlightOnHover(prev => !prev);
  };

  const handleToggleStickyHeader = () => {
    setStickyHeader(prev => !prev);
  };

  const handleToggleAutoResizeColumns = () => {
    // Toggle autoResizeColumns prop if needed
  };

  // Export functionality
  const handleExportData = (format: 'csv' | 'excel' | 'pdf') => {
    if (onExportData) {
      onExportData(format);
    } else {
      // Default export implementation
      const exportData = sortedData.map(item => {
        const row: Record<string, any> = {};
        visibleColumns.forEach(col => {
          // Get the raw value for the column
          let value = '';
          if (typeof item === 'object' && item !== null) {
            value = (item as any)[col.key] !== undefined ? (item as any)[col.key] : '';
          }
          row[col.header] = value;
        });
        return row;
      });

      if (format === 'csv') {
        // Simple CSV export
        const headers = visibleColumns.map(col => col.header);
        const csvContent = [
          headers.join(','),
          ...exportData.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `table-export-${new Date().toISOString()}.csv`);
        link.click();
      }
      // For Excel and PDF, additional libraries would be needed
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      // Default print implementation that only prints the table
      if (tableRef.current) {
        // Helper function to normalize values based on column type
        const normalizeValue = (value: any, column: typeof initialColumns[0]): string => {
          if (value === null || value === undefined) return '';

          // Check column's fieldDataType if available
          const dataType = column.fieldDataType;

          if (typeof value === 'object') {
            if (value instanceof Date || (dataType === 'date' && typeof value === 'string' && !isNaN(Date.parse(value)))) {
              // Format dates consistently
              const date = value instanceof Date ? value : new Date(value);
              return date.toLocaleDateString();
            } else if (Array.isArray(value)) {
              // Format arrays
              return value.map(item => normalizeValue(item, column)).join(', ');
            } else {
              // Format objects
              try {
                // Special handling for common object types
                if (dataType === 'role' && value.name) {
                  return value.name; // Assuming role objects have a name property
                }

                if (value.label || value.name || value.title || value.displayName) {
                  return value.label || value.name || value.title || value.displayName;
                }

                if (value.value !== undefined) {
                  return String(value.value);
                }

                // For Last Login or date-like objects with timestamp
                if (value.timestamp || value.date) {
                  const timestamp = value.timestamp || value.date;
                  return new Date(timestamp).toLocaleString();
                }

                // For Status-like objects
                if (value.status) {
                  return value.status;
                }

                // Default object handling - create a string of key-value pairs
                const objProps = Object.entries(value)
                  .map(([key, val]) => `${key}: ${normalizeValue(val, { fieldDataType: undefined })}`)
                  .join(', ');
                return objProps || JSON.stringify(value);
              } catch (e) {
                return JSON.stringify(value);
              }
            }
          } else if (typeof value === 'number') {
            // Format numbers consistently
            return value.toLocaleString();
          } else if (typeof value === 'boolean') {
            // Format booleans
            return value ? (column.labelTrue || 'Yes') : (column.labelFalse || 'No');
          }

          // Default string representation
          return String(value);
        };

        // Create a hidden iframe for printing
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);

        // Create a clean table with all rows and all columns, with header
        let printTableHTML = '<table class="print-table">';

        // Add table header with column names, including a column for row numbers
        printTableHTML += '<thead><tr>';
        printTableHTML += '<th>N</th>'; // Add row number column
        initialColumns.filter(col => !col.key.includes('selection')).forEach(column => {
          printTableHTML += `<th>${column.header}</th>`;
        });
        printTableHTML += '</tr></thead>';

        // Add all rows (not just current page)
        printTableHTML += '<tbody>';
        sortedData.forEach((item, index) => {
          printTableHTML += '<tr>';
          // Add row number cell
          printTableHTML += `<td>${index + 1}</td>`;
          // Skip adding cells for selection column
          initialColumns.filter(col => !col.key.includes('selection')).forEach(column => {
            let cellContent = '';
            // Always get the raw value first
            const rawValue = (item as any)[column.key];

            if (column.render) {
              // For rendered cells, try to get the text content
              try {
                const renderedContent = column.render(item);
                if (typeof renderedContent === 'string') {
                  cellContent = renderedContent;
                } else if (React.isValidElement(renderedContent)) {
                  // For React elements, use the normalized raw value instead
                  // This ensures consistent formatting for complex objects
                  cellContent = normalizeValue(rawValue, column);
                } else if (renderedContent === null || renderedContent === undefined) {
                  cellContent = '';
                } else {
                  // For other types of rendered content, try to convert to string
                  cellContent = String(renderedContent);
                }
              } catch (e) {
                // Fallback to raw data if render fails, using normalization
                cellContent = normalizeValue(rawValue, column);
              }
            } else {
              // For non-rendered cells, use the raw data with normalization
              cellContent = normalizeValue(rawValue, column);
            }
            printTableHTML += `<td>${cellContent}</td>`;
          });
          printTableHTML += '</tr>';
        });
        printTableHTML += '</tbody></table>';

        // Add total count of printed items
        const totalItemsText = `<div class="total-items">Total items: ${sortedData.length}</div>`;

        // Create print-friendly styles
        const styles = `
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .print-table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 10px;
            }
            .print-table th, .print-table td {
              padding: 8px;
              text-align: left;
              border: 1px solid #ddd;
            }
            .print-table th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            .dark .print-table th {
              background-color: #333;
              color: white;
            }
            .dark .print-table td {
              background-color: #444;
              color: white;
            }
            .dark {
              background-color: #333;
              color: white;
            }
            .total-items {
              margin-top: 10px;
              font-weight: bold;
              text-align: right;
            }
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
              button, .no-print {
                display: none !important;
              }
            }
          </style>
        `;

        // Write to the iframe document
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Table Print</title>
                ${styles}
              </head>
              <body class="${effectiveTheme === 'dark' ? 'dark' : ''}">
                ${printTableHTML}
                ${totalItemsText}
              </body>
            </html>
          `);
          iframeDoc.close();

          // Wait for the iframe to load before printing
          iframe.onload = () => {
            try {
              iframe.contentWindow?.focus();
              iframe.contentWindow?.print();

              // Remove the iframe after printing
              setTimeout(() => {
                document.body.removeChild(iframe);
              }, 1000);
            } catch (e) {
              console.error('Error printing:', e);
              // Fallback to window.print() if iframe printing fails
              window.print();
              document.body.removeChild(iframe);
            }
          };
        } else {
          // Fallback if iframe document is not available
          document.body.removeChild(iframe);
          window.print();
        }
      } else {
        // Fallback if table ref is not available
        window.print();
      }
    }
  };

  // Refresh data handler
  const handleRefreshData = () => {
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
  };

  // Add CSS for animation, auto-resize columns, and table appearance settings
  useEffect(() => {
    addTableStyles();

    // Add refresh button animation style and table appearance styles
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      ${refreshButtonAnimationStyle}

      /* Table appearance settings */
      .table-compact td, .table-compact th {
        padding: 0.5rem !important;
      }

      .table-relaxed td, .table-relaxed th {
        padding: 1.25rem !important;
      }

      .table-striped tbody tr:nth-child(odd) {
        background-color: rgba(0, 0, 0, 0.02);
      }

      .dark .table-striped tbody tr:nth-child(odd) {
        background-color: rgba(255, 255, 255, 0.02);
      }

      .table-hover tbody tr:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }

      .dark .table-hover tbody tr:hover {
        background-color: rgba(255, 255, 255, 0.04);
      }

      .sticky-header thead {
        position: sticky;
        top: 0;
        z-index: 10;
        background-color: white;
      }

      .dark .sticky-header thead {
        background-color: #1f2937;
      }

      /* Dark mode styles */
      .dark {
        color-scheme: dark;
      }

      .dark body {
        background-color: #111827;
        color: #f3f4f6;
      }

      .dark .bg-white {
        background-color: #1f2937 !important;
      }

      .dark .bg-gray-50 {
        background-color: #111827 !important;
      }

      .dark .bg-gray-100 {
        background-color: #1f2937 !important;
      }

      .dark .text-gray-700 {
        color: #f3f4f6 !important;
      }

      .dark .text-gray-800 {
        color: #f9fafb !important;
      }

      .dark .text-gray-900 {
        color: #ffffff !important;
      }

      .dark .border-gray-200 {
        border-color: #374151 !important;
      }
    `;
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

  // Compute table class names based on appearance settings
  const tableClassNames = useMemo(() => {
    let classes = "min-w-full ";

    // Grid lines
    if (showGridLines) {
      classes += "border border-gray-200 dark:border-gray-700 ";
    } else {
      classes += "divide-y divide-gray-200 dark:divide-gray-700 ";
    }

    // Striped rows
    if (stripedRows) {
      classes += "table-striped ";
    }

    // Highlight on hover
    if (highlightOnHover) {
      classes += "table-hover ";
    }

    // Row density
    if (density === 'compact') {
      classes += "table-compact ";
    } else if (density === 'relaxed') {
      classes += "table-relaxed ";
    }

    return classes.trim();
  }, [showGridLines, stripedRows, highlightOnHover, density]);

  // Apply theme setting - only to the table component
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(theme === 'dark' ? 'dark' : 'light');
  const tableRef = useRef<HTMLDivElement>(null);

  // Get the site theme from ThemeProvider
  const { theme: siteTheme } = useTheme();

  useEffect(() => {
    // Function to determine if dark mode should be applied
    const shouldUseDarkMode = () => {
      if (theme === 'dark') return true;
      if (theme === 'light') return false;
      // For 'site', use the site's theme
      if (theme === 'site') {
        if (siteTheme === 'dark') return true;
        if (siteTheme === 'light') return false;
        // If siteTheme is 'system', check system preference
        if (siteTheme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
      }
      // Fallback to system preference (should not happen with current options)
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    // Set the effective theme based on current settings
    setEffectiveTheme(shouldUseDarkMode() ? 'dark' : 'light');

    // For site theme, no need to listen for changes as the useTheme hook will trigger a re-render
    // when the site theme changes
  }, [theme, siteTheme]);

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
      <div 
        ref={tableRef}
        className={`${effectiveTheme === 'dark' ? 'dark' : ''} bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
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
              onClick={handleRefreshData}
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
              multiSort={multiSort}
              handleSortDrop={handleSortDrop}
              showSelectionColumn={showSelectionColumn}
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
              onChangeDensity={handleChangeDensity}
              theme={theme}
              onChangeTheme={handleChangeTheme}
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
              onChangeDensity={handleChangeDensity}
              theme={theme}
              onChangeTheme={handleChangeTheme}
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
