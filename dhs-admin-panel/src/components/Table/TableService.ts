/**
 * Service class for table operations
 */

import { ITableService } from './interfaces';

/**
 * Implements the ITableService interface with table functionality
 */
export class TableService<T> implements ITableService<T> {
  /**
   * Gets a subset of data based on pagination parameters
   * @param data The complete dataset
   * @param currentPage The current page number (1-based)
   * @param itemsPerPage Number of items per page
   * @returns Paginated data subset
   */
  public getPaginatedData(data: T[], currentPage: number, itemsPerPage: number): T[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }

  /**
   * Calculates the total number of pages based on item count and page size
   * @param totalItems Total number of items in the dataset
   * @param itemsPerPage Number of items per page
   * @returns Total number of pages
   */
  public calculateTotalPages(totalItems: number, itemsPerPage: number): number {
    return Math.ceil(totalItems / itemsPerPage);
  }
}