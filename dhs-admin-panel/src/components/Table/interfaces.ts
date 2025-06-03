import { ReactNode } from 'react';
import { FilterGroup, SelectedFilters } from './Filter';
import { EditableColumn } from './BulkEditBar';

/**
 * Defines the possible sort directions for table columns
 * - 'asc': Ascending order (A-Z, 0-9)
 * - 'desc': Descending order (Z-A, 9-0)
 * - null: No sorting applied
 */
export type SortDirection = 'asc' | 'desc' | null;

/**
 * Defines the available search methods for text filtering
 * - 'contains': Field contains the search term
 * - 'equals': Field exactly matches the search term
 * - 'startsWith': Field starts with the search term
 * - 'endsWith': Field ends with the search term
 * - 'notContains': Field does not contain the search term
 * - 'isEmpty': Field is empty
 * - 'isNotEmpty': Field is not empty
 * - 'regex': Field matches the regex pattern
 */
export type SearchMethod = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'notContains' | 'isEmpty' | 'isNotEmpty' | 'regex';

/**
 * Represents a single sort criterion for multi-column sorting
 */
export interface SortCriterion {
  /** The key of the column to sort by */
  key: string;
  /** The direction to sort in ('asc' or 'desc') */
  direction: 'asc' | 'desc';
}

/**
 * Defines a searchable field within a column
 */
export interface SearchField {
  /** The key identifier for the field */
  key: string;
  /** The display label for the field */
  label: string;
  /** Optional path to the field in nested objects */
  path?: string;
}

/**
 * Interface defining the configuration for a table column
 * @template T - The type of data items in the table
 */
export interface ITableColumn<T> {
  /** The text to display in the column header */
  header: string;
  /** Unique identifier for the column, typically matching a property name in the data */
  key: string;
  /** Optional custom render function for cell content */
  render?: (item: T) => ReactNode;
  /** Optional CSS class to apply to the column */
  className?: string;
  /** Whether the column is sortable (default: false) */
  sortable?: boolean;
  /** Custom sort function for the column */
  sortFn?: (a: T, b: T, direction: SortDirection) => number;

  /** Advanced filter groups for complex filtering */
  filterGroups?: FilterGroup[];
  /** Initial values for filters */
  initialFilterValues?: SelectedFilters;
  /** Callback when filter values change */
  onFilterChange?: (selectedFilters: SelectedFilters) => void;
  /** Whether to show the filter UI for this column */
  showFilter?: boolean;
  /** Title for the filter popover */
  filterTitle?: string;

  /** Whether the column is filterable (default: false) */
  filterable?: boolean;
  /** Type of filter to use for this column */
  filterType?: 'select' | 'multiselect' | 'search' | 'range' | 'checkbox' | 'custom' | 'boolean' | 'daterange';
  /** Options for select and multiselect filters */
  filterOptions?: { id: string | number; label: string; value: any }[];
  /** Min and max values for range filters */
  filterRange?: { min: number; max: number };
  /** Function to dynamically generate filter options from data */
  getFilterOptions?: (data: T[]) => { id: string | number; label: string; value: any }[];
  /** Custom component for advanced filtering */
  customFilterComponent?: (onFilterChange: (key: string, value: any) => void, currentValue: any) => ReactNode;

  /** Label for true values in boolean columns */
  labelTrue?: string;
  /** Label for false values in boolean columns */
  labelFalse?: string;
  /** Label for "All" option in filters */
  labelAll?: string;

  /** Whether to select all options by default in filters */
  defaultSelectAll?: boolean;

  /** Whether the column can be hidden by the user (default: true) */
  hideable?: boolean;
  /** Whether the column is initially hidden (default: false) */
  hidden?: boolean;

  /** Fields to search within this column (for complex objects) */
  searchFields?: SearchField[];
  /** Data type of the column for appropriate filtering and editing */
  fieldDataType?: 'text' | 'number' | 'date' | 'boolean' | 'array' | 'enum' | 'role';
  /** Recent search terms for this column */
  recentSearches?: string[];

