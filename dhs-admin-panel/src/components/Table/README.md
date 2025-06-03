# Table Component

## Overview

The Table component is a powerful, feature-rich data table for React applications. It provides a comprehensive solution for displaying, sorting, filtering, and manipulating tabular data with a modern, responsive design.

## Features

- **Data Display**: Render tabular data with customizable columns and cell rendering
- **Sorting**: Single and multi-column sorting with custom sort functions
- **Filtering**: Advanced filtering capabilities with multiple filter types
- **Pagination**: Built-in pagination with customizable page sizes
- **Selection**: Row selection with bulk actions
- **CRUD Operations**: Add, edit, and delete functionality
- **Export**: Export data to CSV, PDF, and print
- **Appearance**: Customizable themes, density, grid lines, and more
- **Context Menu**: Right-click context menu for additional actions
- **Responsive**: Adapts to different screen sizes
- **Accessibility**: Keyboard navigation and screen reader support

## Installation

The Table component is part of the DHS Admin Panel and is available as an internal component.

## Basic Usage

```tsx
import { Table } from 'components/Table';
import { useState } from 'react';

// Define your data
const data = [
  { id: 1, name: 'John Doe', age: 30, role: 'Developer' },
  { id: 2, name: 'Jane Smith', age: 25, role: 'Designer' },
  // ...more data
];

// Define your columns
const columns = [
  { header: 'ID', key: 'id', sortable: true },
  { header: 'Name', key: 'name', sortable: true },
  { header: 'Age', key: 'age', sortable: true, fieldDataType: 'number' },
  { header: 'Role', key: 'role', sortable: true },
];

function MyComponent() {
  // Optional: Track selected items
  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <Table
      data={data}
      columns={columns}
      keyExtractor={(item) => item.id}
      pagination={true}
      itemsPerPage={10}
      selectedItems={selectedItems}
      onSelectionChange={setSelectedItems}
      onEdit={(item) => console.log('Edit', item)}
      onDelete={(item) => console.log('Delete', item)}
    />
  );
}
```

## Advanced Usage

### Custom Cell Rendering

```tsx
const columns = [
  // ...other columns
  {
    header: 'Status',
    key: 'status',
    render: (item) => (
      <span className={`status-badge ${item.status.toLowerCase()}`}>
        {item.status}
      </span>
    ),
  },
];
```

### Custom Filtering

```tsx
const columns = [
  // ...other columns
  {
    header: 'Role',
    key: 'role',
    filterable: true,
    filterType: 'select',
    filterOptions: [
      { id: 'dev', label: 'Developer', value: 'Developer' },
      { id: 'design', label: 'Designer', value: 'Designer' },
      { id: 'pm', label: 'Project Manager', value: 'Project Manager' },
    ],
  },
];
```

### Bulk Edit

```tsx
const editableColumns = [
  { key: 'role', label: 'Role', type: 'select', options: ['Developer', 'Designer', 'Manager'] },
  { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
];

function handleBulkEdit(selectedItems, columnKey, newValue) {
  // Update the items in your data source
  return api.updateItems(selectedItems.map(item => item.id), { [columnKey]: newValue });
}

<Table
  // ...other props
  editableColumns={editableColumns}
  onBulkEdit={handleBulkEdit}
/>
```

## API Reference

