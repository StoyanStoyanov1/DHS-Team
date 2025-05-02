import { ReactNode } from 'react';
import { FilterGroup, SelectedFilters } from '../Filter/interfaces';

export type SortDirection = 'asc' | 'desc' | null;
export type SearchMethod = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'notContains' | 'isEmpty' | 'isNotEmpty' | 'regex';

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
  
  // Filter related props
  filterGroups?: FilterGroup[];
  initialFilterValues?: SelectedFilters;
  onFilterChange?: (selectedFilters: SelectedFilters) => void;
  showFilter?: boolean;
  filterTitle?: string;
  
  // Column filtering options
  filterable?: boolean;
  filterType?: 'select' | 'multiselect' | 'search' | 'range' | 'checkbox' | 'custom' | 'boolean' | 'daterange';
  filterOptions?: { id: string | number; label: string; value: any }[];
  filterRange?: { min: number; max: number };
  getFilterOptions?: (data: T[]) => { id: string | number; label: string; value: any }[];
  customFilterComponent?: (onFilterChange: (key: string, value: any) => void, currentValue: any) => ReactNode;
  
  // Boolean filter specific props
  labelTrue?: string;
  labelFalse?: string;
  labelAll?: string;
  
  // Multiselect filter specific props
  defaultSelectAll?: boolean;
  
  // Column visibility
  hideable?: boolean;
  hidden?: boolean;

  // Enhanced search options
  searchFields?: SearchField[];
  fieldDataType?: 'text' | 'number' | 'date' | 'boolean' | 'array';
  recentSearches?: string[];
}

/**
 * Defines table service operations
 */
export interface ITableService<T> {
  getPaginatedData(data: T[], currentPage: number, itemsPerPage: number): T[];
  calculateTotalPages(totalItems: number, itemsPerPage: number): number;
  sortData(data: T[], sortKey: string, sortDirection: SortDirection, sortFn?: (a: T, b: T, direction: SortDirection) => number): T[];
}

/**
 * Defines the core functionality for a table pagination controller
 */
export interface ITablePagination {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  rowsPerPageOptions?: number[];
}

/**
 * Defines the props required by the Table component
 */
export interface ITableProps<T> {
  columns: ITableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string | ((item: T) => string);
  pagination?: boolean;
  itemsPerPage?: number;
  setItemsPerPage?: (itemsPerPage: number) => void;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  rowsPerPageOptions?: number[];
  fixedTableSize?: boolean;
  tableHeight?: number;
  showTableSizeControls?: boolean;
  defaultSortKey?: string;
  defaultSortDirection?: SortDirection;
  
  // Filter related props
  filterGroups?: FilterGroup[];
  initialFilterValues?: SelectedFilters;
  onFilterChange?: (selectedFilters: SelectedFilters) => void;
  showFilter?: boolean;
  filterTitle?: string;
}