  // Validation properties for add/edit forms
  /** Whether the field is required in forms */
  required?: boolean;
  /** Minimum length for text fields */
  minLength?: number;
  /** Maximum length for text fields */
  maxLength?: number;
  /** Validation pattern for text fields */
  pattern?: RegExp | string;
  /** Whether to hide this field in the create form */
  hideOnCreate?: boolean;
  /** Default value for the field in forms */
  defaultValue?: any;
  /** Custom validation function for the field */
  validate?: (value: any) => { isValid: boolean; message?: string } | boolean;
}

/**
 * Interface for the table service that handles core table functionality
 * @template T - The type of data items in the table
 */
export interface ITableService<T> {
  /**
   * Gets a subset of data for the current page
   * @param data - The full dataset
   * @param currentPage - The current page number (1-based)
   * @param itemsPerPage - Number of items to display per page
   * @returns Array of items for the current page
   */
  getPaginatedData(data: T[], currentPage: number, itemsPerPage: number): T[];

  /**
   * Calculates the total number of pages based on item count and page size
   * @param totalItems - Total number of items in the dataset
   * @param itemsPerPage - Number of items to display per page
   * @returns Total number of pages
   */
  calculateTotalPages(totalItems: number, itemsPerPage: number): number;

  /**
   * Sorts data by a single column
   * @param data - The data to sort
   * @param sortKey - The key of the column to sort by
   * @param sortDirection - The direction to sort ('asc', 'desc', or null)
   * @param sortFn - Optional custom sort function
   * @returns Sorted array of items
   */
  sortData(data: T[], sortKey: string, sortDirection: SortDirection, sortFn?: (a: T, b: T, direction: SortDirection) => number): T[];

  /**
   * Sorts data by multiple columns
   * @param data - The data to sort
   * @param sortCriteria - Array of sort criteria (column key and direction)
   * @param columns - Array of column definitions
   * @returns Sorted array of items
   */
  multiSortData(data: T[], sortCriteria: SortCriterion[], columns: ITableColumn<T>[]): T[];
}

/**
 * Interface for table pagination props and state
 */
export interface ITablePagination {
  /** Current page number (1-based) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Number of items displayed per page */
  itemsPerPage: number;
  /** Total number of items in the dataset */
  totalItems: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when items per page changes */
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  /** Available options for rows per page */
  rowsPerPageOptions?: number[];
  /** Whether to show the page size control dropdown */
  showPageSizeControl?: boolean;
}

/**
 * Main props interface for the Table component
 * @template T - The type of data items in the table
 */
export interface ITableProps<T> {
  /** Array of column configurations */
  columns: ITableColumn<T>[];
  /** Array of data items to display in the table */
  data: T[];
  /** Function to extract a unique key from each item */
  keyExtractor: (item: T) => string | number;
  /** Message to display when there's no data (default: "No data available") */
  emptyMessage?: string;
  /** Additional CSS class for the table container */
  className?: string;
  /** CSS class for table rows or function to generate class based on item */
  rowClassName?: string | ((item: T) => string);
  /** Whether to enable pagination (default: true) */
  pagination?: boolean;
  /** Number of items to display per page (default: 10) */
  itemsPerPage?: number;
  /** Callback when page size changes */
  setItemsPerPage?: (size: number) => void;
  /** Available options for rows per page */
  rowsPerPageOptions?: number[];
  /** Whether to show table size controls (default: true) */
  showTableSizeControls?: boolean;
  /** Current page number (1-based, default: 1) */
  currentPage?: number;
  /** Callback when page changes */
  setCurrentPage?: (page: number) => void;
  /** Whether to use a fixed table size (default: false) */
  fixedTableSize?: boolean;
  /** Initial sort column key */
  defaultSortKey?: string;
  /** Initial sort direction */
  defaultSortDirection?: 'asc' | 'desc' | null;
  /** Initial multi-sort criteria */
  defaultSortCriteria?: {key: string, direction: 'asc' | 'desc'}[];
  /** Whether to enable multi-column sorting (default: false) */
  multiSort?: boolean;
  /** Whether to automatically resize columns (default: true) */
  autoResizeColumns?: boolean;
  /** Minimum column width in pixels */
  minColumnWidth?: number;
  /** Maximum column width in pixels */
  maxColumnWidth?: number;
  /** Padding inside columns in pixels */
  columnPadding?: number;
  /** Unique ID for the table element */
  tableId?: string;

