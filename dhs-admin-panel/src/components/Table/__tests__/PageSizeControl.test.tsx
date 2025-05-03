import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageSizeControl, { PageSizeOption } from '../PageSizeControl';

describe('PageSizeControl', () => {
  // Mock function for setItemsPerPage
  const mockSetItemsPerPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default props', () => {
    render(
      <PageSizeControl
        itemsPerPage={10}
        setItemsPerPage={mockSetItemsPerPage}
      />
    );

    // Check if the component renders with the correct label
    expect(screen.getByText('Rows per page:')).toBeInTheDocument();
    
    // Check if the current page size is displayed
    expect(screen.getByText('10')).toBeInTheDocument();
    
    // Check if the dropdown is initially closed
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  test('opens dropdown when button is clicked', () => {
    render(
      <PageSizeControl
        itemsPerPage={10}
        setItemsPerPage={mockSetItemsPerPage}
      />
    );

    // Click the button to open the dropdown
    fireEvent.click(screen.getByRole('button'));
    
    // Check if the dropdown is open
    expect(screen.getAllByRole('menuitem').length).toBeGreaterThan(0);
    
    // Check if default options are rendered
    expect(screen.getByRole('menuitem', { name: '5' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '10' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '15' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '25' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '50' })).toBeInTheDocument();
  });

  test('selects a different page size', () => {
    render(
      <PageSizeControl
        itemsPerPage={10}
        setItemsPerPage={mockSetItemsPerPage}
      />
    );

    // Open the dropdown
    fireEvent.click(screen.getByRole('button'));
    
    // Click on a different page size
    fireEvent.click(screen.getByRole('menuitem', { name: '25' }));
    
    // Check if setItemsPerPage was called with the correct value
    expect(mockSetItemsPerPage).toHaveBeenCalledWith(25);
    
    // Check if the dropdown is closed after selection
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  test('renders with custom options array', () => {
    render(
      <PageSizeControl
        itemsPerPage={20}
        setItemsPerPage={mockSetItemsPerPage}
        options={[10, 20, 30, 40]}
      />
    );

    // Open the dropdown
    fireEvent.click(screen.getByRole('button'));
    
    // Check if custom options are rendered
    expect(screen.getByRole('menuitem', { name: '10' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '20' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '30' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: '40' })).toBeInTheDocument();
    
    // Check that default options not in the custom list are not rendered
    expect(screen.queryByRole('menuitem', { name: '15' })).not.toBeInTheDocument();
  });

  test('renders with complex options', () => {
    const complexOptions: PageSizeOption[] = [
      { size: 10, label: 'Small' },
      { size: 25, label: 'Medium' },
      { size: 50, label: 'Large' },
      { size: 100, label: 'Extra Large', available: false }
    ];
    
    render(
      <PageSizeControl
        itemsPerPage={25}
        setItemsPerPage={mockSetItemsPerPage}
        options={complexOptions}
      />
    );

    // Open the dropdown
    fireEvent.click(screen.getByRole('button'));
    
    // Check if custom labels are rendered
    expect(screen.getByRole('menuitem', { name: 'Small' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Medium' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Large' })).toBeInTheDocument();
    
    // Check if unavailable option is rendered as disabled
    const extraLargeOption = screen.getByText('Extra Large');
    expect(extraLargeOption).toBeInTheDocument();
    expect(extraLargeOption.closest('[aria-disabled="true"]')).toBeInTheDocument();
  });

  test('handles unavailable options', () => {
    const complexOptions: PageSizeOption[] = [
      { size: 10, available: true },
      { size: 25, available: false }
    ];
    
    render(
      <PageSizeControl
        itemsPerPage={10}
        setItemsPerPage={mockSetItemsPerPage}
        options={complexOptions}
      />
    );

    // Open the dropdown
    fireEvent.click(screen.getByRole('button'));
    
    // Click on the unavailable option
    fireEvent.click(screen.getByText('25'));
    
    // Check that setItemsPerPage was not called
    expect(mockSetItemsPerPage).not.toHaveBeenCalled();
  });

  test('renders with top label position', () => {
    render(
      <PageSizeControl
        itemsPerPage={10}
        setItemsPerPage={mockSetItemsPerPage}
        labelPosition="top"
      />
    );

    // Check if the label is rendered
    const label = screen.getByText('Rows per page:');
    expect(label).toBeInTheDocument();
    
    // Check if the container has flex-col class for top label position
    const container = label.closest('div');
    expect(container).toHaveClass('flex-col');
  });

  test('renders with custom label', () => {
    render(
      <PageSizeControl
        itemsPerPage={10}
        setItemsPerPage={mockSetItemsPerPage}
        label="Items per page:"
      />
    );

    // Check if the custom label is rendered
    expect(screen.getByText('Items per page:')).toBeInTheDocument();
  });

  test('renders in compact mode', () => {
    render(
      <PageSizeControl
        itemsPerPage={10}
        setItemsPerPage={mockSetItemsPerPage}
        compact={true}
      />
    );

    // Check if the button has text-xs class for compact mode
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-xs');
    expect(button).toHaveClass('px-2');
    expect(button).toHaveClass('py-1');
  });

  test('renders with showRowsText', () => {
    render(
      <PageSizeControl
        itemsPerPage={10}
        setItemsPerPage={mockSetItemsPerPage}
        showRowsText={true}
      />
    );

    // Check if "rows" text is displayed
    expect(screen.getByText('10 rows')).toBeInTheDocument();
    
    // Open the dropdown
    fireEvent.click(screen.getByRole('button'));
    
    // Check if options also have "rows" text
    expect(screen.getByRole('menuitem', { name: '5 rows' })).toBeInTheDocument();
  });

  test('closes dropdown when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside-element">Outside</div>
        <PageSizeControl
          itemsPerPage={10}
          setItemsPerPage={mockSetItemsPerPage}
        />
      </div>
    );

    // Open the dropdown
    fireEvent.click(screen.getByRole('button'));
    
    // Check if the dropdown is open
    expect(screen.getAllByRole('menuitem').length).toBeGreaterThan(0);
    
    // Click outside the dropdown
    fireEvent.mouseDown(screen.getByTestId('outside-element'));
    
    // Check if the dropdown is closed
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  test('applies custom class names', () => {
    render(
      <PageSizeControl
        itemsPerPage={10}
        setItemsPerPage={mockSetItemsPerPage}
        className="custom-container"
        buttonClassName="custom-button"
        dropdownClassName="custom-dropdown"
      />
    );

    // Check if custom container class is applied
    const container = screen.getByText('Rows per page:').closest('.custom-container');
    expect(container).toBeInTheDocument();
    
    // Check if custom button class is applied
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-button');
    
    // Open the dropdown
    fireEvent.click(button);
    
    // Check if custom dropdown class is applied
    const dropdown = screen.getAllByRole('menuitem')[0].closest('.custom-dropdown');
    expect(dropdown).toBeInTheDocument();
  });
});