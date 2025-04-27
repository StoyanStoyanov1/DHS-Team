import { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface ITableColumn<T> {
  header: string;
  key: string;
  render?: (item: T) => ReactNode;
  className?: string;
  sortable?: boolean;
  sortFn?: (a: T, b: T, direction: SortDirection) => number;
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
}

/**
 * Defines table service operations
 */
export interface ITableService<T> {
  getPaginatedData(data: T[], currentPage: number, itemsPerPage: number): T[];
  calculateTotalPages(totalItems: number, itemsPerPage: number): number;
  sortData(data: T[], sortKey: string, sortDirection: SortDirection, sortFn?: (a: T, b: T, direction: SortDirection) => number): T[];
}