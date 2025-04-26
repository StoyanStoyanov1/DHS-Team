// src/app/tests/auth/register/register.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import RegisterPage from '@/src/app/auth/register/page';
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
  UserPlus: () => <div data-testid="user-plus-icon" />,
}));

describe('RegisterPage', () => {
  const mockRegister = jest.fn();
  const mockClearErrors = jest.fn();
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setting up base mock values
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
    
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      error: null,
      loading: false,
      validationErrors: null,
      clearErrors: mockClearErrors,
      user: null
    });
  });
  
  test('renders registration form with all necessary elements', () => {
    render(<RegisterPage />);
    
    // Check title and subtitle
    expect(screen.getByText('Create your account')).toBeInTheDocument();
    expect(screen.getByText('Sign up to get started with our platform')).toBeInTheDocument();
    
    // Check form elements
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/i agree to the/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    
    // Check links
    expect(screen.getByText(/terms of service/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });
  
  test('redirects to dashboard if user is already logged in', () => {
    // Mock state where user is already logged in
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      error: null,
      loading: false,
      validationErrors: null,
      clearErrors: mockClearErrors,
      user: { email: 'test@example.com' }
    });
    
    render(<RegisterPage />);
    
    // Check if redirect to home page has been called
    expect(mockPush).toHaveBeenCalledWith('/');
  });
  
  test('toggles password visibility when eye icons are clicked', async () => {
    render(<RegisterPage />);
    
    // Find password fields and visibility icons
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const toggleButtons = screen.getAllByRole('button', { name: '' }); // Toggle buttons have no text
    
    // Check initial field types
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    
    // Click the first icon (for main password)
    await userEvent.click(toggleButtons[0]);
    
    // Check if password field type has changed to 'text'
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click the second icon (for confirm password)
    await userEvent.click(toggleButtons[1]);
    
    // Check if confirm password field type has changed to 'text'
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });
  
  test('shows validation error when terms are not accepted', async () => {
    render(<RegisterPage />);
    
    // Fill form with valid data but without accepting terms
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'Password123!');
    
    // Submit the form
    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(createAccountButton);
    
    // Check if terms validation error is shown
    expect(screen.getByText(/you must agree to the terms/i)).toBeInTheDocument();
    
    // Check if register function has not been called
    expect(mockRegister).not.toHaveBeenCalled();
  });
  
  test('calls register function with correct credentials when form is valid', async () => {
    render(<RegisterPage />);
    
    // Fill form with valid data
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'Password123!');
    await userEvent.click(screen.getByLabelText(/i agree to the/i));
    
    // Submit the form
    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(createAccountButton);
    
    // Check if register function is called with correct data
    expect(mockRegister).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password123!',
      password_confirm: 'Password123!'
    });
  });
  
  test('shows authentication error when registration fails', async () => {
    const authError = 'Email already in use';
    
    // Mock values that simulate an error during registration
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      error: authError,
      loading: false,
      validationErrors: null,
      clearErrors: mockClearErrors,
      user: null
    });
    
    render(<RegisterPage />);
    
    // Check if error message is displayed
    expect(screen.getByText(authError)).toBeInTheDocument();
  });
  
  test('shows loading state when registration is in progress', async () => {
    // Mock loading state
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      error: null,
      loading: true,
      validationErrors: null,
      clearErrors: mockClearErrors,
      user: null
    });
    
    render(<RegisterPage />);
    
    // Check if button shows loading state
    expect(screen.getByRole('button', { name: /creating account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
  });
});