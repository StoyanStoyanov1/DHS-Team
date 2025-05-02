export interface FilterOption {
  id: string | number;
  label: string;
  value: any;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'select' | 'multiselect' | 'checkbox' | 'radio' | 'range' | 'search' | 'date';
  options?: FilterOption[];
  placeholder?: string;
  initialValue?: any;
  icon?: React.ReactNode;
}

export interface SelectedFilters {
  [filterId: string]: any;
}

export interface FilterProps {
  filterGroups: FilterGroup[];
  initialValues?: SelectedFilters;
  onFilterChange: (selectedFilters: SelectedFilters) => void;
  className?: string;
  layout?: 'horizontal' | 'vertical';
  title?: string;
  showReset?: boolean;
  requireConfirmation?: boolean;
  applyButtonText?: string;
  resetButtonText?: string;
  animated?: boolean;
  compact?: boolean;
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