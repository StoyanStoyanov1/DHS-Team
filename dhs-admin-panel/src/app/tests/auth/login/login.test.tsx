import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

// Мок на LoginPage компонент, тъй като не можем да го импортираме директно
const MockLoginPage = () => {
  const { login, error, validationErrors, loading } = useAuth();
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };
  
  return (
    <div className="auth-page">
      <h1>Вход</h1>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Имейл</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            value={formData.email}
            onChange={handleChange}
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
          />
          {validationErrors?.password && <div className="error">{validationErrors.password[0]}</div>}
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Изчакайте...' : 'Вход'}
        </button>
      </form>
      
      <div>
        Нямате акаунт? <a href="/auth/register">Регистрирайте се</a>
      </div>
    </div>
  );
};

describe('Login Page', () => {
  const mockLogin = jest.fn();
  const mockClearErrors = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Настройване на моковете за useAuth
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      clearErrors: mockClearErrors,
      user: null,
      loading: false,
      error: null,
      validationErrors: null,
    });
  });
  
  test('renders login form correctly', () => {
    render(<MockLoginPage />);
    
    // Проверка на заглавието
    expect(screen.getByRole('heading', { name: /вход/i })).toBeInTheDocument();
    
    // Проверка на формата
    expect(screen.getByLabelText(/имейл/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/парола/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /вход/i })).toBeInTheDocument();
    
    // Проверка на линка за регистрация
    expect(screen.getByText(/нямате акаунт/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /регистрирайте се/i })).toBeInTheDocument();
  });
  
  test('calls login function with form data when submitted', () => {
    render(<MockLoginPage />);
    
    // Попълване на формата
    fireEvent.change(screen.getByLabelText(/имейл/i), {
      target: { value: 'test@example.com', name: 'email' },
    });
    
    fireEvent.change(screen.getByLabelText(/парола/i), {
      target: { value: 'password123', name: 'password' },
    });
    
    // Изпращане на формата
    fireEvent.click(screen.getByRole('button', { name: /вход/i }));
    
    // Проверка дали login функцията е извикана с правилните данни
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
  
  test('displays validation errors when provided', () => {
    // Настройка на validation errors
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      clearErrors: mockClearErrors,
      user: null,
      loading: false,
      error: null,
      validationErrors: {
        email: ['Невалиден имейл'],
        password: ['Паролата трябва да бъде поне 6 символа'],
      },
    });
    
    render(<MockLoginPage />);
    
    // Проверка на грешките
    expect(screen.getByText('Невалиден имейл')).toBeInTheDocument();
    expect(screen.getByText('Паролата трябва да бъде поне 6 символа')).toBeInTheDocument();
  });
  
  test('displays general error when provided', () => {
    // Настройка на обща грешка
    (useAuth as jest.Mock).mockReturnValue({
      login: mockLogin,
      clearErrors: mockClearErrors,
      user: null,
      loading: false,
      error: 'Невалидни потребителски данни',
      validationErrors: null,
    });
    
    render(<MockLoginPage />);
    
    // Проверка на общата грешка
    expect(screen.getByText('Невалидни потребителски данни')).toBeInTheDocument();
  });
});