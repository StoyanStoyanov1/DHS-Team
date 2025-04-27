import authService, { 
  LoginCredentials, 
  RegisterCredentials, 
  TokenPayload 
} from '../auth.service';
import api from '../api';

jest.mock('../api', () => ({
  post: jest.fn(),
}));

jest.mock('jwt-decode', () => ({
  jwtDecode: () => ({
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
    sub: '123',
    email: 'test@example.com',
    roles: ['admin'],
    iss: 'test-issuer',
    jti: 'test-jti',
  })
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string): string | null => {
      return store[key] || null;
    },
    setItem: (key: string, value: string): void => {
      store[key] = value;
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('AuthService', () => {
  const mockToken = 'mock-jwt-token';
  const mockTokenPayload: TokenPayload = {
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
    sub: '123',
    email: 'test@example.com',
    roles: ['admin'],
    iss: 'test-issuer',
    jti: 'test-jti',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('login', () => {
    const mockCredentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    test('should store token and return decoded payload on successful login', async () => {
      (api.post as jest.Mock).mockResolvedValueOnce({
        data: { token: mockToken, message: 'Login successful' },
      });

      const result = await authService.login(mockCredentials);

      expect(api.post).toHaveBeenCalledWith('/api/auth/sign-in', mockCredentials);
      
      expect(localStorageMock.getItem('access_token')).toBe(mockToken);
      
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('roles');
      expect(result.email).toBe('test@example.com');
    });

    test('should handle login error', async () => {
      const errorResponse = {
        response: {
          status: 401,
          data: { message: 'Invalid credentials' },
        },
      };
      
      (api.post as jest.Mock).mockRejectedValueOnce(errorResponse);

      await expect(authService.login(mockCredentials)).rejects.toEqual(errorResponse);
      
      expect(localStorageMock.getItem('access_token')).toBeNull();
    });
  });

  describe('logout', () => {
    test('should clear token on logout', async () => {
      localStorageMock.setItem('access_token', mockToken);
      
      (api.post as jest.Mock).mockResolvedValueOnce({});

      await authService.logout();

      expect(api.post).toHaveBeenCalledWith('/api/auth/sign-out');
      
      expect(localStorageMock.getItem('access_token')).toBeNull();
    });

    test('should clear token even if API call fails', async () => {
      localStorageMock.setItem('access_token', mockToken);
      
      (api.post as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await authService.logout();

      expect(localStorageMock.getItem('access_token')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    test('should return true for valid unexpired token', () => {
      localStorageMock.setItem('access_token', mockToken);

      expect(authService.isAuthenticated()).toBe(true);
    });

    test('should return false when no token is present', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    test('should return user data for authenticated user', () => {
      localStorageMock.setItem('access_token', mockToken);

      const user = authService.getCurrentUser();
      expect(user).toHaveProperty('email', 'test@example.com');
      expect(user).toHaveProperty('roles');
    });

    test('should return null when user is not authenticated', () => {
      expect(authService.getCurrentUser()).toBeNull();
    });
  });
});