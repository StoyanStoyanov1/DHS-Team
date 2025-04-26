import { renderHook, act } from '@testing-library/react';
import { useAuth, AuthProvider } from '../useAuth';
import authService from '../../services/auth.service';
import { ReactNode } from 'react';

// Мокваме authService
jest.mock('../../services/auth.service', () => ({
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  getCurrentUser: jest.fn(),
  isAuthenticated: jest.fn()
}));

// Мокваме useRouter
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

// Помощен компонент за тестване на hook
const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Нулираме mock имплементациите
    (authService.getCurrentUser as jest.Mock).mockReturnValue(null);
  });

  test('should update user when authentication is successful', async () => {
    const mockUser = { email: 'test@example.com', roles: ['admin'] };
    (authService.login as jest.Mock).mockResolvedValue(mockUser);
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Извършваме login action
    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password' });
    });
    
    // Проверяваме дали потребителят е обновен в state
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('should handle login with validation errors', async () => {
    // Симулиране на грешка при валидация
    const validationError = {
      response: {
        status: 422,
        data: {
          message: 'Validation failed',
          errors: {
            email: ['Invalid email format']
          }
        }
      }
    };
    
    (authService.login as jest.Mock).mockRejectedValue(validationError);
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Извършваме login с невалидни данни
    await act(async () => {
      await result.current.login({ email: 'invalid-email', password: 'password' });
    });
    
    // Проверяваме дали валидационните грешки са обработени правилно
    expect(result.current.validationErrors).toEqual({
      email: ['Invalid email format']
    });
    expect(result.current.loading).toBe(false);
  });

  test('should handle successful logout', async () => {
    // Настройваме предварително потребителя да е влязъл
    const mockUser = { email: 'test@example.com', roles: ['admin'] };
    (authService.getCurrentUser as jest.Mock).mockReturnValue(mockUser);
    
    const { result, rerender } = renderHook(() => useAuth(), { wrapper });
    
    // Презареждаме за да приложим ефекта на getCurrentUser
    rerender();
    
    // Проверяваме дали потребителят е зареден
    expect(result.current.user).toEqual(mockUser);
    
    // Изпълняваме logout
    await act(async () => {
      await result.current.logout();
    });
    
    // Проверяваме дали потребителят е изтрит от state
    expect(authService.logout).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
  });

  test('should clear errors when clearErrors is called', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Симулираме грешка с валидацията чрез неуспешен login
    const validationError = {
      response: {
        status: 422,
        data: {
          message: 'Validation failed',
          errors: {
            email: ['Invalid email format']
          }
        }
      }
    };
    
    (authService.login as jest.Mock).mockRejectedValue(validationError);
    
    // Извършваме login с невалидни данни
    await act(async () => {
      await result.current.login({ email: 'invalid-email', password: 'password' });
    });
    
    // Проверяваме дали имаме грешки
    expect(result.current.validationErrors).not.toBeNull();
    
    // Изчистваме грешките
    act(() => {
      result.current.clearErrors();
    });
    
    // Проверяваме дали грешките са изчистени
    expect(result.current.error).toBeNull();
    expect(result.current.validationErrors).toBeNull();
  });
});