import React from 'react';
import { ITableColumn, SortDirection, SortCriterion } from './interfaces';
import { ArrowUp } from 'lucide-react';
import ColumnMenu from './ColumnMenu';

interface TableHeaderProps<T> {
  columns: ITableColumn<T>[];
  visibleColumns: ITableColumn<T>[];
  sortKey?: string;
  sortDirection: SortDirection;
  sortCriteria: SortCriterion[];
  handleSort: (columnKey: string) => void;
  handleColumnFilterChange: (columnKey: string, value: any) => void;
  handleToggleColumnVisibility: (columnKey: string) => void;
  activeFilters: Record<string, any>;
  multiSort?: boolean;
  handleSortDrop: (e: React.DragEvent<HTMLTableCellElement>, targetColumnKey: string) => void;
  showSelectionColumn?: boolean;
  isAllSelected: boolean;
  isPartiallySelected: boolean;
  toggleSelectAll: () => void;
}

function TableHeader<T>({
  columns,
  visibleColumns,
  sortKey,
  sortDirection,
  sortCriteria,
  handleSort,
  handleColumnFilterChange,
  handleToggleColumnVisibility,
  activeFilters,
  multiSort = false,
  handleSortDrop,
  showSelectionColumn = false,
  isAllSelected,
  isPartiallySelected,
  toggleSelectAll,
}: TableHeaderProps<T>) {
  const renderSortIndicator = (columnKey: string) => {
    if (!multiSort) {
      // Single draggable sort indicator
      const isColumnSorted = sortKey === columnKey;
      return (
        <div 
          className={`flex items-center ml-1 cursor-pointer ${isColumnSorted ? 'sort-active' : ''}`}
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', columnKey);
            e.dataTransfer.effectAllowed = 'move';
            const img = new Image();
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
            e.dataTransfer.setDragImage(img, 0, 0);
            e.currentTarget.classList.add('dragging');
          }}
          onDragEnd={(e) => {
            e.currentTarget.classList.remove('dragging');
          }}
        >
          <div 
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
              isColumnSorted 
                ? sortDirection === 'asc' 
                  ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rotate-0' 
                  : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rotate-180' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title={isColumnSorted 
              ? sortDirection === 'asc' 
                ? 'Сортиране във възходящ ред. Натиснете за низходящ.' 
                : 'Сортиране в низходящ ред. Натиснете за премахване на сортирането.' 
              : 'Натиснете за сортиране във възходящ ред. Плъзнете за пренареждане на колони.'}
          >
            <ArrowUp size={14} className="transform transition-transform duration-200" />
          </div>
        </div>
      );
    }

    // Multi-sort indicator
    const criterionIndex = sortCriteria.findIndex(c => c.key === columnKey);
    if (criterionIndex === -1) {
      return (
        <div 
          className="flex items-center ml-1 cursor-pointer"
          draggable={true}
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', columnKey);
            e.dataTransfer.effectAllowed = 'move';
            const img = new Image();
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
            e.dataTransfer.setDragImage(img, 0, 0);
            e.currentTarget.classList.add('dragging');
          }}
          onDragEnd={(e) => {
            e.currentTarget.classList.remove('dragging');
          }}
        >
          <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center">
            <ArrowUp size={14} />
          </div>
        </div>
      );
    }

    const criterion = sortCriteria[criterionIndex];
    return (
      <div 
        className="flex items-center ml-1 gap-1 cursor-pointer"
        draggable={true}
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', JSON.stringify({ key: columnKey, index: criterionIndex }));
          e.dataTransfer.effectAllowed = 'move';
          const img = new Image();
          img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
          e.dataTransfer.setDragImage(img, 0, 0);
          e.currentTarget.classList.add('dragging');
        }}
        onDragEnd={(e) => {
          e.currentTarget.classList.remove('dragging');
        }}
      >
        {criterionIndex > 0 && (
          <span className="inline-flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-xs px-1.5 font-medium text-indigo-700 dark:text-indigo-400 min-w-[1.5rem] h-5">
            {criterionIndex + 1}
          </span>
        )}
        <div 
          className={`w-5 h-5 rounded-full flex items-center justify-center ${
            criterion.direction === 'asc' 
              ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rotate-0' 
              : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rotate-180'
          }`}
          title={criterion.direction === 'asc' 
            ? 'Сортиране във възходящ ред. Натиснете за низходящ.' 
            : 'Сортиране в низходящ ред. Натиснете за премахване на сортирането.'}
        >
          <ArrowUp size={14} className="transform transition-transform duration-200" />
        </div>
      </div>
    );
  };

  const isSortableColumn = (column: ITableColumn<T>) => column.sortable !== false;

  return (
    <thead className="bg-gray-50 dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <tr className="shadow-sm dark:shadow-gray-900">
        {showSelectionColumn && (
          <th className="w-12 px-4 py-3 border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center">
              <div className="relative">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                  checked:border-indigo-500 checked:bg-indigo-500 dark:checked:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  title={isAllSelected ? 'Премахване на селекцията' : 'Избиране на всички редове'}
                />
                <div className={`pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center transition-opacity ${isPartiallySelected ? 'opacity-100' : (isAllSelected ? 'opacity-100' : 'opacity-0')}`}>
                  {isPartiallySelected ? (
                    <div className="h-[2px] w-2 bg-white"></div>
                  ) : (
                    <svg className="h-3 w-3 fill-white stroke-white" viewBox="0 0 16 16">
                      <path d="M4 8l3 3 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </th>
        )}
        {visibleColumns.map((column) => (
          <th 
            key={column.key}
            scope="col"
            className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider border-r border-gray-200 dark:border-gray-700 table-column-header transition-colors duration-200 shadow-sm ${column.className || ''}`}
            onContextMenu={(e) => {
              e.preventDefault();
              const rect = e.currentTarget.getBoundingClientRect();
              // Store the current column for the context menu
              (window as any).__currentColumnForContextMenu = column;
            }}
            onDragOver={(e) => {
              if (isSortableColumn(column)) {
                e.preventDefault();
                e.currentTarget.classList.add('sort-drop-target');
              }
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('sort-drop-target');
            }}
            onDrop={(e) => {
              e.currentTarget.classList.remove('sort-drop-target');
              if (isSortableColumn(column)) {
                handleSortDrop(e, column.key);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {isSortableColumn(column) ? (
                  <button 
                    className="flex items-center hover:text-gray-900 dark:hover:text-white hover:font-medium transition-all duration-150 focus:outline-none" 
                    onClick={() => handleSort(column.key)}
                  >
                    <span className="hover:text-gray-900 dark:hover:text-white">{column.header}</span>
                    {renderSortIndicator(column.key)}
                  </button>
                ) : (
                  <span>{column.header}</span>
                )}
              </div>

              <ColumnMenu
                column={column}
                data={[]} // Подаваме празен масив, тъй като в този момент не използваме данните
                onFilterChange={handleColumnFilterChange}
                onToggleVisibility={handleToggleColumnVisibility}
                activeFilters={activeFilters}
                onSortChange={handleSort}
                currentSortKey={sortKey}
                currentSortDirection={sortDirection}
              />
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;
