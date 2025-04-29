import React, { useState, useEffect } from 'react';
import { SearchMethod, SearchField } from './interfaces';
import { ChevronDown, Search } from 'lucide-react';

interface ColumnSearchFilterProps {
  columnKey: string;
  columnHeader: string;
  searchFields: SearchField[];
  onSearch: (columnKey: string, term: string, field: string, method: SearchMethod) => void;
  initialValue?: string;
  onClose?: () => void;
}

export default function ColumnSearchFilter({
  columnKey,
  columnHeader,
  searchFields,
  onSearch,
  initialValue = '',
  onClose
}: ColumnSearchFilterProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [selectedField, setSelectedField] = useState<string>(
    searchFields.length > 0 ? (searchFields[0].path || searchFields[0].key) : columnKey
  );
  const [searchMethod, setSearchMethod] = useState<SearchMethod>('contains');
  
  // Reset field when search fields change
  useEffect(() => {
    if (searchFields.length > 0) {
      setSelectedField(searchFields[0].path || searchFields[0].key);
    }
  }, [searchFields]);

  const handleSearch = () => {
    onSearch(columnKey, searchTerm, selectedField, searchMethod);
    if (onClose) {
      onClose();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch(columnKey, '', selectedField, searchMethod);
    if (onClose) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <div className="space-y-3 p-3 bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Search input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={15} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder={`Search ${columnHeader}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>

      {/* Field selector - Only show if we have multiple searchable fields */}
      {searchFields.length > 1 && (
        <div className="relative">
          <label htmlFor="search-field" className="block text-xs font-medium text-gray-700 mb-1">
            Search in:
          </label>
          <div className="relative">
            <select
              id="search-field"
              className="block w-full pl-3 pr-10 py-1.5 text-xs border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
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
              <ChevronDown size={14} className="text-gray-500" />
            </div>
          </div>
        </div>
      )}

      {/* Search method selector */}
      <div className="relative">
        <label htmlFor="search-method" className="block text-xs font-medium text-gray-700 mb-1">
          Search method:
        </label>
        <div className="relative">
          <select
            id="search-method"
            className="block w-full pl-3 pr-10 py-1.5 text-xs border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
            value={searchMethod}
            onChange={(e) => setSearchMethod(e.target.value as SearchMethod)}
          >
            <option value="contains">Contains</option>
            <option value="equals">Equals</option>
            <option value="startsWith">Starts with</option>
            <option value="endsWith">Ends with</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown size={14} className="text-gray-500" />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end pt-1 space-x-2 border-t border-gray-100">
        <button
          type="button"
          className="px-3 py-1.5 text-xs text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={handleClear}
        >
          Clear
        </button>
        <button
          type="button"
          className="px-3 py-1.5 text-xs text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}