'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ITableProps } from './interfaces';
import { TableService } from './TableService';
import TablePagination from './TablePagination';
import TableSizeControls from './TableSizeControls';


export default function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No data available",
  className = "",
  rowClassName = "",
  itemsPerPage: externalItemsPerPage = 10,
  setItemsPerPage: externalSetItemsPerPage,
  currentPage: externalCurrentPage = 1,
  setCurrentPage: externalSetCurrentPage,
  rowsPerPageOptions = [10, 15, 25], 
  showTableSizeControls = true, 
}: ITableProps<T>) {
  const tableService = useMemo(() => new TableService<T>(), []);
  
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(externalItemsPerPage);
  
  const currentPage = externalCurrentPage ?? internalCurrentPage;
  const setCurrentPage = externalSetCurrentPage ?? setInternalCurrentPage;
  const itemsPerPage = externalItemsPerPage ?? internalItemsPerPage;
  const setItemsPerPage = externalSetItemsPerPage ?? setInternalItemsPerPage;

  useEffect(() => {
    if (externalItemsPerPage !== undefined) {
      setInternalItemsPerPage(externalItemsPerPage);
    }
  }, [externalItemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [data.length, setCurrentPage]);
  
  const totalPages = useMemo(() => 
    Math.max(1, tableService.calculateTotalPages(data.length, itemsPerPage)),
    [tableService, data.length, itemsPerPage]
  );
  
  const paginatedData = useMemo(() => 
    tableService.getPaginatedData(data, currentPage, itemsPerPage),
    [tableService, data, currentPage, itemsPerPage]
  );

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const emptyRows = itemsPerPage - paginatedData.length;

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {showTableSizeControls && (
        <div className="px-6 py-3 flex items-center justify-between border-b border-gray-200 bg-white">
          <h2 className="text-sm font-medium text-gray-700">
            {data.length} {data.length === 1 ? 'item' : 'items'}
          </h2>
          <TableSizeControls
            itemsPerPage={itemsPerPage}
            setItemsPerPage={handleItemsPerPageChange}
            options={rowsPerPageOptions.map(size => ({
              size, 
              available: size <= Math.max(...rowsPerPageOptions, data.length)
            }))}
          />
        </div>
      )}
      
      <div>
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
            {data.length === 0 ? (
              <>
                <tr>
                  <td 
                    colSpan={columns.length} 
                    className="px-6 py-4 text-center text-gray-500 border-b border-gray-200"
                  >
                    {emptyMessage}
                  </td>
                </tr>
                {Array.from({ length: Math.max(0, itemsPerPage - 1) }, (_, index) => (
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
                ))}
              </>
            ) : (
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