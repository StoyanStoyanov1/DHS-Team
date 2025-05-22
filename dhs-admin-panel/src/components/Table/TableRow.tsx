import React, { useState, useEffect, useRef } from 'react';
import { ITableColumn } from './interfaces';

interface TableRowProps<T> {
  item: T;
  keyExtractor: (item: T) => string | number;
  visibleColumns: ITableColumn<T>[];
  rowClassName?: string | ((item: T) => string);
  showSelectionColumn?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onContextMenu?: (e: React.MouseEvent, item: T, column?: ITableColumn<T>) => void;
  rowIndex: number;
  onBulkEdit?: (selectedItems: T[], columnKey: string, newValue: any) => Promise<void>;
}

function TableRow<T>({
  item,
  keyExtractor,
  visibleColumns,
  rowClassName = '',
  showSelectionColumn = false,
  isSelected = false,
  onToggleSelect,
  onContextMenu,
  rowIndex,
  onBulkEdit,
}: TableRowProps<T>) {
  // State to track which cell is being edited
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [dropdownOptions, setDropdownOptions] = useState<Array<{id: string | number; label: string; value: any}>>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);

  // State for date editing
  const [dateValue, setDateValue] = useState<{ start?: Date | null; end?: Date | null } | null>(null);

  // Refs for dropdown and date picker to detect clicks outside
  const dropdownRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Apply alternating row background colors - improving dark mode with more appropriate colors
  const alternatingRowClass = isSelected 
    ? '' // Don't apply alternating colors to selected rows
    : (rowIndex % 2 === 0 
      ? 'bg-white dark:bg-gray-900' 
      : 'bg-gray-100 dark:bg-gray-850');

  // Calculate dynamic row class name
  const dynamicRowClass = typeof rowClassName === 'function' 
    ? rowClassName(item) 
    : rowClassName;

  // Determine if the row is selected
  const selectedRowClass = isSelected 
    ? '!bg-indigo-50 dark:!bg-indigo-900/30 border-indigo-500 dark:border-indigo-400 shadow-sm' 
    : '';

  // Effect to reset editing state when item changes (table refresh)
  useEffect(() => {
    // Reset editing state when the item changes (e.g., when table is refreshed)
    setEditingCell(null);
    setIsDropdownOpen(false);
    setDateValue(null);
  }, [item]);

  // Effect to load dropdown options when editing a role, enum, or boolean field
  useEffect(() => {
    if (editingCell) {
      const column = visibleColumns.find(col => col.key === editingCell);
      if (column && (column.fieldDataType === 'enum' || column.fieldDataType === 'role' || column.fieldDataType === 'boolean')) {
        // If filterOptions are provided, use them
        if (column.filterOptions && column.filterOptions.length > 0) {
          setDropdownOptions(column.filterOptions);
        } 
        // If getFilterOptions function is provided, use it to generate options from data
        else if (column.getFilterOptions) {
          const options = column.getFilterOptions([item]);
          setDropdownOptions(options);
        }
        // For boolean type, create true/false options with labels from column
        else if (column.fieldDataType === 'boolean') {
          setDropdownOptions([
            { id: 'true', label: column.labelTrue || 'Active', value: 'true' },
            { id: 'false', label: column.labelFalse || 'Inactive', value: 'false' }
          ]);
        }
        // Default options for roles if none provided
        else if (column.fieldDataType === 'role') {
          // Fetch from external API or use default roles
          // This would ideally be replaced with an API call
          setDropdownOptions([
            { id: 'admin', label: 'Admin', value: 'admin' },
            { id: 'user', label: 'User', value: 'user' },
            { id: 'editor', label: 'Editor', value: 'editor' },
            { id: 'viewer', label: 'Viewer', value: 'viewer' }
          ]);
        }
      }
    } else {
      setIsDropdownOpen(false);
    }
  }, [editingCell, item, visibleColumns]);

  // Effect to handle clicks outside the dropdown and date picker, and keyboard events
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Handle clicks outside dropdown
      if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Close the dropdown and exit edit mode without applying changes
        setIsDropdownOpen(false);
        setEditingCell(null);
        setFocusedOptionIndex(-1);
      }

      // Handle clicks outside date picker
      const currentColumn = editingCell ? visibleColumns.find(col => col.key === editingCell) : null;
      if (currentColumn && currentColumn.fieldDataType === 'date') {
        // We don't close the date picker when clicking inside the calendar
        // This allows the user to interact with the calendar without it closing
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (isDropdownOpen && editingCell) {
        if (event.key === 'Enter') {
          if (focusedOptionIndex >= 0 && focusedOptionIndex < dropdownOptions.length) {
            // If an option is focused, select it
            setEditValue(dropdownOptions[focusedOptionIndex].value);
            if (onBulkEdit) {
              const column = visibleColumns.find(col => col.key === editingCell);
              // Convert string 'true'/'false' to boolean for boolean fields
              const finalValue = column && column.fieldDataType === 'boolean' 
                ? dropdownOptions[focusedOptionIndex].value === 'true' 
                : dropdownOptions[focusedOptionIndex].value;
              onBulkEdit([item], editingCell, finalValue);
            }
          } else if (onBulkEdit) {
            // Otherwise use the current edit value
            const column = visibleColumns.find(col => col.key === editingCell);
            // Convert string 'true'/'false' to boolean for boolean fields
            const finalValue = column && column.fieldDataType === 'boolean' 
              ? editValue === 'true' 
              : editValue;
            onBulkEdit([item], editingCell, finalValue);
          }
          setIsDropdownOpen(false);
          setEditingCell(null);
          setFocusedOptionIndex(-1);
          event.preventDefault();
        } else if (event.key === 'Escape') {
          setIsDropdownOpen(false);
          setEditingCell(null);
          setFocusedOptionIndex(-1);
          event.preventDefault();
        } else if (event.key === 'ArrowDown') {
          // Move focus to the next option
          setFocusedOptionIndex(prevIndex => {
            const nextIndex = prevIndex < dropdownOptions.length - 1 ? prevIndex + 1 : 0;
            // Scroll the option into view if needed
            const optionElement = document.getElementById(`dropdown-option-${nextIndex}`);
            if (optionElement) {
              optionElement.scrollIntoView({ block: 'nearest' });
            }
            return nextIndex;
          });
          event.preventDefault();
        } else if (event.key === 'ArrowUp') {
          // Move focus to the previous option
          setFocusedOptionIndex(prevIndex => {
            const nextIndex = prevIndex > 0 ? prevIndex - 1 : dropdownOptions.length - 1;
            // Scroll the option into view if needed
            const optionElement = document.getElementById(`dropdown-option-${nextIndex}`);
            if (optionElement) {
              optionElement.scrollIntoView({ block: 'nearest' });
            }
            return nextIndex;
          });
          event.preventDefault();
        }
      }
    }

    // Add event listeners when dropdown is open
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    // Clean up the event listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen, editingCell, editValue, item, onBulkEdit, dropdownOptions, focusedOptionIndex]);

  return (
    <tr 
      className={`group transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50 ${alternatingRowClass} ${dynamicRowClass} ${selectedRowClass}`}
      onClick={(e) => {
        // Handle row click logic if needed
      }}
      onContextMenu={(e) => onContextMenu && onContextMenu(e, item)}
    >
      {showSelectionColumn && (
        <td 
          className="w-12 px-4 py-3 whitespace-nowrap border-r border-gray-200 dark:border-gray-700"
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onContextMenu) {
              onContextMenu(e, item);
            }
          }}
        >
          <div className="flex items-center justify-center">
            <div className="relative">
              <input
                type="checkbox"
                className="h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                checked:border-indigo-500 checked:bg-indigo-500 dark:checked:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  if (onToggleSelect) onToggleSelect();
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <div className={`pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                <svg className="h-3 w-3 fill-white stroke-white" viewBox="0 0 16 16">
                  <path d="M4 8l3 3 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </td>
      )}

      {visibleColumns.map((column) => (
        <td 
          key={`${keyExtractor(item)}-${column.key}`}
          className={`px-6 py-4 whitespace-nowrap transition-colors ${column.className || ''} ${
            isSelected 
              ? 'text-indigo-900 dark:text-white font-medium' 
              : 'text-gray-700 dark:text-white'
          } group-hover:text-gray-900 dark:group-hover:text-white`}
          onContextMenu={(e) => {
            e.preventDefault();
            if (onContextMenu) {
              onContextMenu(e, item, column);
            }
          }}
          onDoubleClick={() => {
            // Enable editing for text, enum, role, boolean, and date type columns
            // For role, enum, boolean, and date types, allow editing even if there's a render function
            if (column.fieldDataType === 'text' && !column.render) {
              setEditingCell(column.key);
              setEditValue((item as any)[column.key] || '');
            } else if (column.fieldDataType === 'enum' || column.fieldDataType === 'role' || column.fieldDataType === 'boolean') {
              setEditingCell(column.key);
              setEditValue(String((item as any)[column.key])); // Convert boolean to string
              setFocusedOptionIndex(-1); // Reset focused option index
              setIsDropdownOpen(true);
            } else if (column.fieldDataType === 'date') {
              // For date fields, open the calendar
              setEditingCell(column.key);
              const currentDate = (item as any)[column.key] ? new Date((item as any)[column.key]) : new Date();
              setDateValue({ start: currentDate, end: null });
            }
          }}
        >
          {editingCell === column.key ? (
            (() => {
              const currentColumn = visibleColumns.find(col => col.key === editingCell);

              // For date type, show a standard HTML date input with confirm button
              if (currentColumn && currentColumn.fieldDataType === 'date') {
                // Format the date as YYYY-MM-DD for the HTML date input
                const formatDateForInput = (date: Date | null | undefined) => {
                  if (!date) return '';
                  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
                };

                const initialDate = dateValue?.start ? formatDateForInput(dateValue.start) : '';

                const applyDateChange = () => {
                  if (dateValue?.start && onBulkEdit) {
                    onBulkEdit([item], editingCell, dateValue.start);
                  }
                  setEditingCell(null);
                };

                return (
                  <div className="relative" ref={datePickerRef}>
                    <div className="flex items-center">
                      <input
                        type="date"
                        className="w-40 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        value={initialDate}
                        onChange={(e) => {
                          const newDate = e.target.value ? new Date(e.target.value) : null;
                          setDateValue(newDate ? { start: newDate, end: null } : null);
                          // No immediate update, just store the selected date
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            applyDateChange();
                          } else if (e.key === 'Escape') {
                            setEditingCell(null);
                          }
                        }}
                        autoFocus
                      />
                    </div>
                  </div>
                );
              }
              // For enum, role, and boolean types, show a dropdown
              else if (currentColumn && (currentColumn.fieldDataType === 'enum' || currentColumn.fieldDataType === 'role' || currentColumn.fieldDataType === 'boolean')) {
                return (
                  <div 
                    className="relative" 
                    ref={dropdownRef}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (onBulkEdit && editingCell) {
                          onBulkEdit([item], editingCell, editValue);
                        }
                        setIsDropdownOpen(false);
                        setEditingCell(null);
                      } else if (e.key === 'Escape') {
                        setIsDropdownOpen(false);
                        setEditingCell(null);
                      }
                    }}
                    tabIndex={0}>
                    <button
                      type="button"
                      className="w-auto min-w-[120px] max-w-[200px] px-3 py-1 text-left border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all"
                      onClick={() => {
                        if (!isDropdownOpen) {
                          setFocusedOptionIndex(-1); // Reset focused option index when opening
                        }
                        setIsDropdownOpen(!isDropdownOpen);
                      }}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (onBulkEdit && editingCell) {
                            const column = visibleColumns.find(col => col.key === editingCell);
                            // Convert string 'true'/'false' to boolean for boolean fields
                            const finalValue = column && column.fieldDataType === 'boolean' 
                              ? editValue === 'true' 
                              : editValue;
                            onBulkEdit([item], editingCell, finalValue);
                          }
                          setIsDropdownOpen(false);
                          setEditingCell(null);
                        } else if (e.key === 'Escape') {
                          setIsDropdownOpen(false);
                          setEditingCell(null);
                        }
                      }}
                    >
                      <span>{editValue || 'Select option'}</span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-auto min-w-[120px] max-w-[200px] bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                        <ul className="py-1">
                          {dropdownOptions.map((option, index) => (
                            <li
                              id={`dropdown-option-${index}`}
                              key={option.id}
                              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 
                                ${editValue === option.value ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100' : ''} 
                                ${focusedOptionIndex === index ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100' : 'text-gray-900 dark:text-white'}`}
                              onClick={() => {
                                setEditValue(option.value);
                                setFocusedOptionIndex(index);
                                // Keep dropdown open and don't end editing mode
                                // Note: We don't call onBulkEdit here because we want to keep the dropdown open
                                // The actual save happens when the user presses Enter
                              }}
                              onMouseEnter={() => setFocusedOptionIndex(index)}
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setEditValue(option.value);
                                  if (onBulkEdit && editingCell) {
                                    const column = visibleColumns.find(col => col.key === editingCell);
                                    // Convert string 'true'/'false' to boolean for boolean fields
                                    const finalValue = column && column.fieldDataType === 'boolean' 
                                      ? option.value === 'true' 
                                      : option.value;
                                    onBulkEdit([item], editingCell, finalValue);
                                  }
                                  setIsDropdownOpen(false);
                                  setEditingCell(null);
                                  setFocusedOptionIndex(-1);
                                } else if (e.key === 'Escape') {
                                  setIsDropdownOpen(false);
                                  setEditingCell(null);
                                  setFocusedOptionIndex(-1);
                                }
                              }}
                            >
                              <div className="flex items-center">
                                <span className="block truncate font-medium">{option.label}</span>
                                {editValue === option.value && (
                                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 dark:text-indigo-400">
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              }

              // For text type, show a text input
              return (
                <input
                  type="text"
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => {
                    if (onBulkEdit && editingCell) {
                      const column = visibleColumns.find(col => col.key === editingCell);
                      // Convert string 'true'/'false' to boolean for boolean fields
                      const finalValue = column && column.fieldDataType === 'boolean' 
                        ? editValue === 'true' 
                        : editValue;
                      onBulkEdit([item], editingCell, finalValue);
                    }
                    setEditingCell(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (onBulkEdit && editingCell) {
                        const column = visibleColumns.find(col => col.key === editingCell);
                        // Convert string 'true'/'false' to boolean for boolean fields
                        const finalValue = column && column.fieldDataType === 'boolean' 
                          ? editValue === 'true' 
                          : editValue;
                        onBulkEdit([item], editingCell, finalValue);
                      }
                      setEditingCell(null);
                    } else if (e.key === 'Escape') {
                      setEditingCell(null);
                    }
                  }}
                  autoFocus
                />
              );
            })()
          ) : (
            column.render ? column.render(item) : 
              // For boolean fields, display the user-friendly label
              column.fieldDataType === 'boolean' ? 
                (item as any)[column.key] ? (column.labelTrue || 'Active') : (column.labelFalse || 'Inactive') :
              // For date fields, format the date
              column.fieldDataType === 'date' && (item as any)[column.key] ?
                new Date((item as any)[column.key]).toLocaleDateString('bg-BG', { day: '2-digit', month: '2-digit', year: 'numeric' }) :
                (item as any)[column.key]
          )}
        </td>
      ))}
    </tr>
  );
}

export default TableRow;
