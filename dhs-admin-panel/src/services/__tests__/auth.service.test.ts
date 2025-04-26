import authService, { 
  LoginCredentials, 
  RegisterCredentials, 
  TokenPayload 
} from '../auth.service';
import api from '../api';

// Мокваме api и jwtDecode модулите
jest.mock('../api', () => ({
  post: jest.fn(),
}));

// Директно мокваме jwtDecode модула
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

// Симулиране на localStorage за тестовете
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
  // Общи тестови данни
  const mockToken = 'mock-jwt-token';
  const mockTokenPayload: TokenPayload = {
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 час в бъдещето
    iat: Math.floor(Date.now() / 1000),
    sub: '123',
    email: 'test@example.com',
    roles: ['admin'],
    iss: 'test-issuer',
    jti: 'test-jti',
  };

  // Изчистваме моковете и localStorage преди всеки тест
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
      // Задаваме мок резултата от API заявката
      (api.post as jest.Mock).mockResolvedValueOnce({
        data: { token: mockToken, message: 'Login successful' },
      });

      // Извикваме метода, който искаме да тестваме
      const result = await authService.login(mockCredentials);

      // Проверяваме дали API е извикано с правилните параметри
      expect(api.post).toHaveBeenCalledWith('/api/auth/sign-in', mockCredentials);
      
      // Проверяваме дали токенът е запазен в localStorage
      expect(localStorageMock.getItem('access_token')).toBe(mockToken);
      
      // Проверяваме дали резултатът е валиден TokenPayload обект
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
      
      // Задаваме мок грешка от API заявката
      (api.post as jest.Mock).mockRejectedValueOnce(errorResponse);

      // Проверяваме дали методът хвърля грешка
      await expect(authService.login(mockCredentials)).rejects.toEqual(errorResponse);
      
      // Проверяваме дали няма токен в localStorage
      expect(localStorageMock.getItem('access_token')).toBeNull();
    });
  });

  describe('logout', () => {
    test('should clear token on logout', async () => {
      // Задаваме токен преди логаут
      localStorageMock.setItem('access_token', mockToken);
      
      // Мокваме успешен API отговор
      (api.post as jest.Mock).mockResolvedValueOnce({});

      // Извикваме метода за логаут
      await authService.logout();

      // Проверяваме дали API е извикано
      expect(api.post).toHaveBeenCalledWith('/api/auth/sign-out');
      
      // Проверяваме дали токенът е премахнат от localStorage
      expect(localStorageMock.getItem('access_token')).toBeNull();
    });

    test('should clear token even if API call fails', async () => {
      // Задаваме токен преди логаут
      localStorageMock.setItem('access_token', mockToken);
      
      // Мокваме провалена API заявка
      (api.post as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // Извикваме метода за логаут
      await authService.logout();

      // Проверяваме дали токенът е премахнат от localStorage
      expect(localStorageMock.getItem('access_token')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    test('should return true for valid unexpired token', () => {
      // Задаваме токен
      localStorageMock.setItem('access_token', mockToken);

      // Проверяваме резултата
      expect(authService.isAuthenticated()).toBe(true);
    });

    test('should return false when no token is present', () => {
      // Проверяваме резултата без токен
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    test('should return user data for authenticated user', () => {
      // Задаваме токен
      localStorageMock.setItem('access_token', mockToken);

      // Проверяваме резултата
      const user = authService.getCurrentUser();
      expect(user).toHaveProperty('email', 'test@example.com');
      expect(user).toHaveProperty('roles');
    });

    test('should return null when user is not authenticated', () => {
      // Проверяваме резултата без токен
      expect(authService.getCurrentUser()).toBeNull();
    });
  });
});