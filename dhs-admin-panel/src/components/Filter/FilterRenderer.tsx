import React from 'react';
import { ITableColumn } from '../Table/interfaces';
import ColumnSearchFilter from './ColumnSearchFilter';
import BooleanColumnFilter from './BooleanColumnFilter';
import DateRangeFilter from './DateRangeFilter';
import MultiSelectFilter from './MultiSelectFilter';
import { X, Check, RotateCcw } from 'lucide-react';

/**
 * Props for the FilterRenderer component.
 * @template T - The type of data in the table.
 */
interface FilterRendererProps<T> {
  /** The column configuration for which the filter is being rendered */
  column: ITableColumn<T>;
  /** The data array from the table, used for generating filter options */
  data: T[];
  /** The current filter value for the column */
  filterValue: any;
  /** Callback function to update the filter value */
  onFilterValueChange: (value: any) => void;
  /** Callback function to apply the filter with the current value */
  onFilterApply: (value: any) => void;
  /** Callback function to clear the filter */
  onFilterClear: () => void;
  /** Callback function to close the filter dropdown/modal */
  onClose: () => void;
}

/**
 * A shared component for rendering different types of column filters based on column configuration.
 * 
 * This component dynamically renders the appropriate filter UI based on the column's filterType property.
 * Supported filter types include:
 * - select: Dropdown selection filter
 * - boolean: True/False/All filter
 * - multiselect: Multiple selection filter
 * - daterange: Date range picker filter
 * - search: Text search with advanced options
 * - range: Numeric range filter
 * 
 * This component is used by both ColumnMenu and TableContextMenu to avoid code duplication.
 * 
 * @template T - The type of data in the table.
 */
export default function FilterRenderer<T>({
  column,
  data,
  filterValue,
  onFilterValueChange,
  onFilterApply,
  onFilterClear,
  onClose,
}: FilterRendererProps<T>) {
  const filterOptions = column.getFilterOptions 
    ? column.getFilterOptions(data)
    : column.filterOptions || [];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '' ? null : e.target.value;
    onFilterValueChange(value);
  };

  const handleAdvancedSearch = (columnKey: string, term: string | null, field: string, method: string) => {
    if (term === null || term === '') {
      onFilterValueChange(null);
      return;
    }

    const searchConfig = {
      term: term,
      field: field || columnKey,
      method: method || 'contains'
    };

    onFilterValueChange(searchConfig);
    onFilterApply(searchConfig);
  };

  switch (column.filterType) {
    case 'select':
      return (
        <div className="p-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Select value</label>
          <select
            className="w-full p-1.5 border rounded-md text-sm bg-white transition-all duration-200"
            value={filterValue || ''}
            onChange={handleSelectChange}
          >
            <option value="">All</option>
            {filterOptions.map((option) => (
              <option key={option.id} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex justify-between items-center gap-2 mt-3">
            <button
              onClick={onFilterClear}
              className="px-2 py-1 text-xs flex items-center text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={12} className="mr-1" />
              Reset
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-2 py-1 text-xs flex items-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <X size={12} className="mr-1" />
                Cancel
              </button>
              <button
                onClick={() => onFilterApply(filterValue)}
                className="px-2 py-1 text-xs flex items-center bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Check size={12} className="mr-1" />
                Apply
              </button>
            </div>
          </div>
        </div>
      );

    case 'boolean':
      return (
          <BooleanColumnFilter 
            value={filterValue}
            onChange={onFilterValueChange}
            onApply={onFilterApply}
            onClose={onClose}
            labelTrue={column.labelTrue || 'True'}
            labelFalse={column.labelFalse || 'False'}
            labelAll={column.labelAll || 'All'}
          />
      );

    case 'multiselect':
      return (
          <MultiSelectFilter
            options={filterOptions}
            value={Array.isArray(filterValue) ? filterValue : []}
            onChange={onFilterValueChange}
            onApply={(value) => {
              if (value === null || (Array.isArray(value) && value.length === 0)) {
                onFilterApply(null);
              } else {
                onFilterApply(value);
              }
            }}
            onClose={onClose}
            defaultSelectAll={column.defaultSelectAll !== false}
            columnName={column.key}
          />
      );

    case 'daterange':
      return (
        <div className="p-2 min-w-[300px]">
          <label className="block text-xs font-medium text-gray-700 mb-1">Select date range</label>
          <DateRangeFilter 
            value={filterValue}
            onChange={onFilterValueChange}
            placeholder=""
            defaultOpen={true}
          />

          <div className="flex justify-between items-center gap-2 mt-3">
            <button
              onClick={onFilterClear}
              className="px-2 py-1 text-xs flex items-center text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={12} className="mr-1" />
              Reset
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-2 py-1 text-xs flex items-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <X size={12} className="mr-1" />
                Cancel
              </button>
              <button
                onClick={() => onFilterApply(filterValue)}
                className="px-2 py-1 text-xs flex items-center bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Check size={12} className="mr-1" />
                Apply
              </button>
            </div>
          </div>
        </div>
      );

    case 'search':
      return (
        <div className="p-2">
          <ColumnSearchFilter
            columnKey={column.key}
            columnHeader={column.header}
            searchFields={column.searchFields || [{ key: column.key, label: column.header, path: column.key }]}
            onSearch={handleAdvancedSearch}
            initialValue={filterValue || ''}
            onClose={onClose}
            fieldDataType={column.fieldDataType || 'text'}
            recentSearches={column.recentSearches || []}
          />
        </div>
      );

    case 'range':
      return (
        <div className="p-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">Enter value range</label>
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-xs text-gray-500 mb-1">Minimum</label>
              <input
                type="number"
                placeholder="Min"
                className="w-full p-1.5 border rounded-md text-sm bg-white transition-all duration-200"
                value={filterValue?.min || ''}
                onChange={(e) => {
                  onFilterValueChange({
                    ...filterValue || {},
                    min: e.target.value ? Number(e.target.value) : null
                  });
                }}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-xs text-gray-500 mb-1">Maximum</label>
              <input
                type="number"
                placeholder="Max"
                className="w-full p-1.5 border rounded-md text-sm bg-white transition-all duration-200"
                value={filterValue?.max || ''}
                onChange={(e) => {
                  onFilterValueChange({
                    ...filterValue || {},
                    max: e.target.value ? Number(e.target.value) : null
                  });
                }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center gap-2 mt-3">
            <button
              onClick={onFilterClear}
              className="px-2 py-1 text-xs flex items-center text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={12} className="mr-1" />
              Reset
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-2 py-1 text-xs flex items-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <X size={12} className="mr-1" />
                Cancel
              </button>
              <button
                onClick={() => onFilterApply(filterValue)}
                className="px-2 py-1 text-xs flex items-center bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Check size={12} className="mr-1" />
                Apply
              </button>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="p-2 text-sm text-gray-600">
          No filter available for this column.
        </div>
      );
  }
}
