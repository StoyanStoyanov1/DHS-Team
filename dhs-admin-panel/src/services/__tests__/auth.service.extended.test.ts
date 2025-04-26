// src/services/__tests__/auth.service.extended.test.ts
/**
 * Разширени тестове за auth.service.ts
 * Тези тестове покриват допълнителни функции и сценарии, които не са включени в основните тестове
 */

import authService, { TokenPayload } from '../auth.service';
import api from '../api';
import { jwtDecode } from 'jwt-decode';

// Мокване на зависимостите
jest.mock('../api', () => ({
  post: jest.fn(),
}));

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

// Мокваме localStorage за тестване в node среда
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Създаваме тестов токен и данни за декодиране
const mockToken = 'mock.jwt.token';
const mockDecodedToken: TokenPayload = {
  exp: Math.floor(Date.now() / 1000) + 3600, // валиден за 1 час
  iat: Math.floor(Date.now() / 1000),
  sub: 'user123',
  email: 'test@example.com',
  roles: ['user'],
  iss: 'test-issuer',
  jti: 'token-id',
};

describe('AuthService - Extended Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    // Настройка по подразбиране за jwtDecode mock
    (jwtDecode as jest.Mock).mockReturnValue(mockDecodedToken);
  });

  describe('Register Functionality', () => {
    test('should register a user successfully', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        password_confirm: 'Password123!'
      };

      (api.post as jest.Mock).mockResolvedValueOnce({
        data: { token: mockToken, message: 'User registered successfully' }
      });

      // Act
      const result = await authService.register(userData);

      // Assert
      expect(api.post).toHaveBeenCalledWith('/api/auth/sign-up', userData);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', mockToken);
      expect(result).toEqual(mockDecodedToken);
    });

    test('should handle registration validation errors', async () => {
      // Arrange
      const userData = {
        email: 'invalid-email',
        password: 'weak',
        password_confirm: 'doesntmatch'
      };

      const validationError = {
        response: {
          status: 422,
          data: {
            message: 'Validation failed',
            errors: {
              email: ['Invalid email format'],
              password: ['Password is too weak'],
              password_confirm: ['Passwords do not match']
            }
          }
        }
      };

      (api.post as jest.Mock).mockRejectedValueOnce(validationError);

      // Act & Assert
      await expect(authService.register(userData)).rejects.toEqual(validationError);
    });
  });

  describe('Token Management', () => {
    test('should correctly identify an authenticated user with valid token', () => {
      // Arrange
      localStorageMock.setItem('access_token', mockToken);

      // Act
      const isAuthenticated = authService.isAuthenticated();

      // Assert
      expect(isAuthenticated).toBe(true);
      expect(jwtDecode).toHaveBeenCalledWith(mockToken);
    });

    test('should identify as not authenticated with expired token', () => {
      // Arrange
      localStorageMock.setItem('access_token', 'expired.token');
      
      // Mocked token is expired
      const expiredToken = { ...mockDecodedToken, exp: Math.floor(Date.now() / 1000) - 3600 };
      (jwtDecode as jest.Mock).mockReturnValueOnce(expiredToken);

      // Act
      const isAuthenticated = authService.isAuthenticated();

      // Assert
      expect(isAuthenticated).toBe(false);
    });

    test('should identify as not authenticated with no token', () => {
      // Arrange - no token in localStorage

      // Act
      const isAuthenticated = authService.isAuthenticated();

      // Assert
      expect(isAuthenticated).toBe(false);
      expect(jwtDecode).not.toHaveBeenCalled();
    });

    test('should return null user when token is invalid', () => {
      // Arrange
      localStorageMock.setItem('access_token', 'invalid.token');
      (jwtDecode as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      // Act
      const currentUser = authService.getCurrentUser();

      // Assert
      expect(currentUser).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
    });
  });

  describe('Logout Functionality', () => {
    test('should clear token on logout', async () => {
      // Arrange
      localStorageMock.setItem('access_token', mockToken);
      (api.post as jest.Mock).mockResolvedValueOnce({});

      // Act
      await authService.logout();

      // Assert
      expect(api.post).toHaveBeenCalledWith('/api/auth/sign-out');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
    });

    test('should handle logout API failure gracefully', async () => {
      // Arrange
      localStorageMock.setItem('access_token', mockToken);
      (api.post as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      
      // Mock console.error to prevent actual logging in tests
      const originalConsoleError = console.error;
      console.error = jest.fn();

      // Act
      await authService.logout();

      // Assert
      expect(api.post).toHaveBeenCalledWith('/api/auth/sign-out');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
      expect(console.error).toHaveBeenCalled();
      
      // Restore console.error
      console.error = originalConsoleError;
    });
  });

  describe('Token Refresh', () => {
    test('should refresh token successfully', async () => {
      // Arrange
      const newToken = 'new.jwt.token';
      (api.post as jest.Mock).mockResolvedValueOnce({
        data: { token: newToken }
      });

      // Act
      await (authService as any).refreshToken();

      // Assert
      expect(api.post).toHaveBeenCalledWith('/api/auth/refresh');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', newToken);
    });

    test('should clear token if refresh fails', async () => {
      // Arrange
      localStorageMock.setItem('access_token', mockToken);
      (api.post as jest.Mock).mockRejectedValueOnce(new Error('Refresh failed'));
      
      // Mock console.error
      const originalConsoleError = console.error;
      console.error = jest.fn();

      // Act
      await (authService as any).refreshToken();

      // Assert
      expect(api.post).toHaveBeenCalledWith('/api/auth/refresh');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
      expect(console.error).toHaveBeenCalled();
      
      // Restore console.error
      console.error = originalConsoleError;
    });
  });
});