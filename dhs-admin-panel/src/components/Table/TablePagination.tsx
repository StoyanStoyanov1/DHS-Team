'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsDown, ArrowRight } from 'lucide-react';
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
  onItemsPerPageChange,
  rowsPerPageOptions = [10, 15, 25, 50]
}) => {
  const effectiveTotalPages = Math.max(1, totalPages);
  
  const [goToPage, setGoToPage] = useState('');
  const [isGoToPageFocused, setIsGoToPageFocused] = useState(false);
  
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
      onPageChange(1);
    }
  };

  /**
   * Handle direct page input change
   */
  const handleGoToPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    
    if (value === '0') {
      return;
    }
    
    const numValue = parseInt(value, 10);
    if (numValue > effectiveTotalPages) {
      setGoToPage(effectiveTotalPages.toString());
    } else {
      setGoToPage(value);
    }
  };

  /**
   * Handle go to page form submission
   */
  const handleGoToPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = parseInt(goToPage, 10);
    
    if (pageNumber && pageNumber > 0 && pageNumber <= effectiveTotalPages) {
      onPageChange(pageNumber);
      setGoToPage('');
    }
  };

  /**
   * Generate array of page numbers to display
   */
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    
    pageNumbers.push(1);
    
    if (effectiveTotalPages <= 1) {
      return pageNumbers;
    }
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(effectiveTotalPages - 1, currentPage + 1); i++) {
      if (i === currentPage - 1 && i > 2) {
        pageNumbers.push('...');
      }
      
      pageNumbers.push(i);
      
      if (i === currentPage + 1 && i < effectiveTotalPages - 1) {
        pageNumbers.push('...');
      }
    }
    
    if (effectiveTotalPages > 1) {
      pageNumbers.push(effectiveTotalPages);
    }
    
    return pageNumbers;
  };

  if (effectiveTotalPages <= 1) {
    return (
      <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
      <p className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </p>
      
      <div className="flex items-center space-x-4">
        <form 
          onSubmit={handleGoToPageSubmit} 
          className="hidden md:flex items-center space-x-2"
        >
          <label htmlFor="goToPage" className="text-sm text-gray-700 font-medium">
            Go to page:
          </label>
          <input
            id="goToPage"
            type="text"
            value={goToPage}
            onChange={handleGoToPageChange}
            onFocus={() => setIsGoToPageFocused(true)}
            onBlur={() => setIsGoToPageFocused(false)}
            placeholder={`1-${effectiveTotalPages}`}
            className={`w-16 border ${isGoToPageFocused ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'} rounded-md px-2 py-1 text-sm text-center focus:outline-none text-gray-800`}
            aria-label="Go to page"
          />
          <button
            type="submit"
            className="inline-flex items-center px-2 py-1 border border-blue-500 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            aria-label="Go"
          >
            <ArrowRight size={14} />
          </button>
        </form>
        
        <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          
          {getPageNumbers().map((pageNumber, index) => {
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
  );
};

export default TablePagination;