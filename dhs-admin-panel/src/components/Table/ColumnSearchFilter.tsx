import React, { useState, useEffect, useRef } from 'react';
import { SearchMethod, SearchField } from './interfaces';
import { 
  Search, ChevronDown, X, Check, Clock, 
  SlidersHorizontal, History, PlusCircle, Hash, Calendar
} from 'lucide-react';

/**
 * Extended search methods supported by the ColumnSearchFilter component.
 * These methods determine how the search term is matched against column values.
 */
export type EnhancedSearchMethod = 
  | 'contains'      // Value contains the search term
  | 'equals'        // Value exactly matches the search term
  | 'startsWith'    // Value starts with the search term
  | 'endsWith'      // Value ends with the search term
  | 'notContains'   // Value does not contain the search term
  | 'isEmpty'       // Value is empty or null
  | 'isNotEmpty'    // Value is not empty or null
  | 'regex';        // Value matches the regex pattern

/**
 * Data types supported by the ColumnSearchFilter component.
 * The filter UI and available search methods adapt based on the data type.
 */
export type FieldDataType = 'text' | 'number' | 'date' | 'boolean' | 'array';

/**
 * Props for the ColumnSearchFilter component.
 */
interface ColumnSearchFilterProps {
  /** Unique identifier for the column being filtered */
  columnKey: string;
  /** Display name of the column being filtered */
  columnHeader: string;
  /** Array of fields that can be searched within this column */
  searchFields: SearchField[];
  /** Callback function triggered when a search is performed */
  onSearch: (columnKey: string, term: string | null, field: string, method: SearchMethod) => void;
  /** Initial search value or configuration */
  initialValue?: string | null;
  /** Optional callback function triggered when the filter is closed */
  onClose?: () => void;
  /** Data type of the column (affects available search methods) */
  fieldDataType?: FieldDataType;
  /** Array of recent search terms to display for quick selection */
  recentSearches?: string[];
}

/**
 * A powerful and flexible search filter component for table columns.
 * 
 * This component provides an advanced search interface with the following features:
 * - Multiple search methods (contains, equals, starts with, etc.)
 * - Support for different data types (text, number, date, boolean, array)
 * - Field selection for complex columns with multiple searchable fields
 * - Recent searches history
 * - Advanced options like case sensitivity
 * - Empty/not empty filters
 * 
 * The component adapts its UI and available search methods based on the data type
 * of the column being filtered.
 */
