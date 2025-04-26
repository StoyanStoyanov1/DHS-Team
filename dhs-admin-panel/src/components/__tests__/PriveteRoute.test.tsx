import React from 'react';
import { render, screen } from '@testing-library/react';
import PrivateRoute from '../PriveteRoute';

// Мокваме next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  }),
  usePathname: () => '/dashboard'
}));

// Мокваме useAuth hook
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

describe('PrivateRoute Component', () => {
  const useAuthMock = jest.requireMock('../../hooks/useAuth').useAuth;
  const routerPushMock = jest.requireMock('next/navigation').useRouter().push;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner when authentication is in progress', () => {
    // Симулираме зареждане на аутентикацията
    useAuthMock.mockReturnValue({
      user: null,
      loading: true
    });

    render(
      <PrivateRoute>
        <div data-testid="protected-content">Protected Content</div>
      </PrivateRoute>
    );

    // Проверяваме дали има индикатор за зареждане по CSS класовете
    const spinner = screen.getByClass('animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('border-blue-500');

    // Съдържанието не трябва да се показва
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  test('shows loading spinner when user is not authenticated', () => {
    // Симулираме незаредена, но неаутентикирана сесия
    useAuthMock.mockReturnValue({
      user: null,
      loading: false
    });

    render(
      <PrivateRoute>
        <div data-testid="protected-content">Protected Content</div>
      </PrivateRoute>
    );

    // Проверяваме дали индикаторът за зареждане все още се показва въпреки че loading=false
    // Това е защото компонентът показва индикатор и когато user=null
    const spinner = screen.getByClass('animate-spin');
    expect(spinner).toBeInTheDocument();

    // Проверяваме дали съдържанието не се показва
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  test('renders children when user is authenticated', () => {
    // Симулираме аутентикиран потребител
    useAuthMock.mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      loading: false
    });

    render(
      <PrivateRoute>
        <div data-testid="protected-content">Protected Content</div>
      </PrivateRoute>
    );

    // Проверяваме дали съдържанието се показва
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();

    // Проверяваме дали няма индикатор за зареждане
    expect(screen.queryByClass('animate-spin')).not.toBeInTheDocument();

    // Проверяваме дали не е извикано пренасочване
    expect(routerPushMock).not.toHaveBeenCalled();
  });
});

// Добавяме помощни функции за тестове
const getByClass = (container: HTMLElement, className: string): HTMLElement => {
  const elements = container.getElementsByClassName(className);
  if (elements.length === 0) {
    throw new Error(`No element found with class: ${className}`);
  }
  return elements[0] as HTMLElement;
};

const queryByClass = (container: HTMLElement, className: string): HTMLElement | null => {
  const elements = container.getElementsByClassName(className);
  return elements.length > 0 ? (elements[0] as HTMLElement) : null;
};

// Разширяваме screen обекта
screen.getByClass = function(className: string): HTMLElement {
  return getByClass(document.body, className);
};

screen.queryByClass = function(className: string): HTMLElement | null {
  return queryByClass(document.body, className);
};