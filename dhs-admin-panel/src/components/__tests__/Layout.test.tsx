import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from '../Layout';
import { useAuth } from '@/src/hooks/useAuth';

// Мокиране на next/navigation
jest.mock('next/navigation', () => ({
  ...jest.requireActual('../../__mocks__/next-navigation'),
}));

// Мокиране на hooks/useAuth
jest.mock('@/src/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Мокиране на компонентите - по-опростена версия
jest.mock('../Sidebar', () => {
  return function MockSidebar() {
    return <div data-testid="sidebar">Sidebar</div>;
  };
});

jest.mock('../Header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>;
  };
});

// Мокиране на компонента Breadcrumb
jest.mock('../Breadcrumb', () => {
  return function MockBreadcrumb() {
    return <div data-testid="breadcrumb">Breadcrumb</div>;
  };
});

describe('Layout Component', () => {
  const mockUseAuth = useAuth as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    // Стандартни стойности за useAuth
    mockUseAuth.mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      clearErrors: jest.fn(),
      error: null,
      validationErrors: null,
    });
  });

  // Тест за рендериране на пълен layout за не-auth страници
  test('renders the full layout for non-auth pages', () => {
    render(
      <Layout>
        <div data-testid="mock-content">Page Content</div>
      </Layout>
    );
    
    // Проверка дали основните елементи са рендерирани
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-content')).toBeInTheDocument();
  });

  // Тест за рендериране само на съдържанието за auth страници
  test('renders only children content for auth pages', () => {
    // Настройваме път към auth страница
    const usePathnameMock = jest.requireMock('next/navigation').usePathname;
    usePathnameMock.mockReturnValue('/auth/login');
    
    render(
      <Layout>
        <div data-testid="mock-content">Login Page Content</div>
      </Layout>
    );
    
    // Проверка, че layout елементите не са рендерирани
    expect(screen.queryByTestId('header')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-content')).toBeInTheDocument();
  });
});