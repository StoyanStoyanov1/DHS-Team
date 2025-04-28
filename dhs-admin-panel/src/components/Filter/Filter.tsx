'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FilterProps, SelectedFilters, FilterGroup } from './interfaces';
import { Search, X, ChevronDown, Filter as FilterIcon, RotateCcw, Sliders, Check, PlusCircle } from 'lucide-react';

/**
 * A modern, abstract, and visually appealing filter component with animations
 * and responsive design for filtering table data.
 */
const Filter: React.FC<FilterProps> = ({
  filterGroups,
  initialValues = {},
  onFilterChange,
  className = '',
  layout = 'horizontal',
  title = 'Filters',
  showReset = true,
  requireConfirmation = true, // Changed default to true
  applyButtonText = 'Apply Filters',
  resetButtonText = 'Reset',
  animated = true,
  compact = false,
  styles = {},
}) => {
  // Track the currently edited filters (before apply button is clicked)
  const [editedFilters, setEditedFilters] = useState<SelectedFilters>({});
  
  // Track the applied filters (only used when requireConfirmation is true)
  const [appliedFilters, setAppliedFilters] = useState<SelectedFilters>({});
  
  // Track which filters have dropdown menus open
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  
  // Track if the entire filter panel is expanded
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Use a ref to track if this is the first render
  const isFirstRender = useRef(true);
  
  // Determine which filters to actually use based on requireConfirmation setting
  const selectedFilters = requireConfirmation ? appliedFilters : editedFilters;
  
  // Count active filters
  const activeFilterCount = Object.values(selectedFilters).filter(
    value => value !== null && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length;
  
  // Initialize filter values from initialValues or default values from filter groups
  useEffect(() => {
    // Skip if not first render to prevent endless loop
    if (!isFirstRender.current) return;
    
    isFirstRender.current = false;
    
    const initialFilters: SelectedFilters = {};
    
    filterGroups.forEach(group => {
      // If initialValues contains a value for this filter, use it
      if (initialValues && initialValues[group.id] !== undefined) {
        initialFilters[group.id] = initialValues[group.id];
      } 
      // Otherwise use the initialValue specified in the group, if any
      else if (group.initialValue !== undefined) {
        initialFilters[group.id] = group.initialValue;
      } 
      // Set default values based on filter type
      else {
        switch (group.type) {
          case 'multiselect':
            initialFilters[group.id] = [];
            break;
          case 'checkbox':
            initialFilters[group.id] = false;
            break;
          case 'search':
            initialFilters[group.id] = '';
            break;
          default:
            initialFilters[group.id] = null;
        }
      }
    });
    
    // Initialize both state variables with deep copies to avoid reference issues
    setEditedFilters({...initialFilters});
    setAppliedFilters({...initialFilters});
  }, []); // Empty dependency array - run only once

  // Use a separate effect to handle filter group changes
  useEffect(() => {
    // Skip the first render since we already initialized
    if (isFirstRender.current) return;
    
    // Create object to track new filter groups that weren't in state before
    const newFilterValues: SelectedFilters = {};
    let hasNewFilters = false;
    
    // Check for new filter groups that need default values
    filterGroups.forEach(group => {
      if (editedFilters[group.id] === undefined) {
        hasNewFilters = true;
        
        if (initialValues && initialValues[group.id] !== undefined) {
          newFilterValues[group.id] = initialValues[group.id];
        } 
        else if (group.initialValue !== undefined) {
          newFilterValues[group.id] = group.initialValue;
        } 
        else {
          switch (group.type) {
            case 'multiselect':
              newFilterValues[group.id] = [];
              break;
            case 'checkbox':
              newFilterValues[group.id] = false;
              break;
            case 'search':
              newFilterValues[group.id] = '';
              break;
            default:
              newFilterValues[group.id] = null;
          }
        }
      }
    });
    
    // Only update state if we have new filters to add
    if (hasNewFilters) {
      setEditedFilters(prev => ({...prev, ...newFilterValues}));
      setAppliedFilters(prev => ({...prev, ...newFilterValues}));
    }
  }, [filterGroups, initialValues, editedFilters]);

  // Use useEffect to notify parent when filters change
  useEffect(() => {
    // Only call onFilterChange if we have filters to report
    // and we're past the first render
    if (!isFirstRender.current && Object.keys(selectedFilters).length > 0) {
      onFilterChange(selectedFilters);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters]); // Dependency is on the actual filters we're using
  
  // Apply the edited filters (when using confirmation mode)
  const handleApplyFilters = useCallback(() => {
    setAppliedFilters({...editedFilters});
  }, [editedFilters]);

  // Handle filter changes (only updates the edited state)
  const handleFilterChange = useCallback((groupId: string, value: any) => {
    setEditedFilters(prev => ({
      ...prev,
      [groupId]: value
    }));
    
    // If not requiring confirmation, also update applied filters
    if (!requireConfirmation) {
      setAppliedFilters(prev => ({
        ...prev,
        [groupId]: value
      }));
    }
  }, [requireConfirmation]);

  // Reset all filters to their initial state
  const handleResetFilters = useCallback(() => {
    const resetFilters: SelectedFilters = {};
    
    filterGroups.forEach(group => {
      if (group.initialValue !== undefined) {
        resetFilters[group.id] = group.initialValue;
      } else {
        switch (group.type) {
          case 'multiselect':
            resetFilters[group.id] = [];
            break;
          case 'checkbox':
            resetFilters[group.id] = false;
            break;
          case 'search':
            resetFilters[group.id] = '';
            break;
          default:
            resetFilters[group.id] = null;
        }
      }
    });
    
    setEditedFilters({...resetFilters});
    // Always update applied filters when resetting
    setAppliedFilters({...resetFilters});
  }, [filterGroups]);

  // Toggle a dropdown's open state
  const toggleDropdown = useCallback((filterId: string) => {
    setOpenDropdowns(prev => {
      const newState = { ...prev };
      // Close all other dropdowns
      Object.keys(newState).forEach(key => {
        if (key !== filterId) newState[key] = false;
      });
      // Toggle the current dropdown
      newState[filterId] = !prev[filterId];
      return newState;
    });
  }, []);

  // Toggle filter panel expansion
  const toggleExpansion = () => {
    setIsExpanded(prev => !prev);
  };

  // Close all dropdowns
  const closeAllDropdowns = useCallback(() => {
    setOpenDropdowns({});
  }, []);

  // Clear a single filter
  const clearFilter = useCallback((filterId: string) => {
    const filter = filterGroups.find(f => f.id === filterId);
    if (!filter) return;
    
    let defaultValue;
    switch (filter.type) {
      case 'multiselect':
        defaultValue = [];
        break;
      case 'checkbox':
        defaultValue = false;
        break;
      case 'search':
        defaultValue = '';
        break;
      default:
        defaultValue = null;
    }
    
    setEditedFilters(prev => ({
      ...prev,
      [filterId]: defaultValue
    }));
    
    if (!requireConfirmation) {
      setAppliedFilters(prev => ({
        ...prev,
        [filterId]: defaultValue
      }));
    }
  }, [filterGroups, requireConfirmation]);

  // Render filter control based on its type
  const renderFilterControl = (filter: FilterGroup) => {
    // Always read from the edited filters, not the applied ones
    const value = editedFilters[filter.id];
    
    // Modern styles with subtle shadows and glows
    const selectBaseStyles = "block w-full rounded-lg border border-gray-200 bg-white text-gray-800 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-30 transition-all shadow-sm";
    const inputBaseStyles = "block w-full rounded-lg border border-gray-200 bg-white text-gray-800 px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-30 transition-all shadow-sm";
    
    const selectStyles = styles.select || selectBaseStyles;
    const inputStyles = styles.input || inputBaseStyles;
    const checkboxStyles = styles.checkbox || "h-5 w-5 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all";
    const radioStyles = styles.radio || "h-5 w-5 border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all";
    
    // Use compact sizing if requested
    const paddingClasses = compact ? 'py-1.5 px-3 text-xs' : 'py-2.5 px-4 text-sm';
    
    switch (filter.type) {
      case 'select':
        return (
          <div className="relative filter-dropdown-container">
            <div 
              className={`flex items-center justify-between cursor-pointer rounded-lg border border-gray-200 bg-white text-gray-800 ${paddingClasses} hover:bg-gray-50 shadow-sm transition-all duration-200`}
              onClick={() => toggleDropdown(filter.id)}
            >
              <span className={`${value ? 'text-gray-900 font-medium' : 'text-gray-400'} transition-all duration-200`}>
                {value 
                  ? filter.options?.find(opt => opt.value === value)?.label 
                  : filter.placeholder || 'Select option'}
              </span>
              <ChevronDown 
                size={16} 
                className={`ml-2 transition-transform duration-300 text-gray-500 ${openDropdowns[filter.id] ? 'rotate-180 text-indigo-600' : ''}`} 
              />
            </div>
            
            {openDropdowns[filter.id] && filter.options && filter.options.length > 0 && (
              <div className="absolute z-30 mt-1 w-full rounded-lg bg-white shadow-lg border border-gray-100 py-1 overflow-auto max-h-60 transition-all duration-300 transform origin-top scale-y-100">
                {filter.options.map(option => (
                  <div
                    key={option.id}
                    className={`${paddingClasses} cursor-pointer group hover:bg-indigo-50 flex items-center transition-all duration-200
                      ${value === option.value ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'}`}
                    onClick={() => {
                      handleFilterChange(filter.id, option.value);
                      toggleDropdown(filter.id);
                    }}
                  >
                    <span className="relative">
                      {value === option.value && (
                        <span className="absolute left-0 top-1/2 -translate-x-6 -translate-y-1/2 flex items-center">
                          <Check size={14} className="text-indigo-600" />
                        </span>
                      )}
                      {option.label}
                    </span>
                    <span className={`ml-auto transform transition-transform duration-300 opacity-0 group-hover:opacity-100 ${value === option.value ? 'opacity-100' : ''}`}>
                      <Check size={14} className={`${value === option.value ? 'text-indigo-600' : 'text-indigo-300'}`} />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        
      case 'multiselect':
        return (
          <div className="relative filter-dropdown-container">
            <div 
              className={`flex items-center justify-between cursor-pointer rounded-lg border border-gray-200 bg-white text-gray-800 ${paddingClasses} hover:bg-gray-50 transition-all duration-200 shadow-sm ${Array.isArray(value) && value.length > 0 ? 'border-indigo-200 bg-indigo-50/30' : ''}`}
              onClick={() => toggleDropdown(filter.id)}
            >
              <div className="flex items-center flex-wrap">
                {Array.isArray(value) && value.length > 0 ? (
                  <div className="flex items-center space-x-1">
                    <span className="flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
                      {value.length}
                    </span>
                    <span className="text-indigo-700 font-medium ml-1.5">selected</span>
                  </div>
                ) : (
                  <span className="text-gray-400">
                    {filter.placeholder || 'Select options'}
                  </span>
                )}
              </div>
              <ChevronDown 
                size={16} 
                className={`ml-2 transition-transform duration-300 ${openDropdowns[filter.id] ? 'rotate-180 text-indigo-600' : 'text-gray-500'}`} 
              />
            </div>
            
            {openDropdowns[filter.id] && filter.options && filter.options.length > 0 && (
              <div className="absolute z-30 mt-1 w-full rounded-lg bg-white shadow-lg border border-gray-100 py-1 overflow-auto max-h-60 transition-all duration-300 transform origin-top">
                {filter.options.map(option => {
                  const isSelected = Array.isArray(value) && value.includes(option.value);
                  return (
                    <div
                      key={option.id}
                      className={`${paddingClasses} cursor-pointer group hover:bg-indigo-50 flex items-center transition-all duration-200
                        ${isSelected ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'}`}
                      onClick={() => {
                        const newValue = isSelected
                          ? value.filter((v: any) => v !== option.value)
                          : [...(Array.isArray(value) ? value : []), option.value];
                        handleFilterChange(filter.id, newValue);
                      }}
                    >
                      <div className={`flex items-center justify-center w-5 h-5 rounded mr-2 border transition-all duration-200
                        ${isSelected 
                          ? 'bg-indigo-600 border-indigo-600 text-white' 
                          : 'border-gray-300 bg-white group-hover:border-indigo-400'}`}
                      >
                        {isSelected && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
        
      case 'checkbox':
        return (
          <div className="flex items-center">
            <div className="relative flex items-center">
              <input
                id={`filter-${filter.id}`}
                type="checkbox"
                className={`sr-only ${checkboxStyles}`}
                checked={value || false}
                onChange={(e) => handleFilterChange(filter.id, e.target.checked)}
              />
              <div 
                className={`w-5 h-5 rounded flex items-center justify-center border transition-all duration-200 ${value ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}
                onClick={() => handleFilterChange(filter.id, !value)}
              >
                {value && <Check size={12} className="text-white" strokeWidth={3} />}
              </div>
              <label 
                htmlFor={`filter-${filter.id}`} 
                className={`ml-2 text-sm cursor-pointer ${value ? 'text-indigo-800 font-medium' : 'text-gray-700'} ${styles.label || ''}`}
                onClick={() => handleFilterChange(filter.id, !value)}
              >
                {filter.placeholder || filter.label}
              </label>
            </div>
          </div>
        );
        
      case 'radio':
        return (
          <div className="space-y-2.5">
            {filter.options?.map(option => {
              const isSelected = value === option.value;
              return (
                <div key={option.id} className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      id={`filter-${filter.id}-${option.id}`}
                      name={`filter-${filter.id}`}
                      type="radio"
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => handleFilterChange(filter.id, option.value)}
                    />
                    <div 
                      className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all duration-200 
                        ${isSelected ? 'border-indigo-600' : 'border-gray-300'}`}
                      onClick={() => handleFilterChange(filter.id, option.value)}
                    >
                      {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                      )}
                    </div>
                    <label 
                      htmlFor={`filter-${filter.id}-${option.id}`} 
                      className={`ml-2 text-sm cursor-pointer ${isSelected ? 'text-indigo-800 font-medium' : 'text-gray-700'} ${styles.label || ''}`}
                      onClick={() => handleFilterChange(filter.id, option.value)}
                    >
                      {option.label}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        );
        
      case 'search':
        return (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              id={`filter-${filter.id}`}
              className={`${inputStyles} pl-10 transition-all duration-200 ${value ? 'pr-10 border-indigo-200 bg-indigo-50/30' : ''}`}
              placeholder={filter.placeholder || `Search ${filter.label}`}
              value={value || ''}
              onChange={(e) => handleFilterChange(filter.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // Apply filter immediately when Enter key is pressed
                  if (requireConfirmation) {
                    handleApplyFilters();
                  }
                  // Close any open dropdowns
                  closeAllDropdowns();
                }
              }}
            />
            {value && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center transition-all duration-200"
                onClick={() => clearFilter(filter.id)}
              >
                <div className="flex items-center justify-center h-5 w-5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                  <X size={12} className="text-gray-600" />
                </div>
              </button>
            )}
          </div>
        );
        
      case 'range':
        return (
          <div className="flex space-x-3 items-center">
            <div className="relative flex-1">
              <input
                type="number"
                id={`filter-${filter.id}-min`}
                className={`${inputStyles} ${value?.min ? 'border-indigo-200 bg-indigo-50/30' : ''}`}
                placeholder="Min"
                value={value?.min || ''}
                onChange={(e) => {
                  const min = e.target.value !== '' ? Number(e.target.value) : null;
                  handleFilterChange(filter.id, { ...value, min });
                }}
              />
            </div>
            <div className="h-px w-4 bg-gray-300"></div>
            <div className="relative flex-1">
              <input
                type="number"
                id={`filter-${filter.id}-max`}
                className={`${inputStyles} ${value?.max ? 'border-indigo-200 bg-indigo-50/30' : ''}`}
                placeholder="Max"
                value={value?.max || ''}
                onChange={(e) => {
                  const max = e.target.value !== '' ? Number(e.target.value) : null;
                  handleFilterChange(filter.id, { ...value, max });
                }}
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Render active filter pills with a modern, animated design
  const renderActiveFilters = () => {
    // Only show if we have active filters
    if (activeFilterCount === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
        {Object.entries(selectedFilters).map(([filterId, value]) => {
          // Skip empty filters
          if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
            return null;
          }
          
          const filter = filterGroups.find(f => f.id === filterId);
          if (!filter) return null;
          
          let label = filter.label;
          let valueDisplay = '';
          
          if (filter.type === 'select') {
            const option = filter.options?.find(opt => opt.value === value);
            valueDisplay = option?.label || String(value);
          } else if (filter.type === 'multiselect' && Array.isArray(value)) {
            valueDisplay = `${value.length}`;
          } else if (filter.type === 'search') {
            valueDisplay = `"${value}"`;
          } else if (filter.type === 'checkbox') {
            valueDisplay = value ? 'Yes' : 'No';
          } else if (filter.type === 'range') {
            const minVal = value.min !== undefined && value.min !== null ? value.min : '—';
            const maxVal = value.max !== undefined && value.max !== null ? value.max : '—';
            valueDisplay = `${minVal} - ${maxVal}`;
          }
          
          return (
            <div 
              key={filterId}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-800 ring-1 ring-inset ring-indigo-200/50 transition-all duration-200 hover:bg-indigo-100 hover:ring-indigo-300/50 group"
            >
              <span className="mr-1.5 text-indigo-500">{label}:</span>
              <span>{valueDisplay}</span>
              <button
                type="button"
                onClick={() => clearFilter(filterId)}
                className="ml-1.5 rounded-full p-0.5 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-200/70 group-hover:bg-indigo-200/70 transition-all duration-200"
                aria-label={`Remove ${filter.label} filter`}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
        
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200"
          >
            <RotateCcw size={12} className="mr-1.5" />
            Clear all
          </button>
        )}
      </div>
    );
  };

  // Base container styles with improved animations
  const animationClass = animated ? 'transition-all duration-300 ease-in-out' : '';
  const wrapperClass = `${styles.wrapper || `rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md ${animationClass}`} ${className}`;
  const filterItemClass = styles.filterItem || (layout === 'horizontal' ? 'mb-0' : 'mb-4 last:mb-0');
  const buttonClass = styles.button || `px-4 py-2 rounded-lg text-sm font-medium ${animationClass} focus:outline-none focus:ring-2 focus:ring-offset-1`;
  
  // Click outside handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-dropdown-container')) {
        closeAllDropdowns();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeAllDropdowns]);
  
  return (
    <div className={wrapperClass} onClick={e => e.stopPropagation()}>
      {(title || showReset) && (
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-indigo-50 text-indigo-600">
              <Sliders size={18} className="text-indigo-600" />
            </div>
            <div className="ml-3 flex items-center">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              {activeFilterCount > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 flex items-center">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={toggleExpansion}
              className="ml-3 flex items-center justify-center h-6 w-6 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
            >
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            {showReset && requireConfirmation && activeFilterCount > 0 && (
              <button
                type="button"
                className={`${buttonClass} bg-white hover:bg-gray-50 text-gray-700 border-gray-200 border font-medium flex items-center`}
                onClick={handleResetFilters}
                aria-label="Reset filters"
              >
                <RotateCcw size={14} className="mr-1.5" />
                {resetButtonText}
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className={`filter-content-wrapper overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className={`p-5 filter-dropdown ${layout === 'horizontal' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5' : 'space-y-5'}`}>
          {filterGroups.map(filter => (
            <div 
              key={filter.id} 
              className={`${filterItemClass} filter-dropdown-container`}
            >
              <label 
                htmlFor={`filter-${filter.id}`} 
                className={`block text-sm font-medium ${styles.label || 'text-gray-700'} mb-1.5 flex items-center`}
              >
                {filter.icon && <span className="mr-2 text-indigo-600">{filter.icon}</span>}
                {filter.label}
              </label>
              {renderFilterControl(filter)}
            </div>
          ))}
        </div>
        
        {renderActiveFilters()}
        
        {/* Always show apply button since we changed requireConfirmation default to true */}
        <div className="p-5 pt-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50 rounded-b-xl">
          {showReset && (
            <button
              type="button"
              className={`${buttonClass} bg-white hover:bg-gray-50 text-gray-700 border-gray-200 border`}
              onClick={handleResetFilters}
            >
              <div className="flex items-center">
                <RotateCcw size={14} className="mr-1.5" />
                {resetButtonText}
              </div>
            </button>
          )}
          <button
            type="button"
            className={`${buttonClass} bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm`}
            onClick={handleApplyFilters}
          >
            <div className="flex items-center">
              <Check size={14} className="mr-1.5" />
              {applyButtonText}
            </div>
          </button>
        </div>
      </div>
      
      {/* Quick filter toggle when collapsed */}
      {!isExpanded && (
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <span>{activeFilterCount > 0 ? `${activeFilterCount} filters applied` : 'No filters applied'}</span>
          </div>
          <button
            type="button"
            onClick={toggleExpansion}
            className="flex items-center justify-center py-1.5 px-3 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium"
          >
            <PlusCircle size={14} className="mr-1.5" />
            Expand Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Filter;