import { useState, useCallback, useEffect } from 'react';

export interface UseTableSelectionProps<T> {
  data: T[];
  keyExtractor: (item: T) => string | number;
  onSelectionChange?: (selectedItems: T[]) => void;
  initialSelectedItems?: T[];
}

export interface UseTableSelectionReturn<T> {
  selectedItems: T[];
  selectedItemIds: Set<string | number>;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  toggleSelectAll: () => void;
  toggleSelectItem: (item: T) => void;
  isItemSelected: (item: T) => boolean;
  clearSelection: () => void;
  selectItems: (items: T[]) => void;
}

export function useTableSelection<T>({
  data,
  keyExtractor,
  onSelectionChange,
  initialSelectedItems = [],
}: UseTableSelectionProps<T>): UseTableSelectionReturn<T> {
  const [selectedItems, setSelectedItems] = useState<T[]>(initialSelectedItems);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string | number>>(
    new Set(initialSelectedItems.map(item => keyExtractor(item)))
  );

  const isAllSelected = data.length > 0 && selectedItemIds.size === data.length;
  const isPartiallySelected = selectedItemIds.size > 0 && !isAllSelected;

  // Update selection when data changes (to remove selected items that are no longer in the data)
  useEffect(() => {
    if (selectedItems.length > 0) {
      const currentIds = new Set(data.map(item => keyExtractor(item)));
      const newSelectedItems = selectedItems.filter(item => 
        currentIds.has(keyExtractor(item))
      );
      
      if (newSelectedItems.length !== selectedItems.length) {
        setSelectedItems(newSelectedItems);
        setSelectedItemIds(new Set(newSelectedItems.map(item => keyExtractor(item))));
      }
    }
  }, [data, keyExtractor, selectedItems]);

  // Notify parent when selection changes
  useEffect(() => {
    onSelectionChange?.(selectedItems);
  }, [selectedItems, onSelectionChange]);

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedItems([]);
      setSelectedItemIds(new Set());
    } else {
      setSelectedItems([...data]);
      setSelectedItemIds(new Set(data.map(item => keyExtractor(item))));
    }
  }, [data, isAllSelected, keyExtractor]);

  const toggleSelectItem = useCallback((item: T) => {
    const id = keyExtractor(item);
    setSelectedItems(prev => {
      if (selectedItemIds.has(id)) {
        const newItems = prev.filter(i => keyExtractor(i) !== id);
        setSelectedItemIds(new Set(newItems.map(item => keyExtractor(item))));
        return newItems;
      } else {
        const newItems = [...prev, item];
        setSelectedItemIds(new Set(newItems.map(item => keyExtractor(item))));
        return newItems;
      }
    });
  }, [keyExtractor, selectedItemIds]);

  const isItemSelected = useCallback((item: T) => {
    return selectedItemIds.has(keyExtractor(item));
  }, [keyExtractor, selectedItemIds]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
    setSelectedItemIds(new Set());
  }, []);

  const selectItems = useCallback((items: T[]) => {
    setSelectedItems(items);
    setSelectedItemIds(new Set(items.map(item => keyExtractor(item))));
  }, [keyExtractor]);

  return {
    selectedItems,
    selectedItemIds,
    isAllSelected,
    isPartiallySelected,
    toggleSelectAll,
    toggleSelectItem,
    isItemSelected,
    clearSelection,
    selectItems,
  };
}