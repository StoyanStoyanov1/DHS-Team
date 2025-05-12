import React from 'react';
import { ITableColumn } from './interfaces';
import TableRow from './TableRow';

interface TableBodyProps<T> {
  data: T[];
  emptyRows: number;
  visibleColumns: ITableColumn<T>[];
  keyExtractor: (item: T) => string | number;
  rowClassName?: string | ((item: T) => string);
  emptyMessage?: string;
  showSelectionColumn?: boolean;
  selectedItemIds?: Set<string | number>;
  onToggleSelectItem?: (item: T) => void;
  onContextMenu?: (e: React.MouseEvent, item: T, column?: ITableColumn<T>) => void;
}

function TableBody<T>({
  data,
  emptyRows,
  visibleColumns,
  keyExtractor,
  rowClassName = '',
  emptyMessage = 'No data available',
  showSelectionColumn = false,
  selectedItemIds = new Set(),
  onToggleSelectItem,
  onContextMenu,
}: TableBodyProps<T>) {
  return (
    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
      {data.length === 0 ? (
        <>
          <tr className="bg-white dark:bg-gray-800">
            <td 
              colSpan={visibleColumns.length + (showSelectionColumn ? 1 : 0)} 
              className="px-6 py-4 text-center text-gray-500 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 h-14"
            >
              {emptyMessage}
            </td>
          </tr>
          {Array.from({ length: Math.max(0, emptyRows - 1) }, (_, index) => (
            <tr 
              key={`filler-row-${index}`} 
              className={`h-14 border-b border-gray-200 dark:border-gray-700 ${
                index % 2 !== 0 
                  ? 'bg-gray-50 dark:bg-gray-850' 
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              {showSelectionColumn && (
                <td className="w-10 px-4 py-3 whitespace-nowrap border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"></td>
              )}
              {visibleColumns.map((column) => (
                <td 
                  key={`filler-${index}-${column.key}`} 
                  className="px-6 py-4 h-14 border-b border-gray-200 dark:border-gray-700"
                >
                  &nbsp;
                </td>
              ))}
            </tr>
          ))}
        </>
      ) : (
        <>
          {data.map((item, index) => (
            <TableRow
              key={keyExtractor(item)}
              item={item}
              keyExtractor={keyExtractor}
              visibleColumns={visibleColumns}
              rowClassName={rowClassName}
              showSelectionColumn={showSelectionColumn}
              isSelected={selectedItemIds.has(keyExtractor(item))}
              onToggleSelect={() => onToggleSelectItem && onToggleSelectItem(item)}
              onContextMenu={onContextMenu}
              rowIndex={index}
            />
          ))}

          {emptyRows > 0 && 
            Array.from({ length: emptyRows }, (_, index) => (
              <tr 
                key={`filler-row-${index}`} 
                className={`h-14 border-b border-gray-200 dark:border-gray-700 ${
                  index % 2 !== 0 
                    ? 'bg-gray-50 dark:bg-gray-850' 
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                {showSelectionColumn && (
                  <td className="w-10 px-4 py-3 whitespace-nowrap border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"></td>
                )}
                {visibleColumns.map((column) => (
                  <td 
                    key={`filler-${index}-${column.key}`} 
                    className="px-6 py-4 h-14 border-b border-gray-200 dark:border-gray-700"
                  >
                    &nbsp;
                  </td>
                ))}
              </tr>
            ))
          }
        </>
      )}
    </tbody>
  );
}

export default TableBody;