export default function ColumnSearchFilter({
  columnKey,
  columnHeader,
  searchFields,
  onSearch,
  initialValue = '',
  onClose,
  fieldDataType = 'text',
  recentSearches = []
}: ColumnSearchFilterProps) {
  // State for the current search term
  const [searchTerm, setSearchTerm] = useState<string | null>(initialValue);

  // State for the selected field to search within (for columns with multiple searchable fields)
  const [selectedField, setSelectedField] = useState<string>(
    searchFields.length > 0 ? (searchFields[0].path || searchFields[0].key) : columnKey
  );

  // State for the selected search method (contains, equals, etc.)
  const [searchMethod, setSearchMethod] = useState<EnhancedSearchMethod>('contains');

  // State for case sensitivity option (only applicable for text fields)
  const [caseSensitive, setCaseSensitive] = useState(false);

  // State to control visibility of advanced options section
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // State to control visibility of recent searches dropdown
  const [showRecentSearches, setShowRecentSearches] = useState(false);

  // Refs for DOM elements to handle click outside behavior
  const searchInputRef = useRef<HTMLInputElement>(null);
  const recentSearchesRef = useRef<HTMLDivElement>(null);

  // Store initial state for reference (used when handling complex initialValue objects)
  const initialState = useRef({
    term: '',
    field: selectedField,
    method: 'contains' as EnhancedSearchMethod
  });

  // Limit the number of recent searches shown to prevent UI clutter
  const limitedRecentSearches = recentSearches.slice(0, 10);

  // Update the selected field when searchFields changes
  // This ensures we always have a valid field selected
  useEffect(() => {
    if (searchFields.length > 0) {
      setSelectedField(searchFields[0].path || searchFields[0].key);
    }
  }, [searchFields]);

  // Auto-focus the search input when the component mounts
  // This improves user experience by allowing immediate typing
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Handle clicks outside the recent searches dropdown
  // This closes the dropdown when clicking elsewhere on the page
  useEffect(() => {
    /**
     * Closes the recent searches dropdown when clicking outside of it
     * @param {MouseEvent} event - The mouse event
     */
    function handleClickOutside(event: MouseEvent) {
      if (
        recentSearchesRef.current && 
        !recentSearchesRef.current.contains(event.target as Node) &&
        !searchInputRef.current?.contains(event.target as Node)
      ) {
        setShowRecentSearches(false);
      }
    }

    // Only add the event listener when the dropdown is visible
    if (showRecentSearches) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener when the component unmounts
    // or when the dropdown visibility changes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRecentSearches]);

  /**
   * Processes the search based on current state and calls the onSearch callback.
   * Handles different search methods including special cases for isEmpty/isNotEmpty.
   * Closes the filter dropdown/modal after search is applied.
   */
  const handleSearch = () => {
    // If search term is empty and not using isEmpty/isNotEmpty methods,
    // clear the filter (set to null)
    if (searchTerm === "" && !['isEmpty', 'isNotEmpty'].includes(searchMethod)) {
      onSearch(columnKey, null, selectedField, searchMethod as SearchMethod);

      if (onClose) {
        onClose();
      }
      return;
    }

    // Special handling for isEmpty/isNotEmpty methods which don't need a search term
    if (['isEmpty', 'isNotEmpty'].includes(searchMethod)) {
      onSearch(columnKey, '', selectedField, searchMethod as SearchMethod);
    } else {
      onSearch(columnKey, searchTerm, selectedField, searchMethod as SearchMethod);
    }

    // Handle edge case: if both initial and current values are empty, reset to default
    if ((initialValue === '' || initialValue === null) && (searchTerm === '' || searchTerm === null)) {
      onSearch(columnKey, null, selectedField, 'contains');
    } 
    // Handle complex initialValue objects
    else if (typeof initialValue === 'object' && initialValue !== null) {
      const config = initialValue as any;
      if (config.term !== undefined && config.field !== undefined && config.method !== undefined) {
        // Keep the current filter as is
      }
    }

    // Close the filter dropdown/modal
    if (onClose) {
      onClose();
    }
  };

  /**
   * Resets the filter to its default state and clears the applied filter.
   * Sets search term to empty, method to 'contains', and disables case sensitivity.
   */
  const handleClear = () => {
    setSearchTerm('');
    setSearchMethod('contains');
    setCaseSensitive(false);
    onSearch(columnKey, null, selectedField, 'contains');
    if (onClose) {
      onClose();
    }
  };

  /**
   * Closes the filter dropdown/modal without changing the current filter.
   * Preserves any complex filter configuration from initialValue.
   */
  const handleClose = () => {
    if (onClose) {
      const config = initialValue as any;
      if (config.term !== undefined && config.field !== undefined && config.method !== undefined) {
        // Keep the current filter as is
      }

      onClose();
    }
  };

  /**
   * Handles keyboard events in the search input.
   * - Enter: Applies the search
   * - Escape: Closes recent searches dropdown or the entire filter
   * 
   * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      if (showRecentSearches) {
        setShowRecentSearches(false);
      } else if (onClose) {
        handleClose();
      }
    }
  };

  /**
   * Handles selection of a term from the recent searches dropdown.
   * Sets the selected term as the current search term, closes the dropdown,
   * and refocuses the search input for a smooth user experience.
   * 
   * @param {string} term - The selected recent search term
   */
  const handleRecentSearchSelect = (term: string) => {
    setSearchTerm(term);
    setShowRecentSearches(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  /**
   * Toggles the visibility of the recent searches dropdown.
   */
  const toggleRecentSearches = () => {
    setShowRecentSearches(!showRecentSearches);
  };

  /**
   * Returns an appropriate icon based on the field data type.
   * Each data type has a unique icon with a specific color for visual distinction.
   * 
   * @returns {JSX.Element} The icon component for the current field data type
   */
  const getDataTypeIcon = () => {
    switch (fieldDataType) {
      case 'number':
        return <Hash size={14} className="text-blue-500" />;
      case 'date':
        return <Calendar size={14} className="text-green-500" />;
      case 'boolean':
        return <Check size={14} className="text-purple-500" />;
      case 'array':
        return <PlusCircle size={14} className="text-amber-500" />;
      default:
        return <Search size={14} className="text-gray-400" />;
    }
  };

  /**
   * Returns the appropriate search method options based on the field data type.
   * Different data types (text, number, date) have different applicable search methods.
   * 
   * @returns {Array<{value: string, label: string}>} Array of search method options
   */
  const getMethodOptions = () => {
    // Common options applicable to most data types
    const commonOptions = [
      { value: 'contains', label: 'Contains' },
      { value: 'equals', label: 'Equals' },
      { value: 'startsWith', label: 'Starts with' },
      { value: 'endsWith', label: 'Ends with' },
      { value: 'notContains', label: 'Does not contain' },
      { value: 'isEmpty', label: 'Is empty' },
      { value: 'isNotEmpty', label: 'Is not empty' }
    ];

    // Add regex option only for text fields
    if (fieldDataType === 'text') {
      commonOptions.push({ value: 'regex', label: 'Regular expression' });
    }

    // Special options for number fields
    if (fieldDataType === 'number') {
      return [
        { value: 'equals', label: 'Equals' },
        { value: 'notEquals', label: 'Not equals' },
        { value: 'greaterThan', label: 'Greater than' },
        { value: 'lessThan', label: 'Less than' },
        { value: 'greaterOrEqual', label: 'Greater than or equal' },
        { value: 'lessOrEqual', label: 'Less than or equal' },
        { value: 'isEmpty', label: 'Is empty' },
        { value: 'isNotEmpty', label: 'Is not empty' }
      ];
    }

    // Special options for date fields
    if (fieldDataType === 'date') {
      return [
        { value: 'equals', label: 'Equals' },
        { value: 'notEquals', label: 'Not equals' },
        { value: 'before', label: 'Before' },
        { value: 'after', label: 'After' },
        { value: 'isEmpty', label: 'Is empty' },
        { value: 'isNotEmpty', label: 'Is not empty' }
      ];
    }

    return commonOptions;
  };

  // Get the available search method options based on the field data type
  const methodOptions = getMethodOptions();

  // Get the display label for the currently selected field
  const selectedFieldLabel = searchFields.find(f => (f.path || f.key) === selectedField)?.label || columnHeader;

  // Determine if we need to show the input field (not needed for isEmpty/isNotEmpty methods)
  const needsInputField = !['isEmpty', 'isNotEmpty'].includes(searchMethod);

  /**
   * Initialize or update the filter state based on the initialValue prop.
   * 
   * This effect handles two types of initialValue:
   * 1. Object format: {term, field, method} - Used for complex filter configurations
   * 2. String format: Direct search term
   * 
   * The effect ensures that when initialValue changes, the component state is updated
   * to reflect those changes, maintaining the filter's persistence across renders.
   */
  useEffect(() => {
    // Handle complex object initialValue with term, field, and method properties
    if (typeof initialValue === 'object' && initialValue !== null) {
      const config = initialValue as any;

      // Update search term if provided
      if (config.term !== undefined) {
        setSearchTerm(config.term || '');
        initialState.current.term = config.term || '';
      }

      // Update selected field if provided and valid
      if (config.field !== undefined && searchFields.some(f => (f.path || f.key) === config.field)) {
        setSelectedField(config.field);
        initialState.current.field = config.field;
      }

      // Update search method if provided
      if (config.method !== undefined) {
        setSearchMethod(config.method as EnhancedSearchMethod);
        initialState.current.method = config.method as EnhancedSearchMethod;
      }
    } 
    // Handle string initialValue (direct search term)
    else if (typeof initialValue === 'string') {
      setSearchTerm(initialValue);
      initialState.current.term = initialValue;
    }
  }, [initialValue, searchFields]);

  return (
    <div className="space-y-3 p-3 bg-white rounded-lg shadow-lg border border-gray-200 w-72">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div className="flex items-center">
          {getDataTypeIcon()}
          <span className="ml-1.5 font-medium text-sm text-gray-800">Search {columnHeader}</span>
        </div>
        {onClose && (
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {searchFields.length > 1 && (
        <div>
          <label htmlFor="search-field" className="block text-xs font-medium text-gray-700 mb-1">
            Search in field:
          </label>
          <div className="relative">
            <select
              id="search-field"
              className="block w-full pl-3 pr-10 py-1.5 text-sm border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-shadow duration-150"
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
            >
              {searchFields.map((field) => (
                <option key={field.key} value={field.path || field.key}>
                  {field.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown size={16} className="text-gray-500" />
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="search-method" className="block text-xs font-medium text-gray-700 mb-1">
          Match condition:
        </label>
        <div className="relative">
          <select
            id="search-method"
            className="block w-full pl-3 pr-10 py-1.5 text-sm border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-shadow duration-150"
            value={searchMethod}
            onChange={(e) => {
              const newMethod = e.target.value as EnhancedSearchMethod;
              setSearchMethod(newMethod);
            }}
          >
            {methodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown size={16} className="text-gray-500" />
          </div>
        </div>
      </div>

      {needsInputField && (
        <div className="relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-150"
              placeholder={`Search ${selectedFieldLabel}...`}
              value={searchTerm ?? ''}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={() => {
                if (showRecentSearches) {
                  setShowRecentSearches(false);
                }
              }}
              autoFocus
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {searchTerm && (
                <button
                  className="text-gray-400 hover:text-gray-600 mr-1"
                  onClick={() => setSearchTerm('')}
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
              {limitedRecentSearches.length > 0 && (
                <button 
                  className={`text-gray-400 hover:text-gray-600 ${showRecentSearches ? 'text-indigo-600' : ''}`}
                  onClick={toggleRecentSearches}
                  title="Recent searches"
                >
                  <History size={16} />
                </button>
              )}
            </div>
          </div>

          {showRecentSearches && limitedRecentSearches.length > 0 && (
            <div 
              ref={recentSearchesRef}
              className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto"
            >
              <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-medium text-gray-700">Recent searches</span>
                <button
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200"
                  onClick={() => setShowRecentSearches(false)}
                >
                  <X size={12} />
                </button>
              </div>
              {limitedRecentSearches.map((term, index) => (
                <button
                  key={index}
                  className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  onClick={() => handleRecentSearchSelect(term)}
                >
                  <Clock size={14} className="text-gray-400 mr-2" />
                  <span className="truncate">{term}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 focus:outline-none"
        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
      >
        <SlidersHorizontal size={12} className="mr-1" />
        {showAdvancedOptions ? 'Hide advanced options' : 'Show advanced options'}
      </button>

      {showAdvancedOptions && (
        <div className="pt-2 border-t border-gray-100">
          {fieldDataType === 'text' && (
            <div className="flex items-center mb-2">
              <input
                id="case-sensitive"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
              />
              <label htmlFor="case-sensitive" className="ml-2 block text-sm text-gray-700">
                Case sensitive
              </label>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end pt-2 space-x-2 border-t border-gray-100">
        <button
          type="button"
          className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-150"
          onClick={handleClear}
        >
          Clear
        </button>
        <button
          type="button"
          className="px-3 py-1.5 text-xs text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-150"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}
