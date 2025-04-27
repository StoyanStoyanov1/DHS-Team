import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';
import { useAuth } from '../../hooks/useAuth';

// Мокиране на next/navigation
jest.mock('next/navigation', () => ({
  ...jest.requireActual('../../__mocks__/next-navigation'),
}));

// Мокиране на hooks/useAuth
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('Header Component', () => {
  const mockUseAuth = useAuth as jest.Mock;
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Основна подготовка за мок на router
    const useRouterMock = jest.requireMock('next/navigation').useRouter;
    useRouterMock.mockReturnValue(mockRouter);
    
    // Основна подготовка за мок на useAuth - потребителят е автентикиран
    mockUseAuth.mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      clearErrors: jest.fn(),
      error: null,
      validationErrors: null,
    });
  });

  test('renders correctly when user is logged in', () => {
    render(<Header />);
    
    // Проверка дали основните елементи са рендерирани - проверяваме за инициали в бутона
    const profileButton = screen.getByText('T');
    expect(profileButton).toBeInTheDocument();
    
    // Проверка за бутони в хедъра
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    // Настройване на useAuth мок - потребителят не е автентикиран
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      clearErrors: jest.fn(),
      error: null,
      validationErrors: null,
    });
    
    render(<Header />);
    
    // Проверяваме дали redirect е бил извикан с правилния път
    // (Променен тест да приема въшний параметър redirect добавен към URL)
    expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining('/auth/login'));
  });

  test('opens dropdown when profile button is clicked', () => {
    render(<Header />);
    
    // Намираме бутона с инициалите
    const profileButton = screen.getByText('T');
    
    // Проверяваме, че dropdown не е видим първоначално
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
    
    // Кликваме върху profile бутона
    fireEvent.click(profileButton);
    
    // Проверяваме, че dropdown е станал видим със съдържаниет на имейла и профил линк
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    
    // Проверяваме за Logout бутона, който вероятно се показва като "Log out"
    expect(screen.getByText(/log out/i)).toBeInTheDocument();
  });

  test('logs out when logout button is clicked', async () => {
    const mockLogout = jest.fn().mockResolvedValue(undefined);
    mockUseAuth.mockReturnValue({
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: mockLogout,
      register: jest.fn(),
      clearErrors: jest.fn(),
      error: null,
      validationErrors: null,
    });

    render(<Header />);
    
    // Отваряме dropdown
    const profileButton = screen.getByText('T');
    fireEvent.click(profileButton);
    
    // Кликваме върху logout бутона (който съдържа текста "Log out")
    const logoutButton = screen.getByText(/log out/i);
    fireEvent.click(logoutButton);
    
    // Проверяваме дали logout е извикан
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  test('closes dropdown when clicking outside', () => {
    render(<Header />);
    
    // Отваряме dropdown
    const profileButton = screen.getByText('T');
    fireEvent.click(profileButton);
    
    // Проверяваме, че dropdown е отворен
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    
    // Кликваме извън dropdown (в самия header контейнер)
    fireEvent.mouseDown(screen.getByRole('banner'));
    
    // Проверяваме, че dropdown е затворен
    expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
  });
});