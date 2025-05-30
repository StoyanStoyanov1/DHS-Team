import { ReactNode } from 'react';
import { FilterGroup, SelectedFilters } from './Filter';
import { EditableColumn } from './BulkEditBar';

export type SortDirection = 'asc' | 'desc' | null;
export type SearchMethod = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'notContains' | 'isEmpty' | 'isNotEmpty' | 'regex';

export interface SortCriterion {
  key: string;
  direction: 'asc' | 'desc';
}

export interface SearchField {
  key: string;
  label: string;
  path?: string;
}

export interface ITableColumn<T> {
  header: string;
  key: string;
  render?: (item: T) => ReactNode;
  className?: string;
  sortable?: boolean;
  sortFn?: (a: T, b: T, direction: SortDirection) => number;

  filterGroups?: FilterGroup[];
  initialFilterValues?: SelectedFilters;
  onFilterChange?: (selectedFilters: SelectedFilters) => void;
  showFilter?: boolean;
  filterTitle?: string;

  filterable?: boolean;
  filterType?: 'select' | 'multiselect' | 'search' | 'range' | 'checkbox' | 'custom' | 'boolean' | 'daterange';
  filterOptions?: { id: string | number; label: string; value: any }[];
  filterRange?: { min: number; max: number };
  getFilterOptions?: (data: T[]) => { id: string | number; label: string; value: any }[];
  customFilterComponent?: (onFilterChange: (key: string, value: any) => void, currentValue: any) => ReactNode;

  labelTrue?: string;
  labelFalse?: string;
  labelAll?: string;

  defaultSelectAll?: boolean;

  hideable?: boolean;
  hidden?: boolean;

  searchFields?: SearchField[];
  fieldDataType?: 'text' | 'number' | 'date' | 'boolean' | 'array' | 'enum' | 'role';
  recentSearches?: string[];
}

export interface ITableService<T> {
  getPaginatedData(data: T[], currentPage: number, itemsPerPage: number): T[];
  calculateTotalPages(totalItems: number, itemsPerPage: number): number;
  sortData(data: T[], sortKey: string, sortDirection: SortDirection, sortFn?: (a: T, b: T, direction: SortDirection) => number): T[];
  multiSortData(data: T[], sortCriteria: SortCriterion[], columns: ITableColumn<T>[]): T[];
}

export interface ITablePagination {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  rowsPerPageOptions?: number[];
  showPageSizeControl?: boolean; // Control visibility of the page size dropdown
}

export interface ITableProps<T> {
  columns: ITableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string | ((item: T) => string);
  pagination?: boolean;
  itemsPerPage?: number;
  setItemsPerPage?: (size: number) => void;
  rowsPerPageOptions?: number[];
  showTableSizeControls?: boolean;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  fixedTableSize?: boolean;
  defaultSortKey?: string;
  defaultSortDirection?: 'asc' | 'desc' | null;
  defaultSortCriteria?: {key: string, direction: 'asc' | 'desc'}[];
  multiSort?: boolean;
  autoResizeColumns?: boolean;
  minColumnWidth?: number;
  maxColumnWidth?: number;
  columnPadding?: number;
  tableId?: string;

  // Table appearance settings
  density?: 'compact' | 'normal' | 'relaxed';
  theme?: 'light' | 'dark' | 'site';
  showGridLines?: boolean;
  stripedRows?: boolean;
  highlightOnHover?: boolean;
  stickyHeader?: boolean;

  // Export options
  onExportData?: (format: 'csv' | 'excel' | 'pdf') => void;
  onPrint?: () => void;

  // Selection props
  selectedItems?: T[];
  onSelectionChange?: (selectedItems: T[]) => void;
  showSelectionColumn?: boolean;

  // Bulk edit props
  editableColumns?: EditableColumn<T>[];
  onBulkEdit?: (selectedItems: T[], columnKey: string, newValue: any) => Promise<void>;

  // Row action props
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onAddItem?: (newItem: T) => Promise<void>;

  // Item type for delete confirmation dialog
  itemType?: string;
}

export interface TableContextMenuProps<T> {
  columns: ITableColumn<T>[];
  data: T[];
  onFilterChange: (columnKey: string, value: any) => void;
  activeFilters: Record<string, any>;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onSortChange: (columnKey: string) => void;
  currentSortKey?: string;
  currentSortDirection: SortDirection;
  onToggleVisibility: (columnKey: string) => void;
  onResetColumnFilter: (columnKey: string) => void;
  onResetAllFilters: () => void;
}
