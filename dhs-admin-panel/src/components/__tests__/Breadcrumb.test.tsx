import React from 'react';
import { render, screen } from '@testing-library/react';
import Breadcrumb from '../Breadcrumb';

// Мокваме next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}));

// Мокваме next/link
jest.mock('next/link', () => {
  return function Link({ children, href }: { children: React.ReactNode, href: string }) {
    return <a href={href} data-testid="mock-link">{children}</a>;
  };
});

// Мокваме lucide-react иконите
jest.mock('lucide-react', () => ({
  Home: () => <span data-testid="home-icon">HomeIcon</span>,
  ChevronRight: () => <span data-testid="chevron-icon">ChevronIcon</span>
}));

describe('Breadcrumb Component', () => {
  const usePathnameMock = jest.requireMock('next/navigation').usePathname;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should not render on home page', () => {
    usePathnameMock.mockReturnValue('/');
    
    const { container } = render(<Breadcrumb />);
    expect(container.firstChild).toBeNull();
  });

  test('renders correctly for a single-level path', () => {
    usePathnameMock.mockReturnValue('/dashboard');
    
    render(<Breadcrumb />);
    
    // Проверяваме дали Home иконата се показва
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    
    // Проверяваме дали сегментът от пътя е правилно форматиран и показан
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    // Проверяваме дали последният елемент има правилния стил (не е линк)
    const dashboardElement = screen.getByText('Dashboard');
    expect(dashboardElement.tagName).not.toBe('A');
    expect(dashboardElement).toHaveClass('text-blue-600');
  });

  test('renders correctly for a multi-level path', () => {
    usePathnameMock.mockReturnValue('/users/profile/settings');
    
    render(<Breadcrumb />);
    
    // Проверяваме дали всички сегменти от пътя са показани
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    
    // Проверяваме дали междинните елементи са линкове
    const usersElement = screen.getByText('Users').closest('a');
    const profileElement = screen.getByText('Profile').closest('a');
    
    expect(usersElement).toHaveAttribute('href', '/users');
    expect(profileElement).toHaveAttribute('href', '/users/profile');
    
    // Проверяваме дали последният елемент не е линк
    const settingsElement = screen.getByText('Settings');
    expect(settingsElement.closest('a')).toBeNull();
  });

  test('handles special path names correctly', () => {
    usePathnameMock.mockReturnValue('/auth/login');
    
    render(<Breadcrumb />);
    
    // Проверяваме дали 'auth' е преведено до 'Authentication'
    expect(screen.getByText('Authentication')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('displays the correct number of separators', () => {
    usePathnameMock.mockReturnValue('/projects/web/react');
    
    render(<Breadcrumb />);
    
    // В този път трябва да има 3 елемента и 3 сепаратора
    const separators = screen.getAllByTestId('chevron-icon');
    expect(separators.length).toBe(3);
  });
});