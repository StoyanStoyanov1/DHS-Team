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
  rowsPerPageOptions?: number[]; // Добавяме опция за конфигуриране на опциите за редове на страница
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
  pagination?: boolean; // Този prop запазваме за обратна съвместимост, но реално винаги показваме пагинацията
  itemsPerPage?: number;
  setItemsPerPage?: (itemsPerPage: number) => void; // Callback for changing items per page
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  rowsPerPageOptions?: number[]; // Опция за конфигуриране на опциите за редове на страница
  fixedTableSize?: boolean; // Указва дали таблицата да има фиксиран размер
  tableHeight?: number; // Определя височината на таблицата, когато е фиксирана
}

/**
 * Defines table service operations
 */
export interface ITableService<T> {
  getPaginatedData(data: T[], currentPage: number, itemsPerPage: number): T[];
  calculateTotalPages(totalItems: number, itemsPerPage: number): number;
}