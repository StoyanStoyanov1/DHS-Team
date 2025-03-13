import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from './login-form';
import { LanguageProvider } from '@/context/language/LanguageContext';
import userEvent from '@testing-library/user-event';

jest.mock('@/utils/translate/authTranslate', () => ({
  default: {
    en: {
      loginToYourAccount: 'Login to your account',
      // other translations
    },
    bg: {
      // translations
    }
  }
}));

describe('LoginForm', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  const renderLoginForm = () => {
    return render(
      <LanguageProvider>
        <LoginForm />
      </LanguageProvider>
    );
  };

  test('renders login form with all elements', () => {
    renderLoginForm();

    // Check for main headings
    expect(screen.getByText('Login to your account')).toBeInTheDocument();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();

    // Check for form elements
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('user@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();

    // Check for buttons and links
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByText('Forgot your password?')).toBeInTheDocument();
    expect(screen.getByText('Or continue with')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
  });

  test('toggles password visibility', async () => {
    renderLoginForm();
    const user = userEvent.setup();
    
    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByLabelText('Show password');
    
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Use userEvent instead of fireEvent for better simulation
    await user.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Hide password'));
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('Show password')).toBeInTheDocument();
  });

  test('validates email format', async () => {
    renderLoginForm();
    const user = userEvent.setup();
    
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: 'Login' });

    // Test invalid email
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);
    
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

    // Clear and test valid email
    await user.clear(emailInput);
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
  });

  test('handles form input changes', async () => {
    renderLoginForm();
    const user = userEvent.setup();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('applies focus animations', async () => {
    renderLoginForm();
    const user = userEvent.setup();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    // Focus email input
    await user.click(emailInput);
    const emailMotionDivs = screen.getAllByTestId('motion-div');
    const emailMotionDiv = emailMotionDivs.find(div => 
      div.contains(emailInput) && !div.contains(passwordInput)
    );
    expect(emailMotionDiv).toHaveAttribute('data-animate', 'focus');

    // Focus password input
    await user.click(passwordInput);
    const passwordMotionDivs = screen.getAllByTestId('motion-div');
    const passwordMotionDiv = passwordMotionDivs.find(div => 
      div.contains(passwordInput) && !div.contains(emailInput)
    );
    expect(passwordMotionDiv).toHaveAttribute('data-animate', 'focus');

    // Blur inputs by clicking elsewhere
    await user.click(document.body);
    expect(emailMotionDiv).toHaveAttribute('data-animate', 'blur');
    expect(passwordMotionDiv).toHaveAttribute('data-animate', 'blur');
  });

  test('submits form with valid data', async () => {
    const mockSubmit = jest.fn();
    // Mock form submission
    jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation(mockSubmit);
    
    renderLoginForm();
    const user = userEvent.setup();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Check if form would submit with valid data
    await waitFor(() => {
      expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
    });
  });

  test('handles Google login button click', async () => {
    const mockGoogleLogin = jest.fn();
    // You might need to mock your Google login function
    global.window.open = mockGoogleLogin;
    
    renderLoginForm();
    const user = userEvent.setup();
    
    const googleButton = screen.getByText('Google').closest('button');
    expect(googleButton).toBeInTheDocument();
    
    if (googleButton) {
      await user.click(googleButton);
      expect(mockGoogleLogin).toHaveBeenCalled();
    }
  });
});