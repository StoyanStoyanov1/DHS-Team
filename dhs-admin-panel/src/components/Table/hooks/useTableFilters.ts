import { useState, useMemo, useEffect } from 'react';
import { ITableColumn } from '../interfaces';

export type ColumnFilter = any;
export type SelectedFilters = Record<string, ColumnFilter>;

export interface UseTableFiltersProps<T> {
  data: T[];
  columns: ITableColumn<T>[];
}

export interface UseTableFiltersReturn<T> {
  columnFilters: SelectedFilters;
  filterOrder: string[];
  filteredData: T[];
  handleColumnFilterChange: (columnKey: string, value: any) => void;
  resetColumnFilters: () => void;
  activeColumnFilterCount: number;
  setFilterOrder: (order: string[]) => void;
}

export function useTableFilters<T>({
  data,
  columns,
}: UseTableFiltersProps<T>): UseTableFiltersReturn<T> {
  const [columnFilters, setColumnFilters] = useState<SelectedFilters>({});
  const [filterOrder, setFilterOrder] = useState<string[]>([]);

  const activeColumnFilterCount = useMemo(() => 
    Object.keys(columnFilters).length, 
    [columnFilters]
  );

  const filteredData = useMemo(() => {
    let result = [...data];

    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value === null || value === '') return;

      const column = columns.find(col => col.key === key);
      if (!column) return;

      switch (column.filterType) {
        case 'select':
          result = result.filter(item => (item as any)[key] === value);
          break;

        case 'boolean':
          if (value !== null) {
            const boolValue = value === true || value === 'true';
            result = result.filter(item => {
              const itemValue = Boolean((item as any)[key]);
              return itemValue === boolValue;
            });
          }
          break;

        case 'multiselect':
          if (Array.isArray(value) && value.length > 0) {
            result = result.filter(item => value.includes((item as any)[key]));
          }
          break;

        case 'daterange':
          if (value && (value.start || value.end)) {
            result = result.filter(item => {
              const itemDateValue = (item as any)[key];

              if (itemDateValue === null || itemDateValue === undefined) return true;

              let itemDate: Date;

              if (itemDateValue instanceof Date) {
                itemDate = itemDateValue;
              } else if (typeof itemDateValue === 'number') {
                itemDate = new Date(itemDateValue);
              } else if (typeof itemDateValue === 'string') {
                itemDate = new Date(itemDateValue);
              } else {
                return true;
              }

              if (isNaN(itemDate.getTime())) return true;

              if (value.start) {
                const startDate = new Date(value.start);
                if (startDate > itemDate) {
                  return false;
                }
              }

              if (value.end) {
                const endDate = new Date(value.end);
                endDate.setHours(23, 59, 59, 999);
                if (endDate < itemDate) {
                  return false;
                }
              }

              return true;
            });
          }
          break;

        case 'search':
          if (typeof value === 'object' && value !== null && value.term !== undefined) {
            const { term, field, method } = value;

            if (term === null) break;

            if (!term && !['isEmpty', 'isNotEmpty'].includes(method)) break;

            const searchTerm = String(term).toLowerCase();
            result = result.filter(item => {
              let itemValue;
              if (field && field !== key) {
                itemValue = String((item as any)[field] || '').toLowerCase();
              } else {
                itemValue = String((item as any)[key] || '').toLowerCase();
              }

              switch(method) {
                case 'contains':
                  return itemValue.includes(searchTerm);
                case 'equals':
                  return itemValue === searchTerm;
                case 'startsWith':
                  return itemValue.startsWith(searchTerm);
                case 'endsWith':
                  return itemValue.endsWith(searchTerm);
                case 'notContains':
                  return !itemValue.includes(searchTerm);
                case 'isEmpty':
                  return !itemValue || itemValue.trim() === '';
                case 'isNotEmpty':
                  return itemValue && itemValue.trim() !== '';
                case 'regex':
                  try {
                    return new RegExp(searchTerm).test(itemValue);
                  } catch (e) {
                    return false;
                  }
                default:
                  return itemValue.includes(searchTerm);
              }
            });
          } 
          else if (typeof value === 'string' && value.trim() !== '') {
            const searchTerm = value.toLowerCase();
            result = result.filter(item => {
              const itemValue = String((item as any)[key] || '').toLowerCase();
              return itemValue.includes(searchTerm);
            });
          }
          break;

        case 'range':
          if (value.min !== undefined && value.min !== null) {
            result = result.filter(item => (item as any)[key] >= value.min);
          }
          if (value.max !== undefined && value.max !== null) {
            result = result.filter(item => (item as any)[key] <= value.max);
          }
          break;
      }
    });

    return result;
  }, [data, columnFilters, columns]);

  const handleColumnFilterChange = (columnKey: string, value: any) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      if (value === null) {
        delete newFilters[columnKey];
        // Remove from filter order when filter is removed
        setFilterOrder(prevOrder => prevOrder.filter(key => key !== columnKey));
      } else {
        newFilters[columnKey] = value;
        // Add to filter order if not already present
        setFilterOrder(prevOrder => {
          if (!prevOrder.includes(columnKey)) {
            return [...prevOrder, columnKey];
          }
          return prevOrder;
        });
      }
      return newFilters;
    });
  };

  const resetColumnFilters = () => {
    setColumnFilters({});
    setFilterOrder([]);
  };

  return {
    columnFilters,
    filterOrder,
    filteredData,
    handleColumnFilterChange,
    resetColumnFilters,
    activeColumnFilterCount,
    setFilterOrder,
  };
}