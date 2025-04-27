/**
 * Разширени тестове за auth.service.ts
 * Тези тестове покриват допълнителни функции и сценарии, които не са включени в основните тестове
 */

import authService, { TokenPayload } from '../auth.service';
import api from '../api';
import { jwtDecode } from 'jwt-decode';

jest.mock('../api', () => ({
  post: jest.fn(),
}));

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn(),
}));

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

const mockToken = 'mock.jwt.token';
const mockDecodedToken: TokenPayload = {
  exp: Math.floor(Date.now() / 1000) + 3600,
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
    (jwtDecode as jest.Mock).mockReturnValue(mockDecodedToken);
  });

  describe('Register Functionality', () => {
    test('should register a user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        password_confirm: 'Password123!'
      };

      (api.post as jest.Mock).mockResolvedValueOnce({
        data: { token: mockToken, message: 'User registered successfully' }
      });

      const result = await authService.register(userData);

      expect(api.post).toHaveBeenCalledWith('/api/auth/sign-up', userData);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', mockToken);
      expect(result).toEqual(mockDecodedToken);
    });

    test('should handle registration validation errors', async () => {
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

      await expect(authService.register(userData)).rejects.toEqual(validationError);
    });
  });

  describe('Token Management', () => {
    test('should correctly identify an authenticated user with valid token', () => {
      localStorageMock.setItem('access_token', mockToken);

      const isAuthenticated = authService.isAuthenticated();

      expect(isAuthenticated).toBe(true);
      expect(jwtDecode).toHaveBeenCalledWith(mockToken);
    });

    test('should identify as not authenticated with expired token', () => {
      localStorageMock.setItem('access_token', 'expired.token');
      
      const expiredToken = { ...mockDecodedToken, exp: Math.floor(Date.now() / 1000) - 3600 };
      (jwtDecode as jest.Mock).mockReturnValueOnce(expiredToken);

      const isAuthenticated = authService.isAuthenticated();

      expect(isAuthenticated).toBe(false);
    });

    test('should identify as not authenticated with no token', () => {
      const isAuthenticated = authService.isAuthenticated();

      expect(isAuthenticated).toBe(false);
      expect(jwtDecode).not.toHaveBeenCalled();
    });

    test('should return null user when token is invalid', () => {
      localStorageMock.setItem('access_token', 'invalid.token');
      (jwtDecode as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Invalid token');
      });

      const currentUser = authService.getCurrentUser();

      expect(currentUser).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
    });
  });

  describe('Logout Functionality', () => {
    test('should clear token on logout', async () => {
      localStorageMock.setItem('access_token', mockToken);
      (api.post as jest.Mock).mockResolvedValueOnce({});

      await authService.logout();

      expect(api.post).toHaveBeenCalledWith('/api/auth/sign-out');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
    });

    test('should handle logout API failure gracefully', async () => {
      localStorageMock.setItem('access_token', mockToken);
      (api.post as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      
      const originalConsoleError = console.error;
      console.error = jest.fn();

      await authService.logout();

      expect(api.post).toHaveBeenCalledWith('/api/auth/sign-out');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
      expect(console.error).toHaveBeenCalled();
      
      console.error = originalConsoleError;
    });
  });

  describe('Token Refresh', () => {
    test('should refresh token successfully', async () => {
      const newToken = 'new.jwt.token';
      (api.post as jest.Mock).mockResolvedValueOnce({
        data: { token: newToken }
      });

      await (authService as any).refreshToken();

      expect(api.post).toHaveBeenCalledWith('/api/auth/refresh');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', newToken);
    });

    test('should clear token if refresh fails', async () => {
      localStorageMock.setItem('access_token', mockToken);
      (api.post as jest.Mock).mockRejectedValueOnce(new Error('Refresh failed'));
      
      const originalConsoleError = console.error;
      console.error = jest.fn();

      await (authService as any).refreshToken();

      expect(api.post).toHaveBeenCalledWith('/api/auth/refresh');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
      expect(console.error).toHaveBeenCalled();
      
      console.error = originalConsoleError;
    });
  });
});