'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ITablePagination } from './interfaces';

/**
 * Component for displaying and managing table pagination
 */
const TablePagination: React.FC<ITablePagination> = ({ 
  currentPage, 
  totalPages, 
  itemsPerPage, 
  totalItems, 
  onPageChange,
  onItemsPerPageChange
}) => {
  // Force totalPages to be at least 1
  const effectiveTotalPages = Math.max(1, totalPages);
  
  // Calculate start and end item for displaying "Showing X to Y of Z results"
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  /**
   * Handle going to previous page
   */
  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  /**
   * Handle going to next page
   */
  const handleNextPage = () => {
    if (currentPage < effectiveTotalPages) {
      onPageChange(currentPage + 1);
    }
  };

  /**
   * Handle changing items per page
   */
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newItemsPerPage);
      // Reset to page 1 when changing items per page
      onPageChange(1);
    }
  };

  /**
   * Generate array of page numbers to display
   */
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    
    // Always show at least page 1
    pageNumbers.push(1);
    
    // If there's only one page, return just that
    if (effectiveTotalPages <= 1) {
      return pageNumbers;
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(effectiveTotalPages - 1, currentPage + 1); i++) {
      // Add ellipsis if needed
      if (i === currentPage - 1 && i > 2) {
        pageNumbers.push('...');
      }
      
      pageNumbers.push(i);
      
      // Add ellipsis if needed
      if (i === currentPage + 1 && i < effectiveTotalPages - 1) {
        pageNumbers.push('...');
      }
    }
    
    // Always show last page if more than 1 page
    if (effectiveTotalPages > 1) {
      pageNumbers.push(effectiveTotalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
      {/* Mobile pagination */}
      <div className="flex-1 flex justify-between sm:hidden">
        <button 
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 ${currentPage === 1 ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`}
        >
          Previous
        </button>
        <button 
          onClick={handleNextPage}
          disabled={currentPage === effectiveTotalPages}
          className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 ${currentPage === effectiveTotalPages ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`}
        >
          Next
        </button>
      </div>
      
      {/* Desktop pagination */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
          
          {/* Items per page selector */}
          {onItemsPerPageChange && (
            <div className="flex items-center space-x-2">
              <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
                Rows per page:
              </label>
              <select 
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="block pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="25">25</option>
              </select>
            </div>
          )}
        </div>
        
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* Previous page button */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            
            {/* Page numbers */}
            {getPageNumbers().map((pageNumber, index) => {
              // If it's ellipsis
              if (pageNumber === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    ...
                  </span>
                );
              }
              
              // If it's a page number
              return (
                <button
                  key={`page-${pageNumber}`}
                  onClick={() => onPageChange(pageNumber as number)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === pageNumber
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            {/* Next page button */}
            <button
              onClick={handleNextPage}
              disabled={currentPage === effectiveTotalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === effectiveTotalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;