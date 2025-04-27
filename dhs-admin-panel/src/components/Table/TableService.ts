/**
 * Service class for table operations
 */

import { ITableService, SortDirection } from './interfaces';

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

  /**
   * Sorts data based on provided sort key and direction
   * @param data The data to sort
   * @param sortKey The key to sort by
   * @param sortDirection The direction to sort ('asc', 'desc', or null for no sorting)
   * @param sortFn Optional custom sort function
   * @returns Sorted data array
   */
  public sortData(
    data: T[], 
    sortKey: string, 
    sortDirection: SortDirection,
    sortFn?: (a: T, b: T, direction: SortDirection) => number
  ): T[] {
    if (!sortKey || sortDirection === null) {
      return [...data];
    }

    return [...data].sort((a, b) => {
      if (sortFn) {
        return sortFn(a, b, sortDirection);
      }

      const aValue = this.getNestedValue(a, sortKey);
      const bValue = this.getNestedValue(b, sortKey);

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }

      if (sortDirection === 'asc') {
        return (aValue as any) - (bValue as any);
      } else {
        return (bValue as any) - (aValue as any);
      }
    });
  }

  /**
   * Helper method to get nested property values using dot notation
   * @param obj The object to get the value from
   * @param path The property path (e.g. 'user.address.city')
   * @returns The value at the specified path
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, key) => (o && o[key] !== undefined) ? o[key] : null, obj);
  }
}