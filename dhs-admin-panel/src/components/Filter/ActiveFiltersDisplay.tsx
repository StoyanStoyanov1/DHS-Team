import React, { useState, useEffect, useRef } from 'react';
import { SortCriterion, ITableColumn } from '../Table/interfaces';
import { ChevronDown, ChevronUp, XCircle, ArrowUpDown, SlidersHorizontal, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DropResult } from '@hello-pangea/dnd';

export interface ActiveFilterItem {
  id: string;
  column: string;
  displayValue: string;
  operator?: string;
  value: any;
}

export interface ActiveFiltersDisplayProps<T> {
  sortCriteria: SortCriterion[];
  activeFilters: ActiveFilterItem[];
  columns: ITableColumn<T>[];
  onRemoveSortCriterion: (index: number) => void;
  onMoveSortCriterion?: (sourceIndex: number, destinationIndex: number) => void;
  onRemoveFilter: (filterId: string) => void;
  onClearAllFilters: () => void;
  onClearAllSorting: () => void;
  className?: string;
}

export function ActiveFiltersDisplay<T>({
  sortCriteria,
  activeFilters,
  columns,
  onRemoveSortCriterion,
  onMoveSortCriterion,
  onRemoveFilter,
  onClearAllFilters,
  onClearAllSorting,
  className = ''
}: ActiveFiltersDisplayProps<T>) {
  const [showFilters, setShowFilters] = useState(false);
  const [showSorting, setShowSorting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get column header by key
  const getColumnHeader = (key: string) => {
    const column = columns.find(col => col.key === key);
    return column ? column.header : key;
  };
  
  // Close popups when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowFilters(false);
        setShowSorting(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle drag and drop for sort criteria
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onMoveSortCriterion) return;
    
    onMoveSortCriterion(
      result.source.index,
      result.destination.index
    );
  };
  
  return (
    <div ref={containerRef} className={`flex space-x-2 items-center ${className}`}>
      {/* Sort criteria display */}
      {sortCriteria.length > 0 && (
        <div className="relative">
          <button
            className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium bg-white dark:bg-gray-700 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-600 shadow-sm"
            onClick={() => setShowSorting(!showSorting)}
            aria-label="Show sort criteria"
          >
            <ArrowUpDown size={14} />
            <span>{sortCriteria.length} {sortCriteria.length === 1 ? 'sort' : 'sorts'}</span>
            {showSorting ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          
          {showSorting && (
            <div className="absolute left-0 top-full mt-1 z-50 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700 dark:text-gray-200">Active Sorting</h3>
                {sortCriteria.length > 0 && (
                  <button
                    onClick={onClearAllSorting}
                    className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              {sortCriteria.length > 0 ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="sort-criteria">
                    {(provided: DroppableProvided) => (
                      <ul
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-1"
                      >
                        {sortCriteria.map((criterion, index) => (
                          <Draggable 
                            key={`${criterion.key}-${index}`} 
                            draggableId={`${criterion.key}-${index}`} 
                            index={index}
                          >
                            {(provided: DraggableProvided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-md p-2 text-sm"
                              >
                                <div className="flex items-center space-x-2">
                                  <div {...provided.dragHandleProps} className="cursor-grab">
                                    <GripVertical size={14} className="text-gray-400 dark:text-gray-400" />
                                  </div>
                                  <span className="font-medium text-gray-700 dark:text-gray-200">{getColumnHeader(criterion.key)}</span>
                                  <span className="text-gray-500 dark:text-gray-400">
                                    {criterion.direction === 'asc' ? 
                                      <ChevronUp size={14} className="inline" /> : 
                                      <ChevronDown size={14} className="inline" />
                                    }
                                  </span>
                                </div>
                                <button
                                  onClick={() => onRemoveSortCriterion(index)}
                                  className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                  aria-label={`Remove ${getColumnHeader(criterion.key)} sort`}
                                >
                                  <XCircle size={14} />
                                </button>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-1">No active sorting</p>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Filter display */}
      {activeFilters.length > 0 && (
        <div className="relative">
          <button
            className="flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium bg-white dark:bg-gray-700 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-600 shadow-sm"
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Show active filters"
          >
            <SlidersHorizontal size={14} />
            <span>{activeFilters.length} {activeFilters.length === 1 ? 'filter' : 'filters'}</span>
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          
          {showFilters && (
            <div className="absolute left-0 top-full mt-1 z-50 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-3">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700 dark:text-gray-200">Active Filters</h3>
                {activeFilters.length > 0 && (
                  <button
                    onClick={onClearAllFilters}
                    className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              {activeFilters.length > 0 ? (
                <ul className="space-y-1">
                  {activeFilters.map((filter) => (
                    <li 
                      key={filter.id} 
                      className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-md p-2 text-sm"
                    >
                      <div className="overflow-hidden">
                        <span className="font-medium text-gray-700 dark:text-gray-200">{getColumnHeader(filter.column)}</span>
                        {filter.operator && (
                          <span className="text-gray-500 dark:text-gray-400 mx-1">{filter.operator}</span>
                        )}
                        <span className="text-gray-700 dark:text-gray-300 truncate">{filter.displayValue}</span>
                      </div>
                      <button
                        onClick={() => onRemoveFilter(filter.id)}
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 flex-shrink-0 ml-2"
                        aria-label={`Remove ${getColumnHeader(filter.column)} filter`}
                      >
                        <XCircle size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-1">No active filters</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}