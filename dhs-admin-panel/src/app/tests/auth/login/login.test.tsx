// src/app/tests/auth/login/login.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/src/app/auth/login/page';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';

// Mocking dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/src/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Mocking Alert component
jest.mock('@/src/components/Alert', () => {
  return function DummyAlert({ 
    message, 
    type, 
    onClose 
  }: { 
    message: string; 
    type: string; 
    onClose: () => void 
  }) {
    return (
      <div data-testid="alert" className={`alert-${type}`}>
        {message}
        <button onClick={onClose} data-testid="close-alert">Close</button>
      </div>
    );
  };
});

jest.mock('lucide-react', () => ({
  Eye: () => <div data-testid="eye-icon" />,
  EyeOff: () => <div data-testid="eye-off-icon" />,
  LogIn: () => <div data-testid="login-icon" />,
}));

describe('LoginPage', () => {
  const mockLogin = jest.fn();
  const mockClearErrors = jest.fn();
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setting up base mock values
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
    
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: null,
      loading: false,
      validationErrors: null,
      clearErrors: mockClearErrors,
      user: null
    });
  });
  
  test('renders login form with all necessary elements', () => {
    render(<LoginPage />);
    
    // Check title and subtitle
    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account to continue')).toBeInTheDocument();
    
    // Check form elements
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    
    // Check links
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });
  
  test('redirects to dashboard if user is already logged in', () => {
    // Mock state where user is already logged in
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: null,
      loading: false,
      validationErrors: null,
      clearErrors: mockClearErrors,
      user: { email: 'test@example.com' }
    });
    
    render(<LoginPage />);
    
    // Check if redirect to home page has been called
    expect(mockPush).toHaveBeenCalledWith('/');
  });
  
  test('toggles password visibility when eye icon is clicked', async () => {
    render(<LoginPage />);
    
    // Find password field and visibility icon
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: '' }); // Toggle button has no text
    
    // Check initial field type
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click the icon to toggle visibility
    await userEvent.click(toggleButton);
    
    // Check if field type has changed to 'text'
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click again to revert to hidden password
    await userEvent.click(toggleButton);
    
    // Check if field type has reverted to 'password'
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
  
  test('submits form with entered credentials', async () => {
    render(<LoginPage />);
    
    // Fill form with valid data
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByLabelText(/remember me/i));
    
    // Submit the form
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(signInButton);
    
    // Check if login function is called with correct data
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });
  
  test('shows authentication error when login fails', async () => {
    const authError = 'Invalid email or password';
    
    // Mock values that simulate an authentication error
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: authError,
      loading: false,
      validationErrors: null,
      clearErrors: mockClearErrors,
      user: null
    });
    
    render(<LoginPage />);
    
    // Check if error message is displayed
    expect(screen.getByText(authError)).toBeInTheDocument();
  });
  
  test('shows loading state when login is in progress', async () => {
    // Mock loading state
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: null,
      loading: true,
      validationErrors: null,
      clearErrors: mockClearErrors,
      user: null
    });
    
    render(<LoginPage />);
    
    // Check if button shows loading state
    expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
  });
});