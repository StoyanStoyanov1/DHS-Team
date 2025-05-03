import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ColumnSearchFilter, { EnhancedSearchMethod } from '../../Filter/ColumnSearchFilter';
import { SearchField } from '../interfaces';

describe('ColumnSearchFilter', () => {
  // Mock functions for props
  const mockOnSearch = jest.fn();
  const mockOnClose = jest.fn();

  // Sample search fields for testing
  const singleSearchField: SearchField[] = [
    { key: 'name', label: 'Name' }
  ];

  const multipleSearchFields: SearchField[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address', path: 'address.full' }
  ];

  const recentSearches = ['John', 'Alice', 'test@example.com'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default props', () => {
    render(
      <ColumnSearchFilter 
        columnKey="name"
        columnHeader="Name"
        searchFields={singleSearchField}
        onSearch={mockOnSearch}
      />
    );

    // Check if the component renders with the correct header
    expect(screen.getByText('Search Name')).toBeInTheDocument();
    
    // Check if the search input is rendered
    expect(screen.getByPlaceholderText('Search Name...')).toBeInTheDocument();
    
    // Check if the search method dropdown is rendered
    expect(screen.getByText('Match condition:')).toBeInTheDocument();
    
    // Check if the buttons are rendered
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
    expect(screen.getByText('Show advanced options')).toBeInTheDocument();
  });

  test('renders with multiple search fields', () => {
    render(
      <ColumnSearchFilter 
        columnKey="user"
        columnHeader="User"
        searchFields={multipleSearchFields}
        onSearch={mockOnSearch}
      />
    );

    // Check if the field selection dropdown is rendered
    expect(screen.getByText('Search in field:')).toBeInTheDocument();
    
    // Check if all fields are in the dropdown
    const fieldSelect = screen.getByLabelText('Search in field:');
    expect(fieldSelect).toBeInTheDocument();
    
    // Open the dropdown and check options
    fireEvent.click(fieldSelect);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Address')).toBeInTheDocument();
  });

  test('renders with recent searches', () => {
    render(
      <ColumnSearchFilter 
        columnKey="name"
        columnHeader="Name"
        searchFields={singleSearchField}
        onSearch={mockOnSearch}
        recentSearches={recentSearches}
      />
    );

    // Check if the recent searches button is rendered
    const recentSearchesButton = screen.getByTitle('Recent searches');
    expect(recentSearchesButton).toBeInTheDocument();
    
    // Click the button to show recent searches
    fireEvent.click(recentSearchesButton);
    
    // Check if recent searches are displayed
    expect(screen.getByText('Recent searches')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  test('selects a search method', () => {
    render(
      <ColumnSearchFilter 
        columnKey="name"
        columnHeader="Name"
        searchFields={singleSearchField}
        onSearch={mockOnSearch}
      />
    );

    // Find and click the search method dropdown
    const methodSelect = screen.getByLabelText('Match condition:');
    fireEvent.change(methodSelect, { target: { value: 'equals' } });
    
    // Check if the method was changed
    expect(methodSelect).toHaveValue('equals');
  });

  test('enters a search term', () => {
    render(
      <ColumnSearchFilter 
        columnKey="name"
        columnHeader="Name"
        searchFields={singleSearchField}
        onSearch={mockOnSearch}
      />
    );

    // Find the search input and enter a term
    const searchInput = screen.getByPlaceholderText('Search Name...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Check if the term was entered
    expect(searchInput).toHaveValue('John');
  });

  test('clears the search term with the clear button', () => {
    render(
      <ColumnSearchFilter 
        columnKey="name"
        columnHeader="Name"
        searchFields={singleSearchField}
        onSearch={mockOnSearch}
        initialValue="John"
      />
    );

    // Check if the initial value is set
    const searchInput = screen.getByPlaceholderText('Search Name...');
    expect(searchInput).toHaveValue('John');
    
    // Find and click the clear button
    const clearButton = screen.getByTitle('Clear search');
    fireEvent.click(clearButton);
    
    // Check if the term was cleared
    expect(searchInput).toHaveValue('');
  });

  test('toggles advanced options', () => {
    render(
      <ColumnSearchFilter 
        columnKey="name"
        columnHeader="Name"
        searchFields={singleSearchField}
        onSearch={mockOnSearch}
        fieldDataType="text"
      />
    );

    // Advanced options should be hidden initially
    expect(screen.queryByText('Case sensitive')).not.toBeInTheDocument();
    
    // Click to show advanced options
    fireEvent.click(screen.getByText('Show advanced options'));
    
    // Check if advanced options are shown
    expect(screen.getByText('Case sensitive')).toBeInTheDocument();
    
    // Click to hide advanced options
    fireEvent.click(screen.getByText('Hide advanced options'));
    
    // Check if advanced options are hidden again
    expect(screen.queryByText('Case sensitive')).not.toBeInTheDocument();
  });

  test('toggles case sensitivity', () => {
    render(
      <ColumnSearchFilter 
        columnKey="name"
        columnHeader="Name"
        searchFields={singleSearchField}
        onSearch={mockOnSearch}
        fieldDataType="text"
      />
    );

    // Show advanced options
    fireEvent.click(screen.getByText('Show advanced options'));
    
    // Find and click the case sensitivity checkbox
    const checkbox = screen.getByLabelText('Case sensitive');
    expect(checkbox).not.toBeChecked();
    
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test('calls onSearch when Search button is clicked', () => {
    render(
      <ColumnSearchFilter 
        columnKey="name"
        columnHeader="Name"
        searchFields={singleSearchField}
        onSearch={mockOnSearch}
      />
    );

    // Enter a search term
    const searchInput = screen.getByPlaceholderText('Search Name...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Click the Search button
    fireEvent.click(screen.getByText('Search'));
    
    // Check if onSearch was called with the correct parameters
    expect(mockOnSearch).toHaveBeenCalledWith('name', 'John', 'name', 'contains');
  });

  test('calls onSearch with null when Clear button is clicked', () => {
    render(
      <ColumnSearchFilter 
        columnKey="name"
        columnHeader="Name"
        searchFields={singleSearchField}
        onSearch={mockOnSearch}
        initialValue="John"
      />
    );

    // Click the Clear button
    fireEvent.click(screen.getByText('Clear'));
    
    // Check if onSearch was called with null
    expect(mockOnSearch).toHaveBeenCalledWith('name', null, 'name', 'contains');
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <ColumnSearchFilter 
        columnKey="name"
        columnHeader="Name"
        searchFields={singleSearchField}
        onSearch={mockOnSearch}
        onClose={mockOnClose}
      />
    );

    // Find and click the close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('handles Enter key to search', () => {
    render(
      <ColumnSearchFilter 
        columnKey="name"
        columnHeader="Name"
        searchFields={singleSearchField}
        onSearch={mockOnSearch}
      />
    );

    // Enter a search term
    const searchInput = screen.getByPlaceholderText('Search Name...');
    fireEvent.change(searchInput, { target: { value: 'John' } });
    
    // Press Enter
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    
    // Check if onSearch was called
    expect(mockOnSearch).toHaveBeenCalledWith('name', 'John', 'name', 'contains');
  });

  test('handles Escape key to close', () => {
    render(
      <ColumnSearchFilter 
        columnKey="name"
        columnHeader="Name"
        searchFields={singleSearchField}
        onSearch={mockOnSearch}
        onClose={mockOnClose}
      />
    );

    // Press Escape
    const searchInput = screen.getByPlaceholderText('Search Name...');
    fireEvent.keyDown(searchInput, { key: 'Escape' });
    
    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('selects a recent search term', () => {
    render(
      <ColumnSearchFilter 
        columnKey="name"
        columnHeader="Name"
        searchFields={singleSearchField}
        onSearch={mockOnSearch}
        recentSearches={recentSearches}
      />
    );

    // Open recent searches
    const recentSearchesButton = screen.getByTitle('Recent searches');
    fireEvent.click(recentSearchesButton);
    
    // Click on a recent search
    fireEvent.click(screen.getByText('Alice'));
    
    // Check if the term was selected
    const searchInput = screen.getByPlaceholderText('Search Name...');
    expect(searchInput).toHaveValue('Alice');
  });

  test('renders different search methods for number data type', () => {
    render(
      <ColumnSearchFilter 
        columnKey="age"
        columnHeader="Age"
        searchFields={[{ key: 'age', label: 'Age' }]}
        onSearch={mockOnSearch}
        fieldDataType="number"
      />
    );

    // Check if number-specific methods are available
    const methodSelect = screen.getByLabelText('Match condition:');
    fireEvent.click(methodSelect);
    
    expect(screen.getByText('Greater than')).toBeInTheDocument();
    expect(screen.getByText('Less than')).toBeInTheDocument();
  });

  test('renders different search methods for date data type', () => {
    render(
      <ColumnSearchFilter 
        columnKey="birthdate"
        columnHeader="Birth Date"
        searchFields={[{ key: 'birthdate', label: 'Birth Date' }]}
        onSearch={mockOnSearch}
        fieldDataType="date"
      />
    );

    // Check if date-specific methods are available
    const methodSelect = screen.getByLabelText('Match condition:');
    fireEvent.click(methodSelect);
    
    expect(screen.getByText('Before')).toBeInTheDocument();
    expect(screen.getByText('After')).toBeInTheDocument();
  });

  test('handles isEmpty and isNotEmpty methods', () => {
    render(
      <ColumnSearchFilter 
        columnKey="name"
        columnHeader="Name"
        searchFields={singleSearchField}
        onSearch={mockOnSearch}
      />
    );

    // Select isEmpty method
    const methodSelect = screen.getByLabelText('Match condition:');
    fireEvent.change(methodSelect, { target: { value: 'isEmpty' } });
    
    // Input field should not be visible
    expect(screen.queryByPlaceholderText('Search Name...')).not.toBeInTheDocument();
    
    // Click Search
    fireEvent.click(screen.getByText('Search'));
    
    // Check if onSearch was called with the correct parameters
    expect(mockOnSearch).toHaveBeenCalledWith('name', '', 'name', 'isEmpty');
  });

  test('initializes with complex initialValue object', () => {
    const complexInitialValue = {
      term: 'John',
      field: 'name',
      method: 'equals' as EnhancedSearchMethod
    };
    
    render(
      <ColumnSearchFilter 
        columnKey="user"
        columnHeader="User"
        searchFields={multipleSearchFields}
        onSearch={mockOnSearch}
        initialValue={complexInitialValue}
      />
    );

    // Check if the initial values are set correctly
    const searchInput = screen.getByPlaceholderText('Search Name...');
    expect(searchInput).toHaveValue('John');
    
    const methodSelect = screen.getByLabelText('Match condition:');
    expect(methodSelect).toHaveValue('equals');
  });
});