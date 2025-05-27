import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Table from '../index';
import { ITableColumn } from '../interfaces';
import { ThemeProvider } from '../../ThemeProvider';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(() => null),
  },
  writable: true
});

describe('Table Comprehensive Tests', () => {
  // Sample data for testing
  const testData = [
    { id: 1, name: 'John Doe', age: 30, status: true, role: 'Admin' },
    { id: 2, name: 'Jane Smith', age: 25, status: false, role: 'User' },
    { id: 3, name: 'Bob Johnson', age: 35, status: true, role: 'Editor' },
    { id: 4, name: 'Alice Brown', age: 28, status: false, role: 'User' },
    { id: 5, name: 'Charlie Davis', age: 40, status: true, role: 'Admin' },
    { id: 6, name: 'Eva Wilson', age: 22, status: false, role: 'User' },
    { id: 7, name: 'Frank Miller', age: 45, status: true, role: 'Editor' },
    { id: 8, name: 'Grace Taylor', age: 33, status: false, role: 'User' },
    { id: 9, name: 'Henry Clark', age: 38, status: true, role: 'Admin' },
    { id: 10, name: 'Ivy Martin', age: 27, status: false, role: 'User' },
    { id: 11, name: 'Jack White', age: 42, status: true, role: 'Editor' },
    { id: 12, name: 'Kelly Green', age: 31, status: false, role: 'User' },
  ];

  // Sample columns for testing
  const testColumns: ITableColumn<any>[] = [
    {
      header: 'ID',
      key: 'id',
      sortable: true
    },
    {
      header: 'Name',
      key: 'name',
      sortable: true,
      filterable: true,
      filterType: 'search'
    },
    {
      header: 'Age',
      key: 'age',
      sortable: true,
      filterable: true,
      filterType: 'range'
    },
    {
      header: 'Status',
      key: 'status',
      sortable: false,
      filterable: true,
      filterType: 'boolean',
      labelTrue: 'Active',
      labelFalse: 'Inactive',
      render: (item) => (
        <span data-testid={`status-${item.id}`}>
          {item.status ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Role',
      key: 'role',
      sortable: true,
      filterable: true,
      filterType: 'select',
      filterOptions: [
        { id: 'admin', label: 'Admin', value: 'Admin' },
        { id: 'editor', label: 'Editor', value: 'Editor' },
        { id: 'user', label: 'User', value: 'User' }
      ]
    }
  ];

  // Key extractor function
  const keyExtractor = (item: any) => item.id;

  // Mock functions
  const mockOnSelectionChange = jest.fn();
  const mockSetCurrentPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all columns correctly', () => {
    render(
      <ThemeProvider>
        <Table
          columns={testColumns}
          data={testData}
          keyExtractor={keyExtractor}
        />
      </ThemeProvider>
    );

    // Check that the table is rendered
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Check that some key data is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Check for the status cell with the correct content
    const statusCells = screen.getAllByText(/Active|Inactive/);
    expect(statusCells.length).toBeGreaterThan(0);

    // Check for role data
    const roleCells = screen.getAllByText(/Admin|Editor|User/);
    expect(roleCells.length).toBeGreaterThan(0);
  });

  test('handles pagination correctly', async () => {
    render(
      <ThemeProvider>
        <Table
          columns={testColumns}
          data={testData}
          keyExtractor={keyExtractor}
          itemsPerPage={5}
          currentPage={1}
          setCurrentPage={mockSetCurrentPage}
        />
      </ThemeProvider>
    );

    // First page should show first 5 items
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Charlie Davis')).toBeInTheDocument();
    expect(screen.queryByText('Eva Wilson')).not.toBeInTheDocument(); // Not on first page

    // Find and click the next page button
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    // Check that setCurrentPage was called with 2
    expect(mockSetCurrentPage).toHaveBeenCalledWith(2);
  });

  test('handles sorting correctly', () => {
    render(
      <ThemeProvider>
        <Table
          columns={testColumns}
          data={testData}
          keyExtractor={keyExtractor}
        />
      </ThemeProvider>
    );

    // Find the sortable column header (Name)
    const nameHeader = screen.getByText('Name');

    // Click to sort by name ascending
    fireEvent.click(nameHeader);

    // Get all rows
    const rows = screen.getAllByRole('row');

    // Check that rows are sorted by name (Alice Brown should be first)
    const firstRowCells = within(rows[1]).getAllByRole('cell');
    const firstRowText = firstRowCells.map(cell => cell.textContent).join(' ');
    expect(firstRowText).toContain('Alice Brown');

    // Click again to sort descending
    fireEvent.click(nameHeader);

    // Get rows again after sorting
    const rowsAfterSort = screen.getAllByRole('row');
    const firstRowCellsAfterSort = within(rowsAfterSort[1]).getAllByRole('cell');
    const firstRowTextAfterSort = firstRowCellsAfterSort.map(cell => cell.textContent).join(' ');

    // First row should not be Alice Brown anymore
    expect(firstRowTextAfterSort).not.toContain('Alice Brown');
  });

  test('renders selection checkboxes', () => {
    render(
      <ThemeProvider>
        <Table
          columns={testColumns}
          data={testData}
          keyExtractor={keyExtractor}
          selectedItems={[]}
          onSelectionChange={mockOnSelectionChange}
          showSelectionColumn={true}
        />
      </ThemeProvider>
    );

    // Find all checkboxes
    const checkboxes = screen.getAllByRole('checkbox');

    // There should be at least one checkbox (header) plus one for each row
    expect(checkboxes.length).toBeGreaterThan(1);

    // The first checkbox should be the "select all" checkbox in the header
    const headerCheckbox = checkboxes[0];
    expect(headerCheckbox).toBeInTheDocument();

    // There should be row checkboxes
    const rowCheckboxes = checkboxes.slice(1);
    expect(rowCheckboxes.length).toBeGreaterThan(0);
  });

  test('renders with different appearance settings', () => {
    render(
      <ThemeProvider>
        <Table
          columns={testColumns}
          data={testData}
          keyExtractor={keyExtractor}
          density="compact"
          theme="dark"
          showGridLines={true}
          stripedRows={true}
          highlightOnHover={true}
          stickyHeader={true}
        />
      </ThemeProvider>
    );

    // Check that the table is rendered
    expect(screen.getByRole('table')).toBeInTheDocument();

    // We can't easily test CSS classes in this environment,
    // but we can at least verify that the table renders with these props
  });

  test('handles empty data state', () => {
    render(
      <ThemeProvider>
        <Table
          columns={testColumns}
          data={[]}
          keyExtractor={keyExtractor}
          emptyMessage="No data available for testing"
        />
      </ThemeProvider>
    );

    // Check that the empty message is rendered
    expect(screen.getByText('No data available for testing')).toBeInTheDocument();
  });

  test('renders with default sort', () => {
    render(
      <ThemeProvider>
        <Table
          columns={testColumns}
          data={testData}
          keyExtractor={keyExtractor}
          defaultSortKey="age"
          defaultSortDirection="desc"
        />
      </ThemeProvider>
    );

    // Get all rows
    const rows = screen.getAllByRole('row');
    const firstRowCells = within(rows[1]).getAllByRole('cell');
    const firstRowText = firstRowCells.map(cell => cell.textContent).join(' ');

    // With age sorted descending, Frank Miller (45) should be first
    expect(firstRowText).toContain('Frank Miller');
    expect(firstRowText).toContain('45');
  });
});
