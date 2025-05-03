import { ITableService, SortDirection, SortCriterion, ITableColumn } from './interfaces';

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

  public multiSortData(
    data: T[],
    sortCriteria: SortCriterion[],
    columns: ITableColumn<T>[]
  ): T[] {
    if (!sortCriteria.length) {
      return [...data];
    }

    return [...data].sort((a, b) => {
      for (const criterion of sortCriteria) {
        const { key, direction } = criterion;
        
        // Find the column to get custom sort function if available
        const column = columns.find(col => col.key === key);
        const sortFn = column?.sortFn;

        if (sortFn) {
          const result = sortFn(a, b, direction);
          if (result !== 0) return result;
        } else {
          const aValue = this.getNestedValue(a, key);
          const bValue = this.getNestedValue(b, key);

          // Handle null/undefined values
          if (aValue === null || aValue === undefined) {
            if (bValue === null || bValue === undefined) {
              continue; // Both null/undefined - move to next criterion
            }
            return direction === 'asc' ? -1 : 1;
          }
          if (bValue === null || bValue === undefined) {
            return direction === 'asc' ? 1 : -1;
          }

          // Compare values based on their types
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            const result = direction === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
            
            if (result !== 0) return result;
          } else {
            // Numeric comparison
            const numResult = direction === 'asc'
              ? (aValue as any) - (bValue as any)
              : (bValue as any) - (aValue as any);
            
            if (numResult !== 0) return numResult;
          }
        }
      }
      
      return 0; // All criteria were equal
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, key) => (o && o[key] !== undefined) ? o[key] : null, obj);
  }
}