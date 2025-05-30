import React, { createContext, useContext, ReactNode, useState, useMemo, useEffect } from 'react';
import { ITableColumn, SortDirection, SortCriterion } from '../interfaces';
import { TableService } from '../TableService';
import { TableExportService } from '../services/TableExportService';
import { TableAppearanceService } from '../services/TableAppearanceService';
import { useTableFilters } from '../hooks/useTableFilters';
import { useTableSort } from '../hooks/useTableSort';
import { useTableSelection } from '../hooks/useTableSelection';
import { useTheme } from '../../ThemeProvider';

// Define the context type
interface TableContextType<T> {
  // Data
  data: T[];
  filteredData: T[];
  sortedData: T[];
  paginatedData: T[];
  emptyRows: number;

  // Columns
  columns: ITableColumn<T>[];
  visibleColumns: ITableColumn<T>[];
  setColumns: React.Dispatch<React.SetStateAction<ITableColumn<T>[]>>;
  handleToggleColumnVisibility: (columnKey: string) => void;

  // Add Item
  isAddingItem: boolean;
  setIsAddingItem: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddItem: (newItem: T) => void;

  // Filtering
  columnFilters: Record<string, any>;
  filterOrder: string[];
  handleColumnFilterChange: (columnKey: string, value: any) => void;
  resetColumnFilters: () => void;
  activeColumnFilterCount: number;
  setFilterOrder: (order: string[]) => void;

  // Sorting
  sortKey: string | undefined;
  sortDirection: SortDirection;
  sortCriteria: SortCriterion[];
  handleSort: (columnKey: string) => void;
  handleRemoveSortCriterion: (index: number) => void;
  handleClearAllSorting: () => void;
  showSortCriteriaSummary: boolean;
  setShowSortCriteriaSummary: React.Dispatch<React.SetStateAction<boolean>>;
  setSortCriteria: React.Dispatch<React.SetStateAction<SortCriterion[]>>;
  handleSortDrop: (e: React.DragEvent<HTMLTableCellElement>, targetColumnKey: string) => void;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (size: number) => void;
  totalPages: number;

  // Selection
  selectedItems: T[];
  selectedItemIds: Set<string | number>;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  toggleSelectAll: () => void;
  toggleSelectItem: (item: T) => void;
  isItemSelected: (item: T) => boolean;
  clearSelection: () => void;
  selectCurrentPageItems: () => void;
  selectAllItems: () => void;

  // Context menu
  contextMenuPosition: { x: number; y: number } | null;
  setContextMenuPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number } | null>>;
  handleTableRightClick: (e: React.MouseEvent) => void;
  handleCellContextMenu: (e: React.MouseEvent, item: T, column?: ITableColumn<T>) => void;
  handleCloseContextMenu: () => void;

  // Bulk edit
  showBulkEditBar: boolean;
  setShowBulkEditBar: React.Dispatch<React.SetStateAction<boolean>>;
  handleBulkEdit: (selectedItems: T[], columnKey: string, newValue: any) => Promise<void>;

  // Delete
  showDeleteConfirmation: boolean;
  setShowDeleteConfirmation: React.Dispatch<React.SetStateAction<boolean>>;

  // Edit
  editingItem: T | null;
  setEditingItem: React.Dispatch<React.SetStateAction<T | null>>;
  handleEdit: (item: T) => void;

  // Appearance
  density: 'compact' | 'normal' | 'relaxed';
  setDensity: React.Dispatch<React.SetStateAction<'compact' | 'normal' | 'relaxed'>>;
  theme: 'light' | 'dark' | 'site';
  setTheme: React.Dispatch<React.SetStateAction<'light' | 'dark' | 'site'>>;
  showGridLines: boolean;
  setShowGridLines: React.Dispatch<React.SetStateAction<boolean>>;
  stripedRows: boolean;
  setStripedRows: React.Dispatch<React.SetStateAction<boolean>>;
  highlightOnHover: boolean;
  setHighlightOnHover: React.Dispatch<React.SetStateAction<boolean>>;
  stickyHeader: boolean;
  setStickyHeader: React.Dispatch<React.SetStateAction<boolean>>;
  effectiveTheme: 'light' | 'dark';
  tableClassNames: string;

  // Refresh
  isRefreshing: boolean;
  handleRefreshData: () => void;

  // Export
  handleExportData: (format: 'csv' | 'excel' | 'pdf') => void;
  handlePrint: () => void;

  // Services
  tableService: TableService<T>;
  exportService: TableExportService<T>;
  appearanceService: TableAppearanceService;

  // Other
  keyExtractor: (item: T) => string | number;
  emptyMessage: string;
  rowClassName: string | ((item: T) => string);
  tableId: string;
  editableColumns: any[];
  onBulkEdit?: (selectedItems: T[], columnKey: string, newValue: any) => Promise<void>;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  itemType: string;
}

