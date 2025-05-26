import { useState, useMemo } from 'react';
import { ITableColumn, SortDirection, SortCriterion } from '../interfaces';
import { TableService } from '../TableService';

export interface UseTableSortProps<T> {
  data: T[];
  columns: ITableColumn<T>[];
  defaultSortKey?: string;
  defaultSortDirection?: SortDirection;
  defaultSortCriteria?: SortCriterion[];
  multiSort?: boolean;
}

export interface UseTableSortReturn<T> {
  sortedData: T[];
  sortKey: string | undefined;
  sortDirection: SortDirection;
  sortCriteria: SortCriterion[];
  setSortCriteria: React.Dispatch<React.SetStateAction<SortCriterion[]>>;
  setSortKey: (key: string | undefined) => void;
  setSortDirection: (direction: SortDirection) => void;
  handleSort: (columnKey: string) => void;
  handleRemoveSortCriterion: (index: number) => void;
  handleClearAllSorting: () => void;
  showSortCriteriaSummary: boolean;
  setShowSortCriteriaSummary: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useTableSort<T>({
  data,
  columns,
  defaultSortKey,
  defaultSortDirection,
  defaultSortCriteria = [],
  multiSort = false,
}: UseTableSortProps<T>): UseTableSortReturn<T> {
  const tableService = useMemo(() => new TableService<T>(), []);

  // Legacy single sort state - maintain for backward compatibility
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection || null);

  // New multi-sort state
  const [sortCriteria, setSortCriteria] = useState<SortCriterion[]>(
    defaultSortCriteria || (defaultSortKey && defaultSortDirection ? 
      [{ key: defaultSortKey, direction: defaultSortDirection as 'asc'|'desc' }] : 
      [])
  );

  const [showSortCriteriaSummary, setShowSortCriteriaSummary] = useState(false);

  const sortedData = useMemo(() => {
    if (multiSort && sortCriteria.length > 0) {
      return tableService.multiSortData(data, sortCriteria, columns);
    } else if (sortKey && sortDirection) {
      const column = columns.find(col => col.key === sortKey);
      return tableService.sortData(data, sortKey, sortDirection, column?.sortFn);
    }
    return data;
  }, [tableService, data, sortKey, sortDirection, sortCriteria, columns, multiSort]);

  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column || !column.sortable) return;

    if (multiSort) {
      setSortCriteria(prevCriteria => {
        // Check if this column is already in the criteria
        const existingIndex = prevCriteria.findIndex(c => c.key === columnKey);

        if (existingIndex >= 0) {
          // Column already exists in criteria, toggle its direction or remove it
          const existing = prevCriteria[existingIndex];
          const newCriteria = [...prevCriteria];

          if (existing.direction === 'asc') {
            // Change to descending
            newCriteria[existingIndex] = { ...existing, direction: 'desc' };
          } else {
            // Remove this criterion
            newCriteria.splice(existingIndex, 1);
          }

          return newCriteria;
        } else {
          // Add new sorting criterion
          return [...prevCriteria, { key: columnKey, direction: 'asc' }];
        }
      });

      // Also update legacy state for backward compatibility
      const existingIndex = sortCriteria.findIndex(c => c.key === columnKey);
      if (existingIndex >= 0) {
        const existing = sortCriteria[existingIndex];
        if (existing.direction === 'asc') {
          setSortKey(columnKey);
          setSortDirection('desc');
        } else {
          setSortKey(undefined);
          setSortDirection(null);
        }
      } else {
        setSortKey(columnKey);
        setSortDirection('asc');
      }
    } else {
      // Original single-sort behavior
      setSortKey(columnKey);
      if (sortKey === columnKey) {
        if (sortDirection === null) setSortDirection('asc');
        else if (sortDirection === 'asc') setSortDirection('desc');
        else setSortDirection(null);
      } else {
        setSortDirection('asc');
      }

      // Keep sortCriteria in sync with legacy sort state
      if (sortDirection === 'asc' || sortDirection === 'desc') {
        setSortCriteria([{ key: columnKey, direction: sortDirection }]);
      } else {
        setSortCriteria([]);
      }
    }
  };

  const handleRemoveSortCriterion = (index: number) => {
    setSortCriteria(prevCriteria => {
      const newCriteria = [...prevCriteria];
      newCriteria.splice(index, 1);

      // Update legacy sort state to match
      if (newCriteria.length > 0) {
        setSortKey(newCriteria[0].key);
        setSortDirection(newCriteria[0].direction);
      } else {
        setSortKey(undefined);
        setSortDirection(null);
      }

      return newCriteria;
    });
  };

  const handleClearAllSorting = () => {
    setSortCriteria([]);
    setSortKey(undefined);
    setSortDirection(null);
  };

  return {
    sortedData,
    sortKey,
    sortDirection,
    sortCriteria,
    setSortCriteria,
    setSortKey,
    setSortDirection,
    handleSort,
    handleRemoveSortCriterion,
    handleClearAllSorting,
    showSortCriteriaSummary,
    setShowSortCriteriaSummary,
  };
}
