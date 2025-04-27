'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ITableProps } from './interfaces';
import { TableService } from './TableService';
import TablePagination from './TablePagination';

/**
 * A reusable data table component with pagination, customizable columns and styling
 */
export default function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No data available",
  className = "",
  rowClassName = "",
  pagination = true, // Запазваме за обратна съвместимост, но винаги показваме пагинация
  itemsPerPage: externalItemsPerPage = 10,
  setItemsPerPage: externalSetItemsPerPage,
  currentPage: externalCurrentPage = 1, // По подразбиране е 1
  setCurrentPage: externalSetCurrentPage,
  rowsPerPageOptions = [10, 15, 25], // Добавяме опциите за редове на страница
  fixedTableSize = true, // По подразбиране таблицата е с фиксиран размер
  tableHeight, // Височина на таблицата, ако е зададена
}: ITableProps<T>) {
  // Create an instance of the TableService
  const tableService = useMemo(() => new TableService<T>(), []);
  
  // Internal state for pagination if not controlled externally
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(externalItemsPerPage);
  
  // Use either external or internal pagination state
  const currentPage = externalCurrentPage ?? internalCurrentPage;
  const setCurrentPage = externalSetCurrentPage ?? setInternalCurrentPage;
  const itemsPerPage = externalItemsPerPage;
  const setItemsPerPage = externalSetItemsPerPage ?? setInternalItemsPerPage;

  // Reset to page 1 when data changes (e.g., filtering, sorting)
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length, setCurrentPage]);
  
  // Calculate pagination using the service - ensure at least 1 page
  const totalPages = useMemo(() => 
    Math.max(1, tableService.calculateTotalPages(data.length, itemsPerPage)),
    [tableService, data.length, itemsPerPage]
  );
  
  // Get paginated data using the service
  const paginatedData = useMemo(() => 
    tableService.getPaginatedData(data, currentPage, itemsPerPage),
    [tableService, data, currentPage, itemsPerPage]
  );

  // Handler for changing items per page
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to page 1 when changing items per page
  };

  // Пресмятане на стиловете за таблицата
  const tableContainerStyle = useMemo(() => {
    if (fixedTableSize && tableHeight) {
      return { height: `${tableHeight}px` };
    }
    
    // Изчисляване на височината на базата на броя редове
    if (fixedTableSize) {
      // Приемаме, че един ред е 53px (14px височина + падинг + бордер)
      const rowHeight = 53;
      return { height: `${itemsPerPage * rowHeight}px` };
    }
    
    return {};
  }, [fixedTableSize, tableHeight, itemsPerPage]);

  // Изчисляваме броя на редове, които трябва да се добавят
  const calculateEmptyRows = () => {
    if (!fixedTableSize) {
      // Ако таблицата не е с фиксиран размер, добавяме само празни редове, за да стигнем до itemsPerPage
      return Math.max(0, itemsPerPage - paginatedData.length);
    }
    
    // Винаги показваме точно itemsPerPage реда
    return itemsPerPage - paginatedData.length;
  };

  const emptyRows = calculateEmptyRows();

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto" style={tableContainerStyle}>
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  scope="col" 
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {/* First check if we have any data at all */}
            {data.length === 0 ? (
              // Show empty state message in first row
              <>
                <tr>
                  <td 
                    colSpan={columns.length} 
                    className="px-6 py-4 text-center text-gray-500 border-b border-gray-200"
                  >
                    {emptyMessage}
                  </td>
                </tr>
                
                {/* Fill remaining rows to match itemsPerPage */}
                {Array.from({ length: itemsPerPage - 1 }, (_, index) => (
                  <tr key={`empty-row-${index}`} className="h-14 border-b border-gray-200">
                    {columns.map((column) => (
                      <td 
                        key={`empty-${index}-${column.key}`} 
                        className="px-6 py-4 h-14 border-b border-gray-200"
                      >
                        &nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ) : (
              // Render actual data rows
              <>
                {paginatedData.map((item, index) => (
                  <tr 
                    key={keyExtractor(item)}
                    className={`h-14 border-b border-gray-200 ${
                      rowClassName && typeof rowClassName === 'function' 
                        ? rowClassName(item) 
                        : rowClassName
                    }`}
                  >
                    {columns.map((column) => (
                      <td 
                        key={`${keyExtractor(item)}-${column.key}`}
                        className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}
                      >
                        {column.render ? column.render(item) : (item as any)[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
                
                {/* Add empty rows if needed to maintain fixed table size */}
                {emptyRows > 0 && 
                  Array.from({ length: emptyRows }, (_, index) => (
                    <tr key={`filler-row-${index}`} className="h-14 border-b border-gray-200">
                      {columns.map((column) => (
                        <td 
                          key={`filler-${index}-${column.key}`} 
                          className="px-6 py-4 h-14 border-b border-gray-200"
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
        </table>
      </div>
      
      {/* Always show pagination regardless of data amount or pagination prop */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={data.length}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        rowsPerPageOptions={rowsPerPageOptions}
      />
    </div>
  );
}