import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from './login-form';
import { LanguageProvider } from '@/context/language/LanguageContext';

// Mock the translations
jest.mock('@/utils/translate/authTranslate', () => ({
  __esModule: true,
  default: {
    en: {
      loginToYourAccount: 'Login to your account',
      welcomeBack: 'Welcome back',
      email: 'Email',
      password: 'Password',
      enterYourPassword: 'Enter your password',
      forgotYourPassword: 'Forgot your password?',
      login: 'Login',
      orContinueWith: 'Or continue with',
      emailFormat: 'Please enter a valid email address'
    },
    bg: {
      loginToYourAccount: 'Влезте в профила си',
      welcomeBack: 'Добре дошли отново',
      email: 'Имейл',
      password: 'Парола',
      enterYourPassword: 'Въведете вашата парола',
      forgotYourPassword: 'Забравена парола?',
      login: 'Вход',
      orContinueWith: 'Или продължете с',
      emailFormat: 'Моля, въведете валиден имейл адрес'
    }
  }
}));

// Mock the language context
jest.mock('@/context/language/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' }),
  LanguageProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, variants, animate, ...props }: any) => (
      <div data-testid="motion-div" data-animate={animate} {...props}>
        {children}
      </div>
    ),
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>
  }
}));

const renderLoginForm = () => {
  return render(
    <LanguageProvider>
      <LoginForm />
    </LanguageProvider>
  );
};

describe('LoginForm', () => {
  test('renders login form with all elements', () => {
    render(<LoginForm />);

    // Check for main headings
    expect(screen.getByText('Login to your account')).toBeInTheDocument();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();

    // Check for form elements
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('user@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();

    // Check for buttons and links
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Forgot your password?')).toBeInTheDocument();
    expect(screen.getByText('Or continue with')).toBeInTheDocument();
    expect(screen.getByText('Google')).toBeInTheDocument();
  });

  test('toggles password visibility', () => {
    render(<LoginForm />);
    
    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByLabelText('Show password');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Hide password'));
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('Show password')).toBeInTheDocument();
  });

  test('validates email format', () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByText('Login');

    // Test invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();

    // Test valid email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
  });

  test('handles form input changes', () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('applies focus animations', () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    // Focus email input
    fireEvent.focus(emailInput);
    const emailMotionDivs = screen.getAllByTestId('motion-div');
    const emailMotionDiv = emailMotionDivs.find(div => 
      div.contains(emailInput) && !div.contains(passwordInput)
    );
    expect(emailMotionDiv).toBeTruthy();
    expect(emailMotionDiv?.getAttribute('data-animate')).toBe('focus');

    // Focus password input
    fireEvent.focus(passwordInput);
    const passwordMotionDivs = screen.getAllByTestId('motion-div');
    const passwordMotionDiv = passwordMotionDivs.find(div => 
      div.contains(passwordInput) && !div.contains(emailInput)
    );
    expect(passwordMotionDiv).toBeTruthy();
    expect(passwordMotionDiv?.getAttribute('data-animate')).toBe('focus');

    // Blur inputs
    fireEvent.blur(emailInput);
    expect(emailMotionDiv?.getAttribute('data-animate')).toBe('blur');

    fireEvent.blur(passwordInput);
    expect(passwordMotionDiv?.getAttribute('data-animate')).toBe('blur');
  });

  test('prevents form submission with invalid email', () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByText('Login');
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });
}); 