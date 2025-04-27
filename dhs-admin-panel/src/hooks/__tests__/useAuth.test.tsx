import React from 'react';
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuth, AuthProvider } from '@/src/hooks/useAuth';

// Мокиране на next/navigation
jest.mock('next/navigation', () => ({
  ...jest.requireActual('../../__mocks__/next-navigation'),
}));

// Мокиране на auth.service
jest.mock('@/src/services/auth.service', () => ({
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn(),
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  // Импортираме auth.service директно след мокирането му
  const authService = require('@/src/services/auth.service');

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>
      {children}
    </AuthProvider>
  );

  test('checks that hook provides expected methods and properties', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    (authService.getCurrentUser as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Проверяваме, че основните свойства и методи съществуват
    expect(result.current.login).toBeDefined();
    expect(result.current.logout).toBeDefined();
    expect(result.current.register).toBeDefined();
    expect(result.current.clearErrors).toBeDefined();
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('validationErrors');
  });

  test('calls login method with correct credentials', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    (authService.getCurrentUser as jest.Mock).mockReturnValue(null);
    (authService.login as jest.Mock).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Извикваме login метода
    await act(async () => {
      await result.current.login({ 
        email: 'test@example.com', 
        password: 'password' 
      });
    });

    // Проверяваме, че authService.login е извикан с правилните параметри
    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  test('calls logout method correctly', async () => {
    const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    (authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser);
    (authService.logout as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Извикваме logout метода
    await act(async () => {
      await result.current.logout();
    });

    // Проверяваме, че authService.logout е извикан
    expect(authService.logout).toHaveBeenCalled();
  });

  test('clears errors when clearErrors is called', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Симулираме грешка с валидацията чрез неуспешен login
    const validationError = {
      email: ['Email is required'],
      password: ['Password is too short'],
    };
    
    (authService.login as jest.Mock).mockRejectedValue({
      response: {
        status: 422,
        data: { errors: validationError }
      }
    });

    // Първо извикваме login, за да породим грешка
    await act(async () => {
      try {
        await result.current.login({ email: '', password: '123' });
      } catch (e) {
        // Очакваме грешка, нормално е
      }
    });

    // След това извикваме clearErrors
    act(() => {
      result.current.clearErrors();
    });

    // Проверяваме, че грешките са изчистени
    expect(result.current.error).toBeNull();
    expect(result.current.validationErrors).toBeNull();
  });
});