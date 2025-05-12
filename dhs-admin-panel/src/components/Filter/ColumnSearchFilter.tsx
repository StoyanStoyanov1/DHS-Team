import React, { useState, useEffect, useRef } from 'react';
import { SearchMethod, SearchField } from '../Table/interfaces';
import { 
  Search, ChevronDown, X, Check, Clock, 
  SlidersHorizontal, PlusCircle, Hash, Calendar
} from 'lucide-react';

export type EnhancedSearchMethod = 
  | 'contains' | 'equals' | 'startsWith' | 'endsWith'  
  | 'notContains' | 'isEmpty' | 'isNotEmpty' | 'regex';        

export type FieldDataType = 'text' | 'number' | 'date' | 'boolean' | 'array';

interface ColumnSearchFilterProps {
  columnKey: string;
  columnHeader: string;
  searchFields: SearchField[];
  onSearch: (columnKey: string, term: string | null, field: string, method: SearchMethod) => void;
  initialValue?: string | null;
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
  const [searchTerm, setSearchTerm] = useState<string | null>(initialValue);
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

  const limitedRecentSearches = recentSearches.slice(0, 5);

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
      if (onClose) onClose();
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

    if (onClose) onClose();
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchMethod('contains');
    setCaseSensitive(false);
    onSearch(columnKey, null, selectedField, 'contains');
    if (onClose) onClose();
  };

  const handleClose = () => {
    if (onClose) onClose();
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

  const getDataTypeIcon = () => {
    switch (fieldDataType) {
      case 'number': return <Hash size={14} className="text-blue-500 dark:text-blue-400" />;
      case 'date': return <Calendar size={14} className="text-green-500 dark:text-green-400" />;
      case 'boolean': return <Check size={14} className="text-purple-500 dark:text-purple-400" />;
      case 'array': return <PlusCircle size={14} className="text-amber-500 dark:text-amber-400" />;
      default: return <Search size={14} className="text-blue-500 dark:text-blue-400" />;
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
    } 
    else if (typeof initialValue === 'string') {
      setSearchTerm(initialValue);
      initialState.current.term = initialValue;
    }
  }, [initialValue, searchFields]);

  return (
    <div className="w-64 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header with close button */}
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-850 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          {getDataTypeIcon()}
          <span className="ml-1.5 text-xs font-medium text-gray-700 dark:text-gray-200">{columnHeader}</span>
        </div>
        {onClose && (
          <button 
            onClick={handleClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="close"
          >
            <X size={14} />
          </button>
        )}
      </div>
      
      {/* Main content */}
      <div className="p-3 space-y-2.5 dark:bg-gray-800">
        {/* Search input at the top */}
        {needsInputField && (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
              <Search size={14} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder={`Search in ${selectedField ? searchFields.find(f => f.path === selectedField)?.label || selectedField : columnHeader}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-blue-400 dark:focus:border-blue-400"
            />
            {searchTerm && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                <button
                  onClick={() => setSearchTerm('')}
                  className="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            
            {/* Recent searches dropdown */}
            {showRecentSearches && recentSearches.length > 0 && (
              <div className="absolute w-full mt-1 bg-white dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 shadow-md z-10">
                <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-gray-100 dark:border-gray-600">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Recent searches</span>
                  <button 
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => setShowRecentSearches(false)}
                  >
                    <X size={12} />
                  </button>
                </div>
                <div className="py-1">
                  {limitedRecentSearches.map((term, index) => (
                    <button
                      key={index}
                      className="flex items-center w-full px-2.5 py-1.5 text-xs text-left hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-gray-200"
                      onClick={() => handleRecentSearchSelect(term)}
                    >
                      <Clock size={12} className="text-gray-400 dark:text-gray-500 mr-1.5 flex-shrink-0" />
                      <span className="truncate">{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Search fields selector (only if multiple fields available) */}
        {searchFields.length > 1 && (
          <div>
            <label htmlFor="search-field" className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Search in field:
            </label>
            <div className="relative">
              <select
                id="search-field"
                className="block w-full pl-2.5 pr-7 py-1.5 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-200 rounded-md 
                  focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 appearance-none"
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
                <ChevronDown size={14} className="text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {/* Match condition selector */}
        <div>
          <label htmlFor="search-method" className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
            Match condition:
          </label>
          <div className="relative">
            <select
              id="search-method"
              className="block w-full pl-2.5 pr-7 py-1.5 text-xs border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-200 rounded-md 
                focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 appearance-none"
              value={searchMethod}
              onChange={(e) => setSearchMethod(e.target.value as EnhancedSearchMethod)}
            >
              {methodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown size={14} className="text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </div>

        {/* Advanced options toggle */}
        <button
          type="button"
          className="flex items-center text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
        >
          <SlidersHorizontal size={12} className="mr-1" />
          {showAdvancedOptions ? 'Hide options' : 'Show options'}
        </button>

        {/* Advanced options */}
        {showAdvancedOptions && fieldDataType === 'text' && (
          <div className="pt-1 pb-1 px-2 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
            <div className="flex items-center py-1">
              <input
                id="case-sensitive"
                type="checkbox"
                className="h-3.5 w-3.5 text-blue-600 dark:text-blue-500 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
              />
              <label htmlFor="case-sensitive" className="ml-1.5 block text-xs text-gray-700 dark:text-gray-300">
                Case sensitive
              </label>
            </div>
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-850 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2">
        <button
          type="button"
          className="px-2.5 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md 
            hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
          onClick={handleClear}
        >
          Clear
        </button>
        <button
          type="button"
          className="px-2.5 py-1 text-xs font-medium text-white bg-blue-600 dark:bg-blue-700 border border-blue-600 dark:border-blue-700 rounded-md 
            hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}