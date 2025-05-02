import React, { useState, useEffect, useRef } from 'react';
import { SearchMethod, SearchField } from './interfaces';
import { 
  Search, ChevronDown, X, Check, Clock, 
  SlidersHorizontal, History, PlusCircle, Hash, Calendar
} from 'lucide-react';

export type EnhancedSearchMethod = 
  | 'contains' 
  | 'equals' 
  | 'startsWith' 
  | 'endsWith' 
  | 'notContains'
  | 'isEmpty' 
  | 'isNotEmpty'
  | 'regex';

export type FieldDataType = 'text' | 'number' | 'date' | 'boolean' | 'array';

interface ColumnSearchFilterProps {
  columnKey: string;
  columnHeader: string;
  searchFields: SearchField[];
  onSearch: (columnKey: string, term: string, field: string, method: SearchMethod) => void;
  initialValue?: string;
  onClose?: () => void;
  fieldDataType?: FieldDataType;
  recentSearches?: string[];
}

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
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [selectedField, setSelectedField] = useState<string>(
    searchFields.length > 0 ? (searchFields[0].path || searchFields[0].key) : columnKey
  );
  const [searchMethod, setSearchMethod] = useState<EnhancedSearchMethod>('contains');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const recentSearchesRef = useRef<HTMLDivElement>(null);
  
  const initialState = useRef({
    term: '',
    field: selectedField,
    method: 'contains' as EnhancedSearchMethod
  });
  
  const limitedRecentSearches = recentSearches.slice(0, 10);
  
  useEffect(() => {
    if (searchFields.length > 0) {
      setSelectedField(searchFields[0].path || searchFields[0].key);
    }
  }, [searchFields]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        recentSearchesRef.current && 
        !recentSearchesRef.current.contains(event.target as Node) &&
        !searchInputRef.current?.contains(event.target as Node)
      ) {
        setShowRecentSearches(false);
      }
    }
    
    if (showRecentSearches) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRecentSearches]);

  const handleSearch = () => {
    if (searchTerm === "" && !['isEmpty', 'isNotEmpty'].includes(searchMethod)) {
      onSearch(columnKey, null, selectedField, searchMethod as SearchMethod);
      
      if (onClose) {
        onClose();
      }
      return;
    }
    
    if (['isEmpty', 'isNotEmpty'].includes(searchMethod)) {
      onSearch(columnKey, '', selectedField, searchMethod as SearchMethod);
    } else {
      onSearch(columnKey, searchTerm, selectedField, searchMethod as SearchMethod);
    }
    
    if ((initialValue === '' || initialValue === null) && (searchTerm === '' || searchTerm === null)) {
      onSearch(columnKey, null, selectedField, 'contains');
    } 
    else if (typeof initialValue === 'object' && initialValue !== null) {
      const config = initialValue as any;
      if (config.term !== undefined && config.field !== undefined && config.method !== undefined) {
        // Keep the current filter as is
      }
    }
    
    if (onClose) {
      onClose();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchMethod('contains');
    setCaseSensitive(false);
    onSearch(columnKey, null, selectedField, 'contains');
    if (onClose) {
      onClose();
    }
  };

  const handleClose = () => {
    if (onClose) {
      const config = initialValue as any;
      if (config.term !== undefined && config.field !== undefined && config.method !== undefined) {
        // Keep the current filter as is
      }
      
      onClose();
    }
  };

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

  const handleRecentSearchSelect = (term: string) => {
    setSearchTerm(term);
    setShowRecentSearches(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const toggleRecentSearches = () => {
    setShowRecentSearches(!showRecentSearches);
  };

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

  const getMethodOptions = () => {
    const commonOptions = [
      { value: 'contains', label: 'Contains' },
      { value: 'equals', label: 'Equals' },
      { value: 'startsWith', label: 'Starts with' },
      { value: 'endsWith', label: 'Ends with' },
      { value: 'notContains', label: 'Does not contain' },
      { value: 'isEmpty', label: 'Is empty' },
      { value: 'isNotEmpty', label: 'Is not empty' }
    ];
    
    if (fieldDataType === 'text') {
      commonOptions.push({ value: 'regex', label: 'Regular expression' });
    }
    
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

  const methodOptions = getMethodOptions();
  const selectedFieldLabel = searchFields.find(f => (f.path || f.key) === selectedField)?.label || columnHeader;
  const needsInputField = !['isEmpty', 'isNotEmpty'].includes(searchMethod);

  useEffect(() => {
    if (typeof initialValue === 'object' && initialValue !== null) {
      const config = initialValue as any;
      if (config.term !== undefined) {
        setSearchTerm(config.term || '');
        initialState.current.term = config.term || '';
      }
      if (config.field !== undefined && searchFields.some(f => (f.path || f.key) === config.field)) {
        setSelectedField(config.field);
        initialState.current.field = config.field;
      }
      if (config.method !== undefined) {
        setSearchMethod(config.method as EnhancedSearchMethod);
        initialState.current.method = config.method as EnhancedSearchMethod;
      }
    } else if (typeof initialValue === 'string') {
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
              value={searchTerm}
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