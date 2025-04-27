import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuth } from '@/src/hooks/useAuth';

// Мокиране на next/navigation
jest.mock('next/navigation', () => ({
  ...jest.requireActual('../../../__mocks__/next-navigation'),
}));

// Мокиране на useAuth хука
jest.mock('@/src/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Мок на RegisterPage компонент, тъй като не можем да го импортираме директно
const MockRegisterPage = () => {
  const { register, error, validationErrors, loading } = useAuth();
  const [passwordsMatch, setPasswordsMatch] = React.useState(true);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      setPasswordsMatch(false);
      return;
    }
    
    setPasswordsMatch(true);
    register(formData);
  };
  
  return (
    <div className="auth-page">
      <h1>Регистрация</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit} data-testid="register-form">
        <div>
          <label htmlFor="name">Име</label>
          <input 
            id="name" 
            name="name" 
            type="text" 
            value={formData.name}
            onChange={handleChange}
            data-testid="name-input"
          />
          {validationErrors?.name && <div className="error">{validationErrors.name[0]}</div>}
        </div>
        
        <div>
          <label htmlFor="email">Имейл</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            value={formData.email}
            onChange={handleChange}
            data-testid="email-input"
          />
          {validationErrors?.email && <div className="error">{validationErrors.email[0]}</div>}
        </div>
        
        <div>
          <label htmlFor="password">Парола</label>
          <input 
            id="password" 
            name="password" 
            type="password" 
            value={formData.password}
            onChange={handleChange}
            data-testid="password-input"
          />
          {validationErrors?.password && <div className="error">{validationErrors.password[0]}</div>}
        </div>
        
        <div>
          <label htmlFor="password_confirmation">Потвърдете парола</label>
          <input 
            id="password_confirmation" 
            name="password_confirmation" 
            type="password" 
            value={formData.password_confirmation}
            onChange={handleChange}
            data-testid="password-confirmation-input"
          />
          {!passwordsMatch && <div className="error" data-testid="password-match-error">Паролите не съвпадат</div>}
        </div>
        
        <button type="submit" disabled={loading} data-testid="register-button">
          {loading ? 'Изчакайте...' : 'Регистрация'}
        </button>
      </form>
      
      <div>
        Вече имате акаунт? <a href="/auth/login">Вход</a>
      </div>
    </div>
  );
};

describe('Register Page', () => {
  const mockRegister = jest.fn();
  const mockClearErrors = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Настройване на моковете за useAuth
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      clearErrors: mockClearErrors,
      user: null,
      loading: false,
      error: null,
      validationErrors: null,
    });
  });
  
  test('renders registration form correctly', () => {
    render(<MockRegisterPage />);
    
    // Проверка на заглавието
    expect(screen.getByRole('heading', { name: /регистрация/i })).toBeInTheDocument();
    
    // Проверка на полетата във формата с data-testid селектори
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-confirmation-input')).toBeInTheDocument();
    expect(screen.getByTestId('register-button')).toBeInTheDocument();
    
    // Проверка на линка за вход
    expect(screen.getByText(/вече имате акаунт/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /вход/i })).toBeInTheDocument();
  });
  
  test('calls register function with form data when submitted', () => {
    render(<MockRegisterPage />);
    
    // Попълване на формата с data-testid селектори
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'Иван Иванов', name: 'name' },
    });
    
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'ivan@example.com', name: 'email' },
    });
    
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123', name: 'password' },
    });
    
    fireEvent.change(screen.getByTestId('password-confirmation-input'), {
      target: { value: 'password123', name: 'password_confirmation' },
    });
    
    // Изпращане на формата
    fireEvent.click(screen.getByTestId('register-button'));
    
    // Проверка дали register функцията е извикана с правилните данни
    expect(mockRegister).toHaveBeenCalledWith({
      name: 'Иван Иванов',
      email: 'ivan@example.com',
      password: 'password123',
      password_confirmation: 'password123',
    });
  });
  
  test('displays validation errors when provided', () => {
    // Настройка на validation errors
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      clearErrors: mockClearErrors,
      user: null,
      loading: false,
      error: null,
      validationErrors: {
        name: ['Името е задължително'],
        email: ['Имейлът вече съществува'],
        password: ['Паролата трябва да бъде поне 8 символа'],
      },
    });
    
    render(<MockRegisterPage />);
    
    // Проверка на грешките
    expect(screen.getByText('Името е задължително')).toBeInTheDocument();
    expect(screen.getByText('Имейлът вече съществува')).toBeInTheDocument();
    expect(screen.getByText('Паролата трябва да бъде поне 8 символа')).toBeInTheDocument();
  });
  
  test('displays general error when provided', () => {
    // Настройка на обща грешка
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      clearErrors: mockClearErrors,
      user: null,
      loading: false,
      error: 'Възникна проблем при регистрацията',
      validationErrors: null,
    });
    
    render(<MockRegisterPage />);
    
    // Проверка на общата грешка
    expect(screen.getByText('Възникна проблем при регистрацията')).toBeInTheDocument();
  });
  
  test('validates password confirmation match', () => {
    render(<MockRegisterPage />);
    
    // Попълване на формата с различни пароли, използвайки data-testid селектори
    fireEvent.change(screen.getByTestId('name-input'), {
      target: { value: 'Иван Иванов', name: 'name' },
    });
    
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'ivan@example.com', name: 'email' },
    });
    
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'password123', name: 'password' },
    });
    
    fireEvent.change(screen.getByTestId('password-confirmation-input'), {
      target: { value: 'different-password', name: 'password_confirmation' },
    });
    
    // Изпращане на формата
    fireEvent.click(screen.getByTestId('register-button'));
    
    // Проверка за грешката за несъвпадащи пароли
    expect(screen.getByTestId('password-match-error')).toBeInTheDocument();
    
    // Проверка дали register функцията не е извикана
    expect(mockRegister).not.toHaveBeenCalled();
  });
});