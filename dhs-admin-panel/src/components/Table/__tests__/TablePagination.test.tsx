import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import TablePagination from '../TablePagination';

// Mock PageSizeControl component
jest.mock('../PageSizeControl', () => {
  return function MockPageSizeControl({ itemsPerPage, setItemsPerPage, options }) {
    return (
      <div data-testid="page-size-control">
        <select
          data-testid="page-size-select"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          {options.map(option => (
            <option key={option.size} value={option.size}>
              {option.size}
            </option>
          ))}
        </select>
      </div>
    );
  };
});

describe('TablePagination', () => {
  // Mock functions for props
  const mockOnPageChange = jest.fn();
  const mockOnItemsPerPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with basic props', () => {
    render(
      <TablePagination
        currentPage={1}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
      />
    );

    // Check if the component renders with the correct information
    const itemsInfo = screen.getByTestId('items-info');
    expect(itemsInfo).toHaveTextContent('Showing 1 to 10 of 50 results');
    
    // Check if pagination buttons are rendered
    expect(screen.getByLabelText('Go to first page')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to last page')).toBeInTheDocument();
    
    // Check if page numbers are rendered
    expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 5')).toBeInTheDocument();
    
    // Check if "Go to page" input is rendered
    expect(screen.getByLabelText('Go to page')).toBeInTheDocument();
  });

  test('renders with single page', () => {
    render(
      <TablePagination
        currentPage={1}
        totalPages={1}
        itemsPerPage={10}
        totalItems={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Check if the component renders with the correct information
    const itemsInfo = screen.getByTestId('items-info');
    expect(itemsInfo).toHaveTextContent('Showing 1 to 10 of 10 results');
    
    // Pagination controls should not be rendered for a single page
    expect(screen.queryByLabelText('Go to first page')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Previous page')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next page')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Go to last page')).not.toBeInTheDocument();
  });

  test('renders with page size control', () => {
    render(
      <TablePagination
        currentPage={1}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
        onItemsPerPageChange={mockOnItemsPerPageChange}
        rowsPerPageOptions={[10, 20, 50]}
        showPageSizeControl={true}
      />
    );

    // Check if the page size control is rendered
    expect(screen.getByTestId('page-size-control')).toBeInTheDocument();
    
    // Change page size
    fireEvent.change(screen.getByTestId('page-size-select'), { target: { value: '20' } });
    
    // Check if onItemsPerPageChange was called with the correct value
    expect(mockOnItemsPerPageChange).toHaveBeenCalledWith(20);
  });

  test('handles first page button click', () => {
    render(
      <TablePagination
        currentPage={3}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
      />
    );

    // Click on the first page button
    fireEvent.click(screen.getByLabelText('Go to first page'));
    
    // Check if onPageChange was called with the correct page number
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  test('handles previous page button click', () => {
    render(
      <TablePagination
        currentPage={3}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
      />
    );

    // Click on the previous page button
    fireEvent.click(screen.getByLabelText('Previous page'));
    
    // Check if onPageChange was called with the correct page number
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  test('handles next page button click', () => {
    render(
      <TablePagination
        currentPage={3}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
      />
    );

    // Click on the next page button
    fireEvent.click(screen.getByLabelText('Next page'));
    
    // Check if onPageChange was called with the correct page number
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  test('handles last page button click', () => {
    render(
      <TablePagination
        currentPage={3}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
      />
    );

    // Click on the last page button
    fireEvent.click(screen.getByLabelText('Go to last page'));
    
    // Check if onPageChange was called with the correct page number
    expect(mockOnPageChange).toHaveBeenCalledWith(5);
  });

  test('handles page number click', () => {
    render(
      <TablePagination
        currentPage={1}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
      />
    );

    // Click on page 3
    fireEvent.click(screen.getByLabelText('Page 3'));
    
    // Check if onPageChange was called with the correct page number
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  test('handles go to page input', () => {
    render(
      <TablePagination
        currentPage={1}
        totalPages={10}
        itemsPerPage={10}
        totalItems={100}
        onPageChange={mockOnPageChange}
      />
    );

    // Find the go to page input
    const goToPageInput = screen.getByLabelText('Go to page');
    
    // Enter a page number
    fireEvent.change(goToPageInput, { target: { value: '5' } });
    
    // Submit the form
    fireEvent.submit(goToPageInput.closest('form'));
    
    // Check if onPageChange was called with the correct page number
    expect(mockOnPageChange).toHaveBeenCalledWith(5);
  });

  test('handles invalid go to page input', () => {
    render(
      <TablePagination
        currentPage={1}
        totalPages={10}
        itemsPerPage={10}
        totalItems={100}
        onPageChange={mockOnPageChange}
      />
    );

    // Find the go to page input
    const goToPageInput = screen.getByLabelText('Go to page');
    
    // Enter an invalid page number (too high)
    fireEvent.change(goToPageInput, { target: { value: '15' } });
    
    // Check if the input value was corrected
    expect(goToPageInput).toHaveValue('10');
    
    // Enter an invalid page number (non-numeric)
    fireEvent.change(goToPageInput, { target: { value: 'abc' } });
    
    // Check if the input value was corrected
    expect(goToPageInput).toHaveValue('');
    
    // Enter zero
    fireEvent.change(goToPageInput, { target: { value: '0' } });
    
    // Check if the input value was corrected
    expect(goToPageInput).toHaveValue('');
  });

  test('disables navigation buttons when at first page', () => {
    render(
      <TablePagination
        currentPage={1}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
      />
    );

    // Check if first and previous buttons are disabled
    expect(screen.getByLabelText('Go to first page')).toBeDisabled();
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    
    // Check if next and last buttons are enabled
    expect(screen.getByLabelText('Next page')).not.toBeDisabled();
    expect(screen.getByLabelText('Go to last page')).not.toBeDisabled();
  });

  test('disables navigation buttons when at last page', () => {
    render(
      <TablePagination
        currentPage={5}
        totalPages={5}
        itemsPerPage={10}
        totalItems={50}
        onPageChange={mockOnPageChange}
      />
    );

    // Check if next and last buttons are disabled
    expect(screen.getByLabelText('Next page')).toBeDisabled();
    expect(screen.getByLabelText('Go to last page')).toBeDisabled();
    
    // Check if first and previous buttons are enabled
    expect(screen.getByLabelText('Go to first page')).not.toBeDisabled();
    expect(screen.getByLabelText('Previous page')).not.toBeDisabled();
  });

  test('handles page numbers with ellipsis for many pages', () => {
    render(
      <TablePagination
        currentPage={5}
        totalPages={20}
        itemsPerPage={10}
        totalItems={200}
        onPageChange={mockOnPageChange}
      />
    );

    // Check if ellipsis is rendered
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBe(2);
    
    // Check if current page and adjacent pages are rendered
    expect(screen.getByLabelText('Page 4')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 5')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 6')).toBeInTheDocument();
    
    // Check if first and last pages are rendered
    expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 20')).toBeInTheDocument();
  });

  test('calculates correct item range', () => {
    // Clear any previous renders
    cleanup();
    
    const { getByTestId } = render(
      <TablePagination
        currentPage={2}
        totalPages={5}
        itemsPerPage={10}
        totalItems={45}
        onPageChange={mockOnPageChange}
      />
    );

    // Page 2 with 10 items per page should show items 11-20
    const itemsInfo = getByTestId('items-info');
    expect(itemsInfo).toHaveTextContent('Showing 11 to 20 of 45 results');
    
    // Clear previous render before new render
    cleanup();
    
    // Render with last page that has fewer items
    const { getByTestId: getByTestIdLastPage } = render(
      <TablePagination
        currentPage={5}
        totalPages={5}
        itemsPerPage={10}
        totalItems={45}
        onPageChange={mockOnPageChange}
      />
    );
    
    // Page 5 with 10 items per page should show items 41-45
    const lastPageItemsInfo = getByTestIdLastPage('items-info');
    expect(lastPageItemsInfo).toHaveTextContent('Showing 41 to 45 of 45 results');
  });
});