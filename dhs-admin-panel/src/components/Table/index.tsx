'use client';

import React, { useState, useMemo } from 'react';
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
  pagination = true,
  itemsPerPage: externalItemsPerPage = 10,
  setItemsPerPage: externalSetItemsPerPage,
  currentPage: externalCurrentPage,
  setCurrentPage: externalSetCurrentPage,
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
  
  // Calculate pagination using the service - ensure at least 1 page
  const totalPages = useMemo(() => 
    Math.max(1, tableService.calculateTotalPages(data.length, itemsPerPage)),
    [tableService, data.length, itemsPerPage]
  );
  
  // Get paginated data using the service
  const paginatedData = useMemo(() => 
    pagination ? tableService.getPaginatedData(data, currentPage, itemsPerPage) : data,
    [tableService, pagination, data, currentPage, itemsPerPage]
  );

  // Handler for changing items per page
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
  };

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
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
                  <tr key={`empty-row-${index}`} className="border-b border-gray-200">
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
                
                {/* Add empty rows if paginatedData has fewer rows than itemsPerPage */}
                {paginatedData.length < itemsPerPage && 
                  Array.from({ length: itemsPerPage - paginatedData.length }, (_, index) => (
                    <tr key={`filler-row-${index}`} className="border-b border-gray-200">
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
      
      {/* Always show pagination with items per page selector */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={data.length}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}