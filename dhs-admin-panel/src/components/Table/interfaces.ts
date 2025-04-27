/**
 * Interfaces related to the Table component
 */

import { ReactNode } from 'react';

/**
 * Defines the structure of a table column
 */
export interface ITableColumn<T> {
  header: string;
  key: string;
  render?: (item: T) => ReactNode;
  className?: string;
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
  onItemsPerPageChange?: (itemsPerPage: number) => void; // Callback for changing items per page
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
  setItemsPerPage?: (itemsPerPage: number) => void; // Callback for changing items per page
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  fixedRowsCount?: number; // Add fixed rows count property
}

/**
 * Defines table service operations
 */
export interface ITableService<T> {
  getPaginatedData(data: T[], currentPage: number, itemsPerPage: number): T[];
  calculateTotalPages(totalItems: number, itemsPerPage: number): number;
}