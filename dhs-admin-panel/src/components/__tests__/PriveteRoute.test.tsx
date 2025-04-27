import React from 'react';
import { render, screen } from '@testing-library/react';
import PrivateRoute from '../PriveteRoute';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  }),
  usePathname: () => '/dashboard'
}));

// Mock useAuth hook
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
    // Simulate authentication loading
    useAuthMock.mockReturnValue({
      user: null,
      loading: true
    });

    render(
      <PrivateRoute>
        <div data-testid="protected-content">Protected Content</div>
      </PrivateRoute>
    );

    // Check if there's a loading indicator by CSS classes
    const spinner = screen.getByClass('animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('border-blue-500');

    // Content should not be displayed
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  test('shows loading spinner when user is not authenticated', () => {
    // Simulate not loaded but unauthenticated session
    useAuthMock.mockReturnValue({
      user: null,
      loading: false
    });

    render(
      <PrivateRoute>
        <div data-testid="protected-content">Protected Content</div>
      </PrivateRoute>
    );

    // Check if loading indicator is still shown despite loading=false
    // This is because the component shows an indicator when user=null
    const spinner = screen.getByClass('animate-spin');
    expect(spinner).toBeInTheDocument();

    // Check if content is not displayed
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  test('renders children when user is authenticated', () => {
    // Simulate authenticated user
    useAuthMock.mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      loading: false
    });

    render(
      <PrivateRoute>
        <div data-testid="protected-content">Protected Content</div>
      </PrivateRoute>
    );

    // Check if content is displayed
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();

    // Check if there's no loading indicator
    expect(screen.queryByClass('animate-spin')).not.toBeInTheDocument();

    // Check if no redirect was called
    expect(routerPushMock).not.toHaveBeenCalled();
  });
});

// Add helper functions for tests
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

// Extend screen object
screen.getByClass = function(className: string): HTMLElement {
  return getByClass(document.body, className);
};

screen.queryByClass = function(className: string): HTMLElement | null {
  return queryByClass(document.body, className);
};