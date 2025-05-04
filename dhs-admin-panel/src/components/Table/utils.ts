import { ITableColumn, SortCriterion } from './interfaces';
import * as LucideIcons from 'lucide-react';

// Type for selected filters
export type SelectedFilters = Record<string, any>;

// Function to check if a column is sortable
export const isSortableColumn = <T>(column: ITableColumn<T>): boolean => column.sortable !== false;

// Helper function to format filter display value for UI
export const formatFilterDisplayValue = (value: any): string => {
  if (value === null || value === undefined) {
    return 'Без филтър';
  }

  if (typeof value === 'boolean') {
    return value ? 'Да' : 'Не';
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? `${value.length} избрани` : 'Празен масив';
  }

  if (typeof value === 'object') {
    if (value.term !== undefined) {
      // This is a search filter
      const term = value.term || '';
      const method = value.method || 'contains';
      const methodDisplayMap: Record<string, string> = {
        contains: 'съдържа',
        equals: 'равно на',
        startsWith: 'започва с',
        endsWith: 'завършва с',
        notContains: 'не съдържа',
        isEmpty: 'е празно',
        isNotEmpty: 'не е празно',
        regex: 'regex'
      };
      
      return `${methodDisplayMap[method] || method} "${term}"`;
    }

    if (value.start || value.end) {
      // This is a daterange filter
      const start = value.start ? new Date(value.start).toLocaleDateString() : '';
      const end = value.end ? new Date(value.end).toLocaleDateString() : '';
      
      if (start && end) {
        return `${start} - ${end}`;
      } else if (start) {
        return `от ${start}`;
      } else if (end) {
        return `до ${end}`;
      }
    }

    if (value.min !== undefined || value.max !== undefined) {
      // This is a range filter
      const min = value.min !== undefined ? value.min : '';
      const max = value.max !== undefined ? value.max : '';
      
      if (min !== '' && max !== '') {
        return `${min} - ${max}`;
      } else if (min !== '') {
        return `>= ${min}`;
      } else if (max !== '') {
        return `<= ${max}`;
      }
    }

    return JSON.stringify(value);
  }

  return String(value);
};

// Format a date in a user-friendly format
export const formatDate = (date: Date | string | number): string => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid date';
  
  return dateObj.toLocaleDateString();
};

// Helper function to dynamically resize columns
export const autoResizeTableColumns = (
  tableId: string, 
  minWidth = 100, 
  maxWidth = 500,
  padding = 16
): void => {
  const table = document.getElementById(tableId);
  if (!table) return;
  
  const headers = table.querySelectorAll('th');
  const columnCount = headers.length;
  
  // Skip if no columns
  if (columnCount === 0) return;
  
  // Try to get the table container's width
  const tableContainer = table.closest('.overflow-x-auto');
  if (!tableContainer) return;
  
  const containerWidth = tableContainer.clientWidth;
  const avgColumnWidth = Math.max(minWidth, Math.min(maxWidth, containerWidth / columnCount - padding));
  
  // Apply the width to each column based on content
  headers.forEach((header, index) => {
    const contentWidth = header.scrollWidth + padding;
    const width = Math.max(minWidth, Math.min(maxWidth, contentWidth, avgColumnWidth));
    
    header.style.width = `${width}px`;
    header.style.minWidth = `${width}px`;
  });
};