  // Table appearance settings
  /** Row density: compact, normal, or relaxed (default: normal) */
  density?: 'compact' | 'normal' | 'relaxed';
  /** Table theme: light, dark, or site (default: site) */
  theme?: 'light' | 'dark' | 'site';
  /** Whether to show grid lines (default: false) */
  showGridLines?: boolean;
  /** Whether to use striped rows (default: false) */
  stripedRows?: boolean;
  /** Whether to highlight rows on hover (default: true) */
  highlightOnHover?: boolean;
  /** Whether to make the header sticky (default: false) */
  stickyHeader?: boolean;

  // Export options
  /** Custom handler for exporting data */
  onExportData?: (format: 'csv' | 'excel' | 'pdf') => void;
  /** Custom handler for printing */
  onPrint?: () => void;

  // Selection props
  /** Array of currently selected items */
  selectedItems?: T[];
  /** Callback when selection changes */
  onSelectionChange?: (selectedItems: T[]) => void;
  /** Whether to show the selection column (default: true) */
  showSelectionColumn?: boolean;

  // Bulk edit props
  /** Array of columns that can be edited in bulk */
  editableColumns?: EditableColumn<T>[];
  /** Callback for bulk edit operations */
  onBulkEdit?: (selectedItems: T[], columnKey: string, newValue: any) => Promise<void>;

  // Row action props
  /** Callback when an item is edited */
  onEdit?: (item: T) => void;
  /** Callback when an item is deleted */
  onDelete?: (item: T) => void;
  /** Callback when a new item is added */
  onAddItem?: (newItem: T) => Promise<void>;

  /** Type of items in the table (for UI messages, default: "items") */
  itemType?: string;
}

/**
 * Props interface for the TableContextMenu component
 * @template T - The type of data items in the table
 */
export interface TableContextMenuProps<T> {
  /** Array of column configurations */
  columns: ITableColumn<T>[];
  /** Array of data items in the table */
  data: T[];
  /** Callback when a filter value changes */
  onFilterChange: (columnKey: string, value: any) => void;
  /** Currently active filters */
  activeFilters: Record<string, any>;
  /** Position of the context menu on screen, or null when hidden */
  position: { x: number; y: number } | null;
  /** Callback to close the context menu */
  onClose: () => void;
  /** Callback when sort changes for a column */
  onSortChange: (columnKey: string) => void;
  /** Currently sorted column key */
  currentSortKey?: string;
  /** Current sort direction */
  currentSortDirection: SortDirection;
  /** Callback to toggle column visibility */
  onToggleVisibility: (columnKey: string) => void;
  /** Callback to reset a specific column's filter */
  onResetColumnFilter: (columnKey: string) => void;
  /** Callback to reset all filters */
  onResetAllFilters: () => void;
  /** Number of currently selected items */
  selectedItemCount?: number;
  /** Callback to delete selected items */
  onDeleteSelected?: () => void;
  /** Callback to update selected items */
  onUpdateSelected?: () => void;
  /** Whether to show the update option in the menu */
  showUpdateOption?: boolean;
  /** Callback to select all items on the current page */
  onSelectAll?: () => void;
  /** Callback to select all items across all pages */
  onSelectAllPages?: () => void;
  /** Callback to clear the current selection */
  onClearSelection?: () => void;
  /** Total number of items in the dataset */
  totalItemCount?: number;
}