### Table Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array<T>` | Required | The data to display in the table |
| `columns` | `Array<ITableColumn<T>>` | Required | Configuration for table columns |
| `keyExtractor` | `(item: T) => string \| number` | Required | Function to extract a unique key from each item |
| `emptyMessage` | `string` | "No data available" | Message to display when there's no data |
| `className` | `string` | "" | Additional CSS class for the table |
| `rowClassName` | `string \| (item: T) => string` | "" | CSS class for table rows |
| `pagination` | `boolean` | `true` | Whether to enable pagination |
| `itemsPerPage` | `number` | 10 | Number of items per page |
| `setItemsPerPage` | `(size: number) => void` | - | Callback when page size changes |
| `rowsPerPageOptions` | `number[]` | [10, 15, 25, 50, 100] | Available page size options |
| `currentPage` | `number` | 1 | Current page number |
| `setCurrentPage` | `(page: number) => void` | - | Callback when page changes |
| `defaultSortKey` | `string` | - | Initial sort column key |
| `defaultSortDirection` | `'asc' \| 'desc' \| null` | - | Initial sort direction |
| `defaultSortCriteria` | `Array<{key: string, direction: 'asc' \| 'desc'}>` | [] | Initial multi-sort criteria |
| `multiSort` | `boolean` | `false` | Enable multi-column sorting |
| `selectedItems` | `Array<T>` | - | Currently selected items |
| `onSelectionChange` | `(selectedItems: Array<T>) => void` | - | Callback when selection changes |
| `showSelectionColumn` | `boolean` | `true` | Whether to show the selection column |
| `editableColumns` | `Array<EditableColumn<T>>` | [] | Columns that can be edited in bulk |
| `onBulkEdit` | `(selectedItems: Array<T>, columnKey: string, newValue: any) => Promise<void>` | - | Callback for bulk edit |
| `onEdit` | `(item: T) => void` | - | Callback when an item is edited |
| `onDelete` | `(item: T) => void` | - | Callback when an item is deleted |
| `onAddItem` | `(newItem: T) => Promise<void>` | - | Callback when a new item is added |
| `itemType` | `string` | "items" | Type of items in the table (for UI messages) |
| `density` | `'compact' \| 'normal' \| 'relaxed'` | "normal" | Row density |
| `theme` | `'light' \| 'dark' \| 'site'` | "site" | Table theme |
| `showGridLines` | `boolean` | `false` | Whether to show grid lines |
| `stripedRows` | `boolean` | `false` | Whether to use striped rows |
| `highlightOnHover` | `boolean` | `true` | Whether to highlight rows on hover |
| `stickyHeader` | `boolean` | `false` | Whether to make the header sticky |
| `onExportData` | `(format: 'csv' \| 'excel' \| 'pdf') => void` | - | Custom export handler |
| `onPrint` | `() => void` | - | Custom print handler |

### Column Configuration

The `ITableColumn<T>` interface defines the configuration for each column:

| Property | Type | Description |
|----------|------|-------------|
| `header` | `string` | Column header text |
| `key` | `string` | Unique identifier for the column |
| `render` | `(item: T) => ReactNode` | Custom render function for cell content |
| `className` | `string` | Additional CSS class for the column |
| `sortable` | `boolean` | Whether the column is sortable |
| `sortFn` | `(a: T, b: T, direction: SortDirection) => number` | Custom sort function |
| `filterable` | `boolean` | Whether the column is filterable |
| `filterType` | `'select' \| 'multiselect' \| 'search' \| 'range' \| 'checkbox' \| 'custom' \| 'boolean' \| 'daterange'` | Type of filter to use |
| `filterOptions` | `Array<{ id: string \| number, label: string, value: any }>` | Options for select filters |
| `filterRange` | `{ min: number, max: number }` | Range for range filters |
| `getFilterOptions` | `(data: T[]) => Array<{ id: string \| number, label: string, value: any }>` | Function to generate filter options from data |
| `customFilterComponent` | `(onFilterChange: (key: string, value: any) => void, currentValue: any) => ReactNode` | Custom filter component |
| `hideable` | `boolean` | Whether the column can be hidden |
| `hidden` | `boolean` | Whether the column is initially hidden |
| `fieldDataType` | `'text' \| 'number' \| 'date' \| 'boolean' \| 'array' \| 'enum' \| 'role'` | Data type for the column |
| `required` | `boolean` | Whether the field is required (for add/edit) |
| `minLength` | `number` | Minimum length for text fields |
| `maxLength` | `number` | Maximum length for text fields |
| `pattern` | `RegExp \| string` | Validation pattern for text fields |
| `hideOnCreate` | `boolean` | Whether to hide the field in the create form |
| `defaultValue` | `any` | Default value for the field |
| `validate` | `(value: any) => { isValid: boolean, message?: string } \| boolean` | Custom validation function |

## Architecture

The Table component follows a modular architecture with several key parts:

1. **Table.tsx**: The main component that combines all the parts
2. **TableContext.tsx**: Manages state and provides functionality to all sub-components
3. **Services**: Specialized services for different aspects of the table
   - TableService: Core table functionality
   - TableExportService: Handles data export
   - TableAppearanceService: Manages visual appearance
4. **Hooks**: Custom hooks for specific functionality
   - useTableFilters: Manages filtering
   - useTableSort: Manages sorting
   - useTableSelection: Manages row selection

## Customization

The Table component can be customized in many ways:

- **Appearance**: Use the theme, density, and other appearance props
- **Behavior**: Configure sorting, filtering, pagination, and selection
- **Rendering**: Use custom render functions for cells
- **Functionality**: Implement custom handlers for CRUD operations

## Accessibility

The Table component is designed with accessibility in mind:

- Proper ARIA attributes for screen readers
- Keyboard navigation support
- Sufficient color contrast in all themes
- Focus management for interactive elements

## Browser Support

The Table component supports all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

To contribute to the Table component, please follow the project's contribution guidelines.

## License

This component is part of the DHS Admin Panel and is subject to its licensing terms.