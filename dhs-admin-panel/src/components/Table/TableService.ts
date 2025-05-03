import { ITableService, SortDirection } from './interfaces';

export class TableService<T> implements ITableService<T> {
  public getPaginatedData(data: T[], currentPage: number, itemsPerPage: number): T[] {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }

  public calculateTotalPages(totalItems: number, itemsPerPage: number): number {
    return Math.ceil(totalItems / itemsPerPage);
  }

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

      // Специальная обработка для null и undefined значений
      if (aValue === null || aValue === undefined) {
        if (bValue === null || bValue === undefined) {
          return 0; // Оба null/undefined - считаются равными
        }
        return sortDirection === 'asc' ? -1 : 1; // null в начале при asc
      }
      if (bValue === null || bValue === undefined) {
        return sortDirection === 'asc' ? 1 : -1; // null в конце при asc
      }

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

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, key) => (o && o[key] !== undefined) ? o[key] : null, obj);
  }
}