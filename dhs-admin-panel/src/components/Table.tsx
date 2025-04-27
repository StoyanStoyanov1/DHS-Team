'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Column definition interface
export interface Column<T> {
  header: string;
  key: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

// Table props interface
export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string | ((item: T) => string);
  pagination?: boolean;
  itemsPerPage?: number;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
}

// Table component
export default function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No data available",
  className = "",
  rowClassName = "",
  pagination = true,
  itemsPerPage = 10,
  currentPage: externalCurrentPage,
  setCurrentPage: externalSetCurrentPage,
}: TableProps<T>) {
  // Internal state for pagination if not controlled externally
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  
  // Use either external or internal pagination state
  const currentPage = externalCurrentPage ?? internalCurrentPage;
  const setCurrentPage = externalSetCurrentPage ?? setInternalCurrentPage;
  
  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = pagination 
    ? data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : data;
    
  // Get class name for a row (string or function)
  const getRowClassName = (item: T): string => {
    if (typeof rowClassName === 'function') {
      return `${rowClassName(item)} hover:bg-gray-50`;
    }
    return `${rowClassName} hover:bg-gray-50`;
  };

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
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
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={keyExtractor(item)} className={getRowClassName(item)}>
                  {columns.map((column) => (
                    <td 
                      key={`${keyExtractor(item)}-${column.key}`} 
                      className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}
                    >
                      {column.render ? column.render(item) : (item as any)[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-6 py-4 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && totalPages > 1 && (
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          {/* Mobile pagination */}
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 ${currentPage === 1 ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`}
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 ${currentPage === totalPages ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`}
            >
              Next
            </button>
          </div>
          
          {/* Desktop pagination */}
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{paginatedData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, data.length)}</span> of{' '}
                <span className="font-medium">{data.length}</span> results
              </p>
            </div>
            
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                {/* Previous page button */}
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {/* Page numbers */}
                {[...Array(totalPages).keys()].map((number) => {
                  const pageNumber = number + 1;
                  // Only show current page and adjacent pages, plus first and last
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNumber
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  
                  // Show ellipsis for gaps in page numbers
                  if (
                    (pageNumber === currentPage - 2 && pageNumber > 1) ||
                    (pageNumber === currentPage + 2 && pageNumber < totalPages)
                  ) {
                    return (
                      <span
                        key={pageNumber}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    );
                  }
                  
                  return null;
                })}
                
                {/* Next page button */}
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}