// src/hooks/__tests__/AuthProvider.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider } from '../useAuth';
import authService from '../../services/auth.service';
import { useRouter } from 'next/navigation';

// Mocking the necessary dependencies
jest.mock('../../services/auth.service', () => ({
  getCurrentUser: jest.fn(),
  isAuthenticated: jest.fn()
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn()
    });
  });

  test('should check for current user on initial render', async () => {
    // Mock the getCurrentUser to simulate a logged-in user
    const mockUser = { email: 'test@example.com', roles: ['user'] };
    (authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser);
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);

    render(
      <AuthProvider>
        <div data-testid="test-child">Test Child Component</div>
      </AuthProvider>
    );

    // Verify the child component renders
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    
    // Verify getCurrentUser was called during initialization
    await waitFor(() => {
      expect(authService.getCurrentUser).toHaveBeenCalled();
    });
  });

  test('should render children when user is not authenticated', async () => {
    // Mock the getCurrentUser to simulate no user logged in
    (authService.getCurrentUser as jest.Mock).mockReturnValue(null);
    (authService.isAuthenticated as jest.Mock).mockReturnValue(false);

    render(
      <AuthProvider>
        <div data-testid="test-child">Test Child Component</div>
      </AuthProvider>
    );

    // Verify the child component still renders
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    
    // Verify getCurrentUser was called
    await waitFor(() => {
      expect(authService.getCurrentUser).toHaveBeenCalled();
    });
  });

  test('should not redirect if user is authenticated', async () => {
    // Mock the getCurrentUser to simulate a logged-in user
    const mockUser = { email: 'test@example.com', roles: ['user'] };
    (authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser);
    (authService.isAuthenticated as jest.Mock).mockReturnValue(true);
    
    const mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(
      <AuthProvider>
        <div data-testid="test-child">Test Child Component</div>
      </AuthProvider>
    );

    // Verify router.push was not called
    await waitFor(() => {
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
});