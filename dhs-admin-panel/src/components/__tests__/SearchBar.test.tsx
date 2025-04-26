import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar Component', () => {
  test('renders correctly', () => {
    render(<SearchBar />);
    
    // Проверяваме дали полето за търсене съществува
    const searchInput = screen.getByPlaceholderText('Search (CTRL + K)');
    expect(searchInput).toBeInTheDocument();
    
    // Проверяваме дали иконката за търсене присъства
    const searchIcon = document.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
    
    // Проверяваме дали текстът за клавишна комбинация е видим
    const shortcutText = screen.getByText('⌘K');
    expect(shortcutText).toBeInTheDocument();
  });

  test('input change works correctly', () => {
    render(<SearchBar />);
    
    // Намираме input полето
    const searchInput = screen.getByPlaceholderText('Search (CTRL + K)') as HTMLInputElement;
    
    // Симулираме въвеждане на текст
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    // Проверяваме дали стойността на полето е обновена
    expect(searchInput.value).toBe('test query');
  });

  test('has proper accessibility attributes', () => {
    render(<SearchBar />);
    
    // Проверяваме дали полето има правилните атрибути за достъпност
    const searchInput = screen.getByPlaceholderText('Search (CTRL + K)');
    expect(searchInput).toHaveAttribute('type', 'text');
    
    // Проверяваме дали контейнерът има правилните класове
    const container = searchInput.parentElement;
    expect(container).toHaveClass('relative');
  });
});