/**
 * Interfaces for the Filter component
 */

/**
 * Represents a single filter option that can be selected
 */
export interface FilterOption {
  id: string | number;
  label: string;
  value: any;
}

/**
 * Represents a group of filter options (e.g., a dropdown of cities, roles, etc.)
 */
export interface FilterGroup {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'checkbox' | 'radio' | 'range' | 'search' | 'date';
  options?: FilterOption[];
  placeholder?: string;
  initialValue?: any;
  icon?: React.ReactNode; // Icon to display with the filter
}

/**
 * Selected filter values mapped by filter group ID
 */
export interface SelectedFilters {
  [filterId: string]: any;
}

/**
 * Props for the main Filter component
 */
export interface FilterProps {
  /**
   * The groups of filters to display
   */
  filterGroups: FilterGroup[];
  
  /**
   * Optional initial values for filters
   */
  initialValues?: SelectedFilters;
  
  /**
   * Callback when filters change
   */
  onFilterChange: (selectedFilters: SelectedFilters) => void;
  
  /**
   * Optional class name for styling
   */
  className?: string;

  /**
   * Optional layout direction (horizontal or vertical)
   */
  layout?: 'horizontal' | 'vertical';

  /**
   * Optional title for the filter section
   */
  title?: string;

  /**
   * Whether to show reset button
   */
  showReset?: boolean;

  /**
   * Whether to require confirmation with a button before applying filters
   */
  requireConfirmation?: boolean;

  /**
   * Text for the apply button
   */
  applyButtonText?: string;

  /**
   * Text for the reset button
   */
  resetButtonText?: string;

  /**
   * Whether to animate filter changes
   */
  animated?: boolean;

  /**
   * Whether to use compact mode
   */
  compact?: boolean;

  /**
   * Custom styles for wrapper and filter items
   */
  styles?: {
    wrapper?: string;
    filterItem?: string;
    select?: string;
    input?: string;
    label?: string;
    button?: string;
    filterControls?: string;
    checkbox?: string;
    radio?: string;
  };
}