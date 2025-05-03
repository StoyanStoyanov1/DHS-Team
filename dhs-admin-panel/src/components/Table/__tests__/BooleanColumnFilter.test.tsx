import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BooleanColumnFilter from '../BooleanColumnFilter';

describe('BooleanColumnFilter', () => {
  // Mock functions for props
  const mockOnChange = jest.fn();
  const mockOnApply = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with default props', () => {
    render(
      <BooleanColumnFilter 
        value={null} 
        onChange={mockOnChange} 
        onApply={mockOnApply} 
      />
    );

    // Check if the component renders with default labels
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('True')).toBeInTheDocument();
    expect(screen.getByText('False')).toBeInTheDocument();
    expect(screen.getByText('Apply')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('renders with custom labels', () => {
    render(
      <BooleanColumnFilter 
        value={null} 
        onChange={mockOnChange} 
        onApply={mockOnApply}
        labelAll="Any"
        labelTrue="Yes"
        labelFalse="No"
      />
    );

    // Check if the component renders with custom labels
    expect(screen.getByText('Any')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  test('selects "All" option by default when value is null', () => {
    render(
      <BooleanColumnFilter 
        value={null} 
        onChange={mockOnChange} 
        onApply={mockOnApply} 
      />
    );

    // Check if the "All" option is selected
    const allOption = screen.getByText('All').parentElement;
    expect(allOption).toHaveClass('bg-indigo-50');
  });

  test('selects "True" option when value is true', () => {
    render(
      <BooleanColumnFilter 
        value={true} 
        onChange={mockOnChange} 
        onApply={mockOnApply} 
      />
    );

    // Check if the "True" option is selected
    const trueOption = screen.getByText('True').parentElement;
    expect(trueOption).toHaveClass('bg-green-50');
  });

  test('selects "False" option when value is false', () => {
    render(
      <BooleanColumnFilter 
        value={false} 
        onChange={mockOnChange} 
        onApply={mockOnApply} 
      />
    );

    // Check if the "False" option is selected
    const falseOption = screen.getByText('False').parentElement;
    expect(falseOption).toHaveClass('bg-red-50');
  });

  test('handles string "true" value', () => {
    render(
      <BooleanColumnFilter 
        value="true" 
        onChange={mockOnChange} 
        onApply={mockOnApply} 
      />
    );

    // Check if the "True" option is selected
    const trueOption = screen.getByText('True').parentElement;
    expect(trueOption).toHaveClass('bg-green-50');
  });

  test('handles string "false" value', () => {
    render(
      <BooleanColumnFilter 
        value="false" 
        onChange={mockOnChange} 
        onApply={mockOnApply} 
      />
    );

    // Check if the "False" option is selected
    const falseOption = screen.getByText('False').parentElement;
    expect(falseOption).toHaveClass('bg-red-50');
  });

  test('changes selection when an option is clicked', () => {
    render(
      <BooleanColumnFilter 
        value={null} 
        onChange={mockOnChange} 
        onApply={mockOnApply} 
      />
    );

    // Click on the "True" option
    fireEvent.click(screen.getByText('True'));

    // Check if the "True" option is now selected
    const trueOption = screen.getByText('True').parentElement;
    expect(trueOption).toHaveClass('bg-green-50');

    // Click on the "False" option
    fireEvent.click(screen.getByText('False'));

    // Check if the "False" option is now selected
    const falseOption = screen.getByText('False').parentElement;
    expect(falseOption).toHaveClass('bg-red-50');

    // Click on the "All" option
    fireEvent.click(screen.getByText('All'));

    // Check if the "All" option is now selected
    const allOption = screen.getByText('All').parentElement;
    expect(allOption).toHaveClass('bg-indigo-50');
  });

  test('calls onChange and onApply when Apply button is clicked', () => {
    render(
      <BooleanColumnFilter 
        value={null} 
        onChange={mockOnChange} 
        onApply={mockOnApply} 
      />
    );

    // Click on the "True" option
    fireEvent.click(screen.getByText('True'));

    // Click on the Apply button
    fireEvent.click(screen.getByText('Apply'));

    // Check if onChange and onApply were called with the correct value
    expect(mockOnChange).toHaveBeenCalledWith(true);
    expect(mockOnApply).toHaveBeenCalledWith(true);
  });

  test('calls onClose when Cancel button is clicked', () => {
    render(
      <BooleanColumnFilter 
        value={null} 
        onChange={mockOnChange} 
        onApply={mockOnApply}
        onClose={mockOnClose}
      />
    );

    // Click on the Cancel button
    fireEvent.click(screen.getByText('Cancel'));

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled();
    // Check that onChange and onApply were not called
    expect(mockOnChange).not.toHaveBeenCalled();
    expect(mockOnApply).not.toHaveBeenCalled();
  });

  test('updates selection when value prop changes', () => {
    const { rerender } = render(
      <BooleanColumnFilter 
        value={null} 
        onChange={mockOnChange} 
        onApply={mockOnApply} 
      />
    );

    // Check if the "All" option is selected
    let allOption = screen.getByText('All').parentElement;
    expect(allOption).toHaveClass('bg-indigo-50');

    // Rerender with value={true}
    rerender(
      <BooleanColumnFilter 
        value={true} 
        onChange={mockOnChange} 
        onApply={mockOnApply} 
      />
    );

    // Check if the "True" option is now selected
    const trueOption = screen.getByText('True').parentElement;
    expect(trueOption).toHaveClass('bg-green-50');

    // Rerender with value={false}
    rerender(
      <BooleanColumnFilter 
        value={false} 
        onChange={mockOnChange} 
        onApply={mockOnApply} 
      />
    );

    // Check if the "False" option is now selected
    const falseOption = screen.getByText('False').parentElement;
    expect(falseOption).toHaveClass('bg-red-50');
  });
});