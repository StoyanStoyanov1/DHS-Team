// src/hooks/__tests__/AuthProvider.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider } from '@/src/hooks/useAuth';

// Мокиране на next/navigation
jest.mock('next/navigation', () => ({
  ...jest.requireActual('../../__mocks__/next-navigation'),
}));

// Мокиране на auth.service
jest.mock('@/src/services/auth.service', () => ({
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn(),
}));

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Импортираме auth.service директно след мокирането му
  const authService = require('@/src/services/auth.service');

  test('should check for current user on initial render', async () => {
    // Подготовка: потребителят е автентикиран
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
    (authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser);

    render(
      <AuthProvider>
        <div data-testid="test-child">Test Child Component</div>
      </AuthProvider>
    );

    // Проверка дали компонентът се рендерира
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    
    // Проверка дали getCurrentUser е извикан
    await waitFor(() => {
      expect(authService.getCurrentUser).toHaveBeenCalled();
    });
  });

  test('should render children when user is not authenticated', async () => {
    // Подготовка: потребителят не е автентикиран
    (authService.getCurrentUser as jest.Mock).mockReturnValue(null);

    render(
      <AuthProvider>
        <div data-testid="test-child">Test Child Component</div>
      </AuthProvider>
    );

    // Проверка дали компонентът се рендерира коректно
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    
    // Проверка дали getCurrentUser е извикан
    await waitFor(() => {
      expect(authService.getCurrentUser).toHaveBeenCalled();
    });
  });

  test('should not redirect if user is authenticated', async () => {
    // Подготовка: потребителят е автентикиран
    const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' };
    (authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser);

    // Подготовка на мок за router
    const mockRouter = jest.requireMock('next/navigation').useRouter();
    
    render(
      <AuthProvider>
        <div data-testid="test-child">Test Child Component</div>
      </AuthProvider>
    );

    // Проверка дали компонентът се рендерира коректно
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    
    // Проверка дали push не е извикан (няма redirect)
    await waitFor(() => {
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
});