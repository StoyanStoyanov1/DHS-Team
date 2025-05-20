import { useState, useCallback, useEffect } from 'react';

export interface UseTableSelectionProps<T> {
  data: T[];
  keyExtractor: (item: T) => string | number;
  onSelectionChange?: (selectedItems: T[]) => void;
  initialSelectedItems?: T[];
  currentPage?: number;
  itemsPerPage?: number;
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
  selectCurrentPageItems: () => void;
}

export function useTableSelection<T>({
  data,
  keyExtractor,
  onSelectionChange,
  initialSelectedItems = [],
  currentPage = 1,
  itemsPerPage = 10,
}: UseTableSelectionProps<T>): UseTableSelectionReturn<T> {
  const [selectedItems, setSelectedItems] = useState<T[]>(initialSelectedItems);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string | number>>(
    new Set(initialSelectedItems.map(item => keyExtractor(item)))
  );

  // Calculate current page items for page-specific selection
  const getCurrentPageItems = useCallback(() => {
    if (!currentPage || !itemsPerPage) return data;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // Get current page items
  const currentPageItems = getCurrentPageItems();

  // Check if all items on current page are selected
  const isAllSelected = currentPageItems.length > 0 && 
    currentPageItems.every(item => selectedItemIds.has(keyExtractor(item)));

  // Check if some but not all items on current page are selected
  const isPartiallySelected = !isAllSelected && 
    currentPageItems.some(item => selectedItemIds.has(keyExtractor(item)));

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

  // Toggle selection for all items on the current page only
  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      // If all items on current page are selected, unselect them
      const currentPageIds = new Set(currentPageItems.map(item => keyExtractor(item)));
      const newSelectedItems = selectedItems.filter(item => !currentPageIds.has(keyExtractor(item)));
      
      setSelectedItems(newSelectedItems);
      setSelectedItemIds(new Set(newSelectedItems.map(item => keyExtractor(item))));
    } else {
      // Otherwise, select all items on current page
      const currentPageItemIds = currentPageItems.map(item => keyExtractor(item));
      const newSelectedItemIds = new Set(selectedItemIds);
      // Добавяме новите ID-та към съществуващия Set
      currentPageItemIds.forEach(id => newSelectedItemIds.add(id));
      
      // Find the actual items from data that correspond to the selected IDs
      const allSelectedItems = [
        ...selectedItems,
        ...currentPageItems.filter(item => !selectedItemIds.has(keyExtractor(item)))
      ];
      
      setSelectedItems(allSelectedItems);
      setSelectedItemIds(newSelectedItemIds);
    }
  }, [currentPageItems, isAllSelected, keyExtractor, selectedItems, selectedItemIds]);

  // Select all items on the current page
  const selectCurrentPageItems = useCallback(() => {
    if (currentPageItems.length === 0) return;
    
    const currentPageItemIds = currentPageItems.map(item => keyExtractor(item));
    const newSelectedItemIds = new Set(selectedItemIds);
    // Добавяме новите ID-та към съществуващия Set
    currentPageItemIds.forEach(id => newSelectedItemIds.add(id));
    
    // Find the actual items from data that correspond to the selected IDs
    const allSelectedItems = [
      ...selectedItems,
      ...currentPageItems.filter(item => !selectedItemIds.has(keyExtractor(item)))
    ];
    
    setSelectedItems(allSelectedItems);
    setSelectedItemIds(newSelectedItemIds);
  }, [currentPageItems, keyExtractor, selectedItems, selectedItemIds]);

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
    selectCurrentPageItems,
  };
}