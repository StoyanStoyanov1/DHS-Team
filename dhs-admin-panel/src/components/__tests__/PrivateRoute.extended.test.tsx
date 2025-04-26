// src/components/__tests__/PrivateRoute.extended.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrivateRoute from '../PriveteRoute';
import { useAuth } from '@/src/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';

// Mocking dependencies
jest.mock('@/src/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

describe('PrivateRoute - Extended Tests', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (usePathname as jest.Mock).mockReturnValue('/protected-page');
  });

  test('should render children when user is authenticated', async () => {
    // Arrange
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com', roles: ['user'] },
      loading: false,
    });

    // Act
    render(
      <PrivateRoute>
        <div data-testid="protected-content">Protected Content</div>
      </PrivateRoute>
    );

    // Assert
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  test('should show loading indicator when authentication check is in progress', () => {
    // Arrange
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: true,
    });

    // Act
    const { container } = render(
      <PrivateRoute>
        <div data-testid="protected-content">Protected Content</div>
      </PrivateRoute>
    );

    // Assert
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    // Check for loading spinner by CSS class
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  test('should redirect to login when user is not authenticated', async () => {
    // Arrange
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
    });

    // Act
    render(
      <PrivateRoute>
        <div data-testid="protected-content">Protected Content</div>
      </PrivateRoute>
    );

    // Assert
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login?redirect=%2Fprotected-page');
    });
  });

  test('should redirect to login with root path when pathname is undefined', async () => {
    // Arrange
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
    });
    (usePathname as jest.Mock).mockReturnValue(undefined);

    // Act
    render(
      <PrivateRoute>
        <div data-testid="protected-content">Protected Content</div>
      </PrivateRoute>
    );

    // Assert
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login?redirect=%2F');
    });
  });

  test('should encode special characters in redirect path', async () => {
    // Arrange
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
    });
    (usePathname as jest.Mock).mockReturnValue('/dashboard?query=test&filter=active');

    // Act
    render(
      <PrivateRoute>
        <div data-testid="protected-content">Protected Content</div>
      </PrivateRoute>
    );

    // Assert
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login?redirect=')
      );
      // Check that special characters are properly encoded
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringMatching(/redirect=%2Fdashboard%3Fquery%3Dtest%26filter%3Dactive/)
      );
    });
  });
});