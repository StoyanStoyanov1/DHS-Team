// Re-export the main Table component and its related components
export { default } from './Table';
export * from './interfaces';
export * from './TableService';

// Експлицитно реекспортиране на utils за избягване на конфликта
import * as TableUtils from './utils';
export { TableUtils };

// Re-export hooks for external use
export * from './hooks/useTableSelection';
export * from './hooks/useTableFilters';
export * from './hooks/useTableSort';