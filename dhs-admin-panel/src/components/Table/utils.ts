import { ITableColumn, SortCriterion } from './interfaces';
import * as LucideIcons from 'lucide-react';

// Type for selected filters
export type SelectedFilters = Record<string, any>;

// Function to check if a column is sortable
export const isSortableColumn = <T>(column: ITableColumn<T>): boolean => column.sortable !== false;

// Helper function to format filter display value for UI
export const formatFilterDisplayValue = (value: any): string => {
  if (value === null || value === undefined) {
    return 'No filter';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? `${value.length} selected` : 'Empty array';
  }

  if (typeof value === 'object') {
    if (value.term !== undefined) {
      // This is a search filter
      const term = value.term || '';
      const method = value.method || 'contains';
      const methodDisplayMap: Record<string, string> = {
        contains: 'contains',
        equals: 'equals',
        startsWith: 'starts with',
        endsWith: 'ends with',
        notContains: 'does not contain',
        isEmpty: 'is empty',
        isNotEmpty: 'is not empty',
        regex: 'regex'
      };
      
      return `${methodDisplayMap[method] || method} "${term}"`;
    }

    if (value.start || value.end) {
      // This is a date range filter
      const start = value.start ? new Date(value.start).toLocaleDateString() : '';
      const end = value.end ? new Date(value.end).toLocaleDateString() : '';
      
      if (start && end) {
        return `${start} - ${end}`;
      } else if (start) {
        return `from ${start}`;
      } else if (end) {
        return `until ${end}`;
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
  
  if (columnCount === 0) return;
  
  const tableContainer = table.closest('.overflow-x-auto');
  if (!tableContainer) return;
  
  const containerWidth = tableContainer.clientWidth;
  const avgColumnWidth = Math.max(minWidth, Math.min(maxWidth, containerWidth / columnCount - padding));
  
  headers.forEach((header) => {
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

    .group:hover {
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }

    tr.selected-row {
      animation: fadeIn 0.3s ease-out;
    }

    .bulk-edit-bar-show {
      animation: slideIn 0.3s ease-out forwards;
    }

    .zebra-stripe {
      background-color: rgba(249, 250, 251, 0.8);
    }

    tr.fixed-height {
      height: 3.5rem;
    }

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

// Remaining utility functions (filterData, sortData, multiSortData, getPaginationInfo, getPaginatedData, generateUniqueId) don't contain Bulgarian and don't need translation.