// Create the context with a default value of undefined
const TableContext = createContext<TableContextType<any> | undefined>(undefined);

// Provider props
interface TableProviderProps<T> {
  children: ReactNode;
  data: T[];
  columns: ITableColumn<T>[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  rowClassName?: string | ((item: T) => string);
  itemsPerPage?: number;
  setItemsPerPage?: (size: number) => void;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  defaultSortKey?: string;
  defaultSortDirection?: SortDirection;
  defaultSortCriteria?: SortCriterion[];
  multiSort?: boolean;
  tableId?: string;
  selectedItems?: T[];
  onSelectionChange?: (selectedItems: T[]) => void;
  editableColumns?: any[];
  onBulkEdit?: (selectedItems: T[], columnKey: string, newValue: any) => Promise<void>;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onAddItem?: (newItem: T) => Promise<void>;
  itemType?: string;
  density?: 'compact' | 'normal' | 'relaxed';
  theme?: 'light' | 'dark' | 'site';
  showGridLines?: boolean;
  stripedRows?: boolean;
  highlightOnHover?: boolean;
  stickyHeader?: boolean;
  onExportData?: (format: 'csv' | 'excel' | 'pdf') => void;
  onPrint?: () => void;
}

// Provider component
export function TableProvider<T>({
  children,
  data,
  columns: initialColumns,
  keyExtractor,
  emptyMessage = "No data available",
  rowClassName = "",
  itemsPerPage: externalItemsPerPage = 10,
  setItemsPerPage: externalSetItemsPerPage,
  currentPage: externalCurrentPage = 1,
  setCurrentPage: externalSetCurrentPage,
  defaultSortKey,
  defaultSortDirection,
  defaultSortCriteria = [],
  multiSort = false,
  tableId = `table-${Math.random().toString(36).substr(2, 9)}`,
  selectedItems: externalSelectedItems,
  onSelectionChange: externalOnSelectionChange,
  editableColumns = [],
  onBulkEdit,
  onEdit,
  onDelete,
  onAddItem,
  itemType = 'items',
  density: propDensity = 'normal',
  theme: propTheme = 'site',
  showGridLines: propShowGridLines = false,
  stripedRows: propStripedRows = false,
  highlightOnHover: propHighlightOnHover = true,
  stickyHeader: propStickyHeader = false,
  onExportData,
  onPrint,
}: TableProviderProps<T>) {
  // Initialize services
  const tableService = useMemo(() => new TableService<T>(), []);
  const exportService = useMemo(() => new TableExportService<T>(), []);
  const appearanceService = useMemo(() => new TableAppearanceService(), []);

  // State for internal pagination if external is not provided
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(externalItemsPerPage);

  // State for columns
  const [columns, setColumns] = useState<typeof initialColumns>(initialColumns);

  // State for UI elements
  const [showColumnFilterSummary, setShowColumnFilterSummary] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [showBulkEditBar, setShowBulkEditBar] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  // State for appearance settings
  const [density, setDensity] = useState<'compact' | 'normal' | 'relaxed'>(propDensity);
  const [theme, setTheme] = useState<'light' | 'dark' | 'site'>(propTheme);
  const [showGridLines, setShowGridLines] = useState(propShowGridLines);
  const [stripedRows, setStripedRows] = useState(propStripedRows);
  const [highlightOnHover, setHighlightOnHover] = useState(propHighlightOnHover);
  const [stickyHeader, setStickyHeader] = useState(propStickyHeader);

  // Update settings when props change
  useEffect(() => { setDensity(propDensity); }, [propDensity]);
  useEffect(() => { setTheme(propTheme); }, [propTheme]);
  useEffect(() => { setShowGridLines(propShowGridLines); }, [propShowGridLines]);
  useEffect(() => { setStripedRows(propStripedRows); }, [propStripedRows]);
  useEffect(() => { setHighlightOnHover(propHighlightOnHover); }, [propHighlightOnHover]);
  useEffect(() => { setStickyHeader(propStickyHeader); }, [propStickyHeader]);

  // Resolve pagination props/state
  const currentPage = externalCurrentPage ?? internalCurrentPage;
  const setCurrentPage = externalSetCurrentPage ?? setInternalCurrentPage;
  const itemsPerPage = externalItemsPerPage ?? internalItemsPerPage;
  const setItemsPerPage = externalSetItemsPerPage ?? setInternalItemsPerPage;

  // Get visible columns
  const visibleColumns = useMemo(() => {
    return columns.filter(column => !column.hidden);
  }, [columns]);

  // Use custom hooks for table functionality
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

        if (sourceColumn && targetColumn && sourceColumn.sortable !== false && targetColumn.sortable !== false) {
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
      ((window as any).__currentColumnForContextMenu) = null;
    }
  };

  // Handle cell context menu
  const handleCellContextMenu = (e: React.MouseEvent, item: T, column?: ITableColumn<T>) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });

    // Store the current column for the context menu
    if (column) {
      ((window as any).__currentColumnForContextMenu) = column;
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

  // Handle adding a new item
  const handleAddItem = async (newItem: T) => {
    if (onAddItem) {
      try {
        await onAddItem(newItem);
        setIsAddingItem(false);
      } catch (error) {
        console.error('Failed to add item:', error);
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
    clearSelection();

    // Reset the refreshing state after animation completes
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500); // Match animation duration
  };

  // Add CSS for animation, auto-resize columns, and table appearance settings
  useEffect(() => {
    appearanceService.addTableStyles();

    return () => {
      appearanceService.removeTableStyles();
    };
  }, [appearanceService]);

  // Compute table class names based on appearance settings
  const tableClassNames = useMemo(() => {
    return appearanceService.computeTableClassNames(
      showGridLines,
      stripedRows,
      highlightOnHover,
      density
    );
  }, [appearanceService, showGridLines, stripedRows, highlightOnHover, density]);

  // Apply theme setting - only to the table component
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(theme === 'dark' ? 'dark' : 'light');

  // Get the site theme from ThemeProvider
  const { theme: siteTheme } = useTheme();

  useEffect(() => {
    // Determine if dark mode should be applied
    const isDarkMode = appearanceService.shouldUseDarkMode(theme, siteTheme);
    setEffectiveTheme(isDarkMode ? 'dark' : 'light');
  }, [theme, siteTheme, appearanceService]);

  // Export functionality
  const handleExportData = (format: 'csv' | 'excel' | 'pdf') => {
    if (onExportData) {
      onExportData(format);
    } else {
      // Default export implementation
      // Use selected items if any are selected, otherwise use current page data
      const dataToExport = selectedItems.length > 0 ? selectedItems : paginatedData;

      if (format === 'csv') {
        exportService.exportToCsv(dataToExport, visibleColumns);
      } else if (format === 'pdf') {
        exportService.exportToPdf(dataToExport, visibleColumns);
      }
      // For Excel, additional libraries would be needed
    }
  };

  // Print functionality
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      // Default print implementation that only prints the table
      // Use selected items if any are selected, otherwise use current page data
      const dataToPrint = selectedItems.length > 0 ? selectedItems : paginatedData;
      exportService.printTable(dataToPrint, visibleColumns);
    }
  };

  // Create the context value
  const contextValue = {
    // Data
    data,
    filteredData,
    sortedData,
    paginatedData,
    emptyRows,

    // Columns
    columns,
    visibleColumns,
    setColumns,
    handleToggleColumnVisibility,

    // Add Item
    isAddingItem,
    setIsAddingItem,
    handleAddItem,

    // Filtering
    columnFilters,
    filterOrder,
    handleColumnFilterChange,
    resetColumnFilters,
    activeColumnFilterCount,
    setFilterOrder,

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
    isItemSelected,
    clearSelection,
    selectCurrentPageItems,
    selectAllItems,

    // Context menu
    contextMenuPosition,
    setContextMenuPosition,
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
    setDensity,
    theme,
    setTheme,
    showGridLines,
    setShowGridLines,
    stripedRows,
    setStripedRows,
    highlightOnHover,
    setHighlightOnHover,
    stickyHeader,
    setStickyHeader,
    effectiveTheme,
    tableClassNames,

    // Refresh
    isRefreshing,
    handleRefreshData,

    // Export
    handleExportData,
    handlePrint,

    // Services
    tableService,
    exportService,
    appearanceService,

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
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
}

// Custom hook to use the table context
export function useTableContext<T>() {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return context as TableContextType<T>;
}
