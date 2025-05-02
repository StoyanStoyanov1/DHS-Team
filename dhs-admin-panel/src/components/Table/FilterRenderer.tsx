import React from 'react';
import { ITableColumn } from './interfaces';
import ColumnSearchFilter from './ColumnSearchFilter';
import BooleanColumnFilter from './BooleanColumnFilter';
import DateRangeFilter from '../Filter/DateRangeFilter';
import MultiSelectFilter from '../Filter/MultiSelectFilter';

interface FilterRendererProps<T> {
  column: ITableColumn<T>;
  data: T[];
  filterValue: any;
  onFilterValueChange: (value: any) => void;
  onFilterApply: (value: any) => void;
  onFilterClear: () => void;
  onClose: () => void;
}

/**
 * A shared component for rendering filters based on column type.
 * This component is used both by ColumnMenu and TableContextMenu to avoid code duplication.
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

  const handleAdvancedSearch = (columnKey: string, term: string, field: string, method: string) => {
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
          
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={onFilterClear}
              className="px-2 py-1 text-xs border border-gray-200 rounded-md hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              onClick={() => onFilterApply(filterValue)}
              className="px-2 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Apply
            </button>
          </div>
        </div>
      );

    case 'boolean':
      return (
        <div className="p-2">
          <BooleanColumnFilter 
            value={filterValue}
            onChange={onFilterValueChange}
            onApply={onFilterApply}
            onClose={onClose}
            labelTrue={column.labelTrue || 'True'}
            labelFalse={column.labelFalse || 'False'}
            labelAll={column.labelAll || 'All'}
          />
        </div>
      );

    case 'multiselect':
      return (
        <div className="p-2">
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
          />
        </div>
      );

    case 'daterange':
      return (
        <div className="p-2 min-w-[300px]">
          <DateRangeFilter 
            value={filterValue}
            onChange={onFilterValueChange}
            placeholder=""
            defaultOpen={true}
          />
          
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={onFilterClear}
              className="px-2 py-1 text-xs border border-gray-200 rounded-md hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              onClick={() => onFilterApply(filterValue)}
              className="px-2 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Apply
            </button>
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
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              className="w-1/2 p-1.5 border rounded-md text-sm bg-white transition-all duration-200"
              value={filterValue?.min || ''}
              onChange={(e) => {
                onFilterValueChange({
                  ...filterValue || {},
                  min: e.target.value ? Number(e.target.value) : null
                });
              }}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-1/2 p-1.5 border rounded-md text-sm bg-white transition-all duration-200"
              value={filterValue?.max || ''}
              onChange={(e) => {
                onFilterValueChange({
                  ...filterValue || {},
                  max: e.target.value ? Number(e.target.value) : null
                });
              }}
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={onFilterClear}
              className="px-2 py-1 text-xs border border-gray-200 rounded-md hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              onClick={() => onFilterApply(filterValue)}
              className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Apply
            </button>
          </div>
        </div>
      );

    default:
      return (
        <div className="p-2 text-sm text-gray-500">
          No filter available for this column.
        </div>
      );
  }
}