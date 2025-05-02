import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar Component', () => {
  test('renders correctly', () => {
    render(<SearchBar />);
    
    // Check if search field exists
    const searchInput = screen.getByPlaceholderText('Search (CTRL + K)');
    expect(searchInput).toBeInTheDocument();
    
    // Check if search icon is present
    const searchIcon = document.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
    
    // Check if shortcut text is visible
    const shortcutText = screen.getByText('⌘K');
    expect(shortcutText).toBeInTheDocument();
  });

  test('input change works correctly', () => {
    // Mock search function
    const mockSearch = jest.fn();
    render(<SearchBar onSearch={mockSearch} />);
    
    // Find input field
    const searchInput = screen.getByPlaceholderText('Search (CTRL + K)') as HTMLInputElement;
    
    // Simulate text input
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    // Check if input value is updated
    expect(searchInput.value).toBe('test query');
    
    // Check if onSearch callback was called
    expect(mockSearch).toHaveBeenCalledWith('test query');
  });
  
  test('clears input on Escape key', () => {
    // Mock search function
    const mockSearch = jest.fn();
    render(<SearchBar onSearch={mockSearch} initialValue="initial query" />);
    
    const searchInput = screen.getByPlaceholderText('Search (CTRL + K)') as HTMLInputElement;
    
    // Verify initial value
    expect(searchInput.value).toBe('initial query');
    
    // Press Escape key
    fireEvent.keyDown(searchInput, { key: 'Escape' });
    
    // Verify input was cleared
    expect(searchInput.value).toBe('');
    
    // Verify onSearch was called with empty string
    expect(mockSearch).toHaveBeenCalledWith('');
  });
  
  test('applies custom placeholder', () => {
    render(<SearchBar placeholder="Custom placeholder" />);
    
    const searchInput = screen.getByPlaceholderText('Custom placeholder');
    expect(searchInput).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    render(<SearchBar />);
    
    // Check if input has proper accessibility attributes
    const searchInput = screen.getByPlaceholderText('Search (CTRL + K)');
    expect(searchInput).toHaveAttribute('type', 'text');
    expect(searchInput).toHaveAttribute('aria-label', 'Search');
    expect(searchInput).toHaveAttribute('data-search-input', 'true');
    
    // Check if container has proper classes
    const container = searchInput.parentElement;
    expect(container).toHaveClass('relative');
  });
});