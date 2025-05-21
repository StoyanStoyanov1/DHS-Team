'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowRight } from 'lucide-react';
import { ITablePagination } from './interfaces';
import PageSizeControl from './PageSizeControl';

const TablePagination: React.FC<ITablePagination> = ({ 
  currentPage, 
  totalPages, 
  itemsPerPage, 
  totalItems, 
  onPageChange,
  onItemsPerPageChange,
  rowsPerPageOptions = [10, 15, 25, 50],
  showPageSizeControl = true
}) => {
  const effectiveTotalPages = Math.max(1, totalPages);

  const [goToPage, setGoToPage] = useState('');
  const [isGoToPageFocused, setIsGoToPageFocused] = useState(false);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handleFirstPage = () => {
    if (currentPage > 1) {
      onPageChange(1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < effectiveTotalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    if (currentPage < effectiveTotalPages) {
      onPageChange(effectiveTotalPages);
    }
  };

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

  const handleGoToPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = parseInt(goToPage, 10);

    if (pageNumber && pageNumber > 0 && pageNumber <= effectiveTotalPages) {
      onPageChange(pageNumber);
      setGoToPage('');
    }
  };

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    if (effectiveTotalPages <= 7) {
      for (let i = 1; i <= effectiveTotalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      if (currentPage <= 3) {
        pageNumbers.push(2, 3, 4, '...', effectiveTotalPages - 1);
      } else if (currentPage >= effectiveTotalPages - 2) {
        pageNumbers.push('...', effectiveTotalPages - 3, effectiveTotalPages - 2, effectiveTotalPages - 1);
      } else {
        pageNumbers.push('...', currentPage - 1, currentPage, currentPage + 1, '...');
      }

      pageNumbers.push(effectiveTotalPages);
    }

    return pageNumbers;
  };

  // When there's no data or only a single page
  if (effectiveTotalPages <= 1 && !showPageSizeControl) {
    return (
      <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-6 py-3 w-full">
        <p className="text-sm text-gray-700 dark:text-gray-300 pl-2" data-testid="items-info">
          {`Showing ${startItem} to ${endItem} of ${totalItems} results`}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-between items-center border-t border-gray-200 dark:border-gray-700 px-6 py-3 w-full">
      <div className="flex flex-row items-center space-x-4 pl-2">
        <p className="text-sm text-gray-700 dark:text-gray-300" data-testid="items-info">
          {`Showing ${startItem} to ${endItem} of ${totalItems} results`}
        </p>

        {showPageSizeControl && onItemsPerPageChange && (
          <PageSizeControl
            itemsPerPage={itemsPerPage}
            setItemsPerPage={onItemsPerPageChange}
            options={rowsPerPageOptions.map(size => ({
              size,
              available: size <= Math.max(...rowsPerPageOptions, totalItems)
            }))}
            label="Per page:"
            labelPosition="left"
            compact={true}
            className="mt-0"
          />
        )}
      </div>

      <div className="flex items-center space-x-4">
        {effectiveTotalPages > 1 && (
          <>
            <form 
              onSubmit={handleGoToPageSubmit} 
              className="hidden md:flex items-center space-x-2"
            >
              <label htmlFor="goToPage" className="text-sm text-gray-700 dark:text-gray-300 font-medium">
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
                className={`w-16 border ${isGoToPageFocused ? 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500 dark:ring-blue-400' : 'border-gray-300 dark:border-gray-600'} rounded-md px-2 py-1 text-sm text-center focus:outline-none text-gray-800 dark:text-gray-200 dark:bg-gray-700`}
                aria-label="Go to page"
              />
              <button
                type="submit"
                className="inline-flex items-center px-2 py-1 border border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition-colors duration-200"
                aria-label="Go"
              >
                <ArrowRight size={14} />
              </button>
            </form>

            <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={handleFirstPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                  currentPage === 1 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200'
                }`}
                aria-label="Go to first page"
                title="First page"
              >
                <span className="sr-only">First</span>
                <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 border-t border-b border-gray-300 dark:border-gray-600 text-sm font-medium ${
                  currentPage === 1 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200'
                }`}
                aria-label="Previous page"
                title="Previous page"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="hidden sm:flex">
                {getPageNumbers().map((pageNumber, index) => {
                  if (pageNumber === '...') {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="relative inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={`page-${pageNumber}`}
                      onClick={() => onPageChange(pageNumber as number)}
                      className={`relative inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                        currentPage === pageNumber
                          ? 'z-10 bg-blue-500 dark:bg-blue-600 border-blue-500 dark:border-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
                          : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                      } transition-colors duration-200`}
                      aria-label={`Page ${pageNumber}`}
                      title={`Page ${pageNumber}`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <div className="sm:hidden inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{currentPage}</span>
                <span className="mx-1">/</span>
                <span>{effectiveTotalPages}</span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === effectiveTotalPages}
                className={`relative inline-flex items-center px-2 py-2 border-t border-b border-gray-300 dark:border-gray-600 text-sm font-medium ${
                  currentPage === effectiveTotalPages 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200'
                }`}
                aria-label="Next page"
                title="Next page"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                onClick={handleLastPage}
                disabled={currentPage === effectiveTotalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium ${
                  currentPage === effectiveTotalPages 
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200'
                }`}
                aria-label="Go to last page"
                title="Last page"
              >
                <span className="sr-only">Last</span>
                <ChevronsRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </nav>
          </>
        )}
      </div>
    </div>
  );
};

export default TablePagination;
