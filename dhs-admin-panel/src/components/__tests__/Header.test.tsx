import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Header from '../Header';

// Мокваме useAuth hook и useRouter
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn()
  }))
}));

// Взимаме референции към моковете, за да можем да ги контролираме в тестовете
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

describe('Header Component', () => {
  const mockRouter = {
    push: jest.fn()
  };
  
  const mockLogout = jest.fn();
  
  beforeEach(() => {
    // Настройваме моковете преди всеки тест
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com' },
      logout: mockLogout
    });
    
    // Изчистваме броячите на извикванията
    mockRouter.push.mockClear();
    mockLogout.mockClear();
  });

  test('renders correctly when user is logged in', () => {
    render(<Header />);
    
    // Проверка дали основните елементи са рендерирани
    expect(screen.getByRole('button', { name: /t/i })).toBeInTheDocument(); // Инициалите
    expect(screen.getByPlaceholderText('Search (CTRL + K)')).toBeInTheDocument(); // SearchBar
  });

  test('redirects to login when user is not logged in', () => {
    // Променяме мока за този тест, за да върне null вместо user обект
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      logout: mockLogout
    });
    
    render(<Header />);
    
    // Проверяваме дали redirect е бил извикан
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
  });

  test('opens dropdown when profile button is clicked', () => {
    render(<Header />);
    
    // Намираме бутона с инициалите
    const profileButton = screen.getByRole('button', { name: /t/i });
    fireEvent.click(profileButton);
    
    // Проверяваме дали dropdown се е появил
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  test('logs out when logout button is clicked', async () => {
    render(<Header />);
    
    // Отваряме dropdown
    const profileButton = screen.getByRole('button', { name: /t/i });
    fireEvent.click(profileButton);
    
    // Намираме logout бутона и го натискаме
    const logoutButton = screen.getByText('Log out');
    await act(async () => {
      fireEvent.click(logoutButton);
    });
    
    // Проверяваме дали логаут и редирект функциите са били извикани
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
  });

  test('closes dropdown when clicking outside', () => {
    render(<Header />);
    
    // Отваряме dropdown
    const profileButton = screen.getByRole('button', { name: /t/i });
    fireEvent.click(profileButton);
    
    // Проверяваме, че dropdown е отворен
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    
    // Симулираме клик извън dropdown
    fireEvent.mouseDown(document.body);
    
    // Проверяваме, че dropdown вече не е видим (използваме queryByText, защото getByText би хвърлил грешка)
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });
});