// Add CSS styles for table animations and transitions
export const addTableStyles = (): void => {
  if (document.getElementById('table-custom-styles')) return;
  
  const styleElement = document.createElement('style');
  styleElement.id = 'table-custom-styles';
  styleElement.innerHTML = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideIn {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.2); }
      70% { box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
      100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
    }

    .sort-active {
      animation: pulse 1s ease-in-out 1;
    }
    
    .sort-criteria-item.dragging {
      opacity: 0.5;
      background-color: #e5e7eb;
    }
    
    .sort-criteria-item.drop-target {
      border: 1px dashed #6366f1;
      background-color: #eef2ff;
    }
    
    .sort-drop-target {
      background-color: #eef2ff;
      position: relative;
    }
    
    .sort-drop-target::after {
      content: '';
      position: absolute;
      inset: 0;
      border: 2px dashed #6366f1;
      pointer-events: none;
      z-index: 10;
    }
    
    .table-column-header {
      transition: background-color 0.2s ease;
    }
    
    .table-column-header:hover {
      background-color: #f3f4f6;
    }
    
    /* Custom checkbox styles */
    input[type="checkbox"] {
      position: relative;
      cursor: pointer;
    }
    
    input[type="checkbox"]:checked::before {
      content: '';
      position: absolute;
      inset: 0;
      background-color: #6366f1;
      border-radius: 0.25rem;
    }
    
    input[type="checkbox"]:checked::after {
      content: '';
      position: absolute;
      left: 5px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    /* Added hover effect for table rows */
    .group:hover {
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }

    /* Selected row style */
    tr.selected-row {
      animation: fadeIn 0.3s ease-out;
    }

    /* Bulk edit bar animation */
    .bulk-edit-bar-show {
      animation: slideIn 0.3s ease-out forwards;
    }

    /* Alternate row colors */
    .zebra-stripe {
      background-color: rgba(249, 250, 251, 0.8);
    }

    /* Fixed height for table rows */
    tr.fixed-height {
      height: 3.5rem;
    }
    
    /* Improve table border appearance */
    table.enhanced-borders {
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
    }

    table.enhanced-borders th:first-child {
      border-top-left-radius: 0.5rem;
    }
    
    table.enhanced-borders th:last-child {
      border-top-right-radius: 0.5rem;
    }

    /* Improve empty state styling */
    .empty-state {
      padding: 2rem;
      text-align: center;
      color: #6b7280;
      background-color: #f9fafb;
      border-radius: 0.5rem;
      margin: 1rem 0;
    }
  `;
  
  document.head.appendChild(styleElement);
};

// Filter data based on select criteria
export const filterData = <T>(data: T[], filterCriteria: Record<string, any>): T[] => {
  return data.filter(item => {
    for (const [key, value] of Object.entries(filterCriteria)) {
      if (value === undefined || value === null || value === '') continue;
      
      const itemValue = (item as any)[key];
      
      if (Array.isArray(value)) {
        // Multi-select filter
        if (value.length > 0 && !value.includes(itemValue)) {
          return false;
        }
      } else if (typeof value === 'object') {
        // Range filter
        if (value.min !== undefined && itemValue < value.min) {
          return false;
        }
        if (value.max !== undefined && itemValue > value.max) {
          return false;
        }
        
        // Date range filter
        if (value.start || value.end) {
          const itemDate = new Date(itemValue);
          if (value.start && new Date(value.start) > itemDate) {
            return false;
          }
          if (value.end) {
            const endDate = new Date(value.end);
            endDate.setHours(23, 59, 59, 999);
            if (endDate < itemDate) {
              return false;
            }
          }
        }
        
        // Text search filter
        if (value.term) {
          const searchTerm = String(value.term).toLowerCase();
          const searchValue = String(itemValue || '').toLowerCase();
          
          switch (value.method) {
            case 'contains':
              if (!searchValue.includes(searchTerm)) return false;
              break;
            case 'equals':
              if (searchValue !== searchTerm) return false;
              break;
            case 'startsWith':
              if (!searchValue.startsWith(searchTerm)) return false;
              break;
            case 'endsWith':
              if (!searchValue.endsWith(searchTerm)) return false;
              break;
            case 'notContains':
              if (searchValue.includes(searchTerm)) return false;
              break;
            case 'isEmpty':
              if (searchValue !== '') return false;
              break;
            case 'isNotEmpty':
              if (searchValue === '') return false;
              break;
            default:
              if (!searchValue.includes(searchTerm)) return false;
          }
        }
      } else if (typeof value === 'boolean') {
        // Boolean filter
        if (itemValue !== value) {
          return false;
        }
      } else {
        // Regular equality filter
        if (itemValue !== value) {
          return false;
        }
      }
    }
    
    return true;
  });
};

// Sort data based on a key and direction
export const sortData = <T>(
  data: T[], 
  key: string, 
  direction: 'asc' | 'desc' | null,
  customSortFn?: (a: T, b: T, direction: 'asc' | 'desc' | null) => number
): T[] => {
  if (!key || direction === null) return data;
  
  return [...data].sort((a, b) => {
    if (customSortFn) {
      return customSortFn(a, b, direction);
    }
    
    const aValue = (a as any)[key];
    const bValue = (b as any)[key];
    
    if (aValue === bValue) return 0;
    
    // Handle undefined and null values
    if (aValue === undefined || aValue === null) return direction === 'asc' ? -1 : 1;
    if (bValue === undefined || bValue === null) return direction === 'asc' ? 1 : -1;
    
    // Handle different value types
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return direction === 'asc' 
        ? aValue.getTime() - bValue.getTime() 
        : bValue.getTime() - aValue.getTime();
    }
    
    // Default comparison
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    } else {
      return direction === 'asc' ? -1 : 1;
    }
  });
};

// Sort data based on multiple criteria
export const multiSortData = <T>(
  data: T[],
  criteria: SortCriterion[],
  columns: ITableColumn<T>[]
): T[] => {
  if (criteria.length === 0) return data;
  
  return [...data].sort((a, b) => {
    for (const { key, direction } of criteria) {
      const column = columns.find(col => col.key === key);
      let result = 0;
      
      if (column?.sortFn) {
        result = column.sortFn(a, b, direction);
      } else {
        const aValue = (a as any)[key];
        const bValue = (b as any)[key];
        
        // Handle undefined and null values
        if (aValue === bValue) {
          result = 0;
        } else if (aValue === undefined || aValue === null) {
          result = direction === 'asc' ? -1 : 1;
        } else if (bValue === undefined || bValue === null) {
          result = direction === 'asc' ? 1 : -1;
        }
        // Handle different value types
        else if (typeof aValue === 'string' && typeof bValue === 'string') {
          result = direction === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          result = direction === 'asc' ? aValue - bValue : bValue - aValue;
        } else if (aValue instanceof Date && bValue instanceof Date) {
          result = direction === 'asc' 
            ? aValue.getTime() - bValue.getTime() 
            : bValue.getTime() - aValue.getTime();
        }
        // Default comparison
        else if (aValue > bValue) {
          result = direction === 'asc' ? 1 : -1;
        } else {
          result = direction === 'asc' ? -1 : 1;
        }
      }
      
      if (result !== 0) return result;
    }
    
    return 0;
  });
};

// Calculate pagination information
export const getPaginationInfo = (
  currentPage: number,
  itemsPerPage: number,
  totalItems: number
) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const adjustedCurrentPage = Math.max(1, Math.min(currentPage, totalPages));
  
  const startItem = (adjustedCurrentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);
  
  return {
    totalPages,
    currentPage: adjustedCurrentPage,
    startItem,
    endItem,
    isFirstPage: adjustedCurrentPage === 1,
    isLastPage: adjustedCurrentPage === totalPages,
  };
};

// Get paginated subset of data
export const getPaginatedData = <T>(
  data: T[],
  currentPage: number,
  itemsPerPage: number
): T[] => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return data.slice(startIndex, startIndex + itemsPerPage);
};

// Generate a unique ID for elements
export const generateUniqueId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
};