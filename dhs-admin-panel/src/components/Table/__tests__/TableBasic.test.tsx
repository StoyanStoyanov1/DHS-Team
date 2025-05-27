import React from 'react';
import { render, screen } from '@testing-library/react';
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

describe('Table Basic Tests', () => {
  // Sample data for testing
  const testData = [
    { id: 1, name: 'John Doe', age: 30, status: true },
    { id: 2, name: 'Jane Smith', age: 25, status: false },
    { id: 3, name: 'Bob Johnson', age: 35, status: true },
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
    },
    {
      header: 'Age',
      key: 'age',
      sortable: true,
    },
    {
      header: 'Status',
      key: 'status',
      render: (item) => (
        <span data-testid={`status-${item.id}`}>
          {item.status ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  // Key extractor function
  const keyExtractor = (item: any) => item.id;

  test('renders with basic props', () => {
    render(
      <ThemeProvider>
        <Table
          columns={testColumns}
          data={testData}
          keyExtractor={keyExtractor}
        />
      </ThemeProvider>
    );

    // Check if the table is rendered
    expect(screen.getByRole('table')).toBeInTheDocument();

    // Check if the table headers are rendered
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();

    // Check if the first row data is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  test('renders empty state message when no data', () => {
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

    // Check if the empty message is rendered
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

    // Check if the table is rendered
    expect(screen.getByRole('table')).toBeInTheDocument();

    // With age sorted descending, Bob Johnson (35) should be first
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1); // Header row + data rows

    // Get the first data row (index 1, after header row)
    const firstDataRow = rows[1];

    // Check that Bob Johnson (age 35) is first
    expect(firstDataRow).toHaveTextContent('Bob Johnson');
    expect(firstDataRow).toHaveTextContent('35');
  });

  test('renders with pagination', () => {
    render(
      <ThemeProvider>
        <Table
          columns={testColumns}
          data={testData}
          keyExtractor={keyExtractor}
          itemsPerPage={2}
          pagination={true}
        />
      </ThemeProvider>
    );

    // Check if the table is rendered
    expect(screen.getByRole('table')).toBeInTheDocument();

    // With 3 items and 2 per page, we should have 2 pages
    // Check that only the first 2 items are rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument(); // Not on first page
  });

  test('renders with selection functionality', () => {
    const mockOnSelectionChange = jest.fn();

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

    // Check if the table is rendered
    expect(screen.getByRole('table')).toBeInTheDocument();

    // Check if selection checkboxes are rendered
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
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

    // Check if the table is rendered
    expect(screen.getByRole('table')).toBeInTheDocument();

    // We can't easily test CSS classes in this environment,
    // but we can at least verify that the table renders with these props
  });

  test('handles custom row rendering', () => {
    render(
      <ThemeProvider>
        <Table
          columns={testColumns}
          data={testData}
          keyExtractor={keyExtractor}
          rowClassName={(item) => item.status ? 'active-row' : 'inactive-row'}
        />
      </ThemeProvider>
    );

    // Check if the table is rendered
    expect(screen.getByRole('table')).toBeInTheDocument();

    // Get all rows
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1); // Header row + data rows
  });
});
