import React from 'react';
import { ITableColumn } from './interfaces';

interface TableRowProps<T> {
  item: T;
  keyExtractor: (item: T) => string | number;
  visibleColumns: ITableColumn<T>[];
  rowClassName?: string | ((item: T) => string);
  showSelectionColumn?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onContextMenu?: (e: React.MouseEvent, item: T, column?: ITableColumn<T>) => void;
  rowIndex: number;
}

function TableRow<T>({
  item,
  keyExtractor,
  visibleColumns,
  rowClassName = '',
  showSelectionColumn = false,
  isSelected = false,
  onToggleSelect,
  onContextMenu,
  rowIndex,
}: TableRowProps<T>) {
  // Apply alternating row background colors
  const alternatingRowClass = rowIndex % 2 === 0 ? '' : 'bg-gray-50/70';
  
  // Calculate dynamic row class name
  const dynamicRowClass = typeof rowClassName === 'function' 
    ? rowClassName(item) 
    : rowClassName;

  // Determine if the row is selected
  const selectedRowClass = isSelected ? 'bg-indigo-50 border-l-4 border-indigo-500 shadow-sm' : '';

  return (
    <tr 
      className={`group h-14 transition-all duration-150 hover:bg-indigo-50/60 ${dynamicRowClass} ${alternatingRowClass} ${selectedRowClass} ${isSelected ? '' : 'border-l-4 border-transparent'}`}
      // Removed onClick handler to prevent row selection when clicking anywhere on the row
    >
      {showSelectionColumn && (
        <td className="w-12 px-4 py-3 whitespace-nowrap border-r border-gray-200">
          <div className="flex items-center justify-center">
            <div className="relative">
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 bg-white 
                checked:border-indigo-500 checked:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  if (onToggleSelect) onToggleSelect();
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <div className={`pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                <svg className="h-3 w-3 fill-white stroke-white" viewBox="0 0 16 16">
                  <path d="M4 8l3 3 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </td>
      )}

      {visibleColumns.map((column) => (
        <td 
          key={`${keyExtractor(item)}-${column.key}`}
          className={`px-6 py-4 whitespace-nowrap transition-colors ${column.className || ''} ${isSelected ? 'text-indigo-900' : 'text-gray-700'} group-hover:text-gray-900`}
          onContextMenu={(e) => {
            e.preventDefault();
            if (onContextMenu) {
              onContextMenu(e, item, column);
            }
          }}
        >
          {column.render ? column.render(item) : (item as any)[column.key]}
        </td>
      ))}
    </tr>
  );
}

export default TableRow;