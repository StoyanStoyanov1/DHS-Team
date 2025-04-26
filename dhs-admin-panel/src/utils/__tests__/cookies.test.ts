// src/utils/__tests__/cookies.test.ts
import { getCookie, setCookie, removeCookie, parseCookies, serializeCookie } from '../cookies';

describe('Cookie Utils - Browser Environment', () => {
  // Запазваме оригиналния document.cookie
  let originalCookie: PropertyDescriptor | undefined;

  beforeAll(() => {
    // Запазваме оригиналния document.cookie преди да го мокнем
    originalCookie = Object.getOwnPropertyDescriptor(document, 'cookie');
  });

  afterAll(() => {
    // Възстановяваме оригиналния document.cookie след тестовете
    if (originalCookie) {
      Object.defineProperty(document, 'cookie', originalCookie);
    }
  });

  beforeEach(() => {
    // Създаваме мок на document.cookie за всеки тест
    let cookies: string[] = [];
    
    Object.defineProperty(document, 'cookie', {
      get: jest.fn(() => cookies.join('; ')),
      set: jest.fn((cookieString: string) => {
        cookies.push(cookieString);
        return cookieString;
      }),
      configurable: true
    });
  });

  describe('getCookie', () => {
    test('should return null when cookie is not found', () => {
      expect(getCookie('nonexistent')).toBeNull();
    });

    test('should return cookie value when cookie exists', () => {
      document.cookie = 'testCookie=testValue';
      expect(getCookie('testCookie')).toBe('testValue');
    });

    test('should handle URL encoded values', () => {
      document.cookie = `encodedCookie=${encodeURIComponent('value with spaces')}`;
      expect(getCookie('encodedCookie')).toBe('value with spaces');
    });
  });

  describe('setCookie', () => {
    test('should set a basic cookie', () => {
      setCookie('basicCookie', 'value');
      expect(document.cookie).toContain('basicCookie=value');
    });

    test('should set cookie with path option', () => {
      setCookie('pathCookie', 'value', { path: '/admin' });
      expect(document.cookie).toContain('pathCookie=value');
      expect(document.cookie).toContain('path=/admin');
    });

    test('should set cookie with expires option as number', () => {
      setCookie('expiresCookie', 'value', { expires: 1 });
      expect(document.cookie).toContain('expiresCookie=value');
      expect(document.cookie).toContain('expires=');
    });

    test('should set cookie with expires option as Date', () => {
      const expiryDate = new Date('2025-12-31');
      setCookie('dateExpiresCookie', 'value', { expires: expiryDate });
      expect(document.cookie).toContain('dateExpiresCookie=value');
      expect(document.cookie).toContain(`expires=${expiryDate.toUTCString()}`);
    });

    test('should set secure cookie', () => {
      setCookie('secureCookie', 'value', { secure: true });
      expect(document.cookie).toContain('secureCookie=value');
      expect(document.cookie).toContain('secure');
    });

    test('should set SameSite cookie', () => {
      setCookie('sameSiteCookie', 'value', { sameSite: 'lax' });
      expect(document.cookie).toContain('sameSiteCookie=value');
      expect(document.cookie).toContain('samesite=lax');
    });
  });

  describe('removeCookie', () => {
    test('should remove a cookie', () => {
      // Първо добавяме, след това премахваме
      document.cookie = 'toRemove=value; path=/';
      removeCookie('toRemove');
      
      // Проверяваме дали cookie е със стара дата (изтекъл)
      expect(document.cookie).toContain('toRemove=');
      expect(document.cookie).toContain('expires=Thu, 01 Jan 1970 00:00:00 GMT');
    });

    test('should remove a cookie with specific path', () => {
      document.cookie = 'pathCookie=value; path=/admin';
      removeCookie('pathCookie', '/admin');
      
      expect(document.cookie).toContain('pathCookie=');
      expect(document.cookie).toContain('path=/admin');
      expect(document.cookie).toContain('expires=Thu, 01 Jan 1970 00:00:00 GMT');
    });
  });
});

describe('Cookie Utils - Server Environment', () => {
  describe('parseCookies', () => {
    test('should return empty object for empty cookie header', () => {
      expect(parseCookies('')).toEqual({});
    });

    test('should parse single cookie from header', () => {
      expect(parseCookies('name=value')).toEqual({ name: 'value' });
    });

    test('should parse multiple cookies from header', () => {
      expect(parseCookies('name=value; token=abc123')).toEqual({
        name: 'value',
        token: 'abc123'
      });
    });

    test('should handle cookies with URL encoded values', () => {
      expect(parseCookies(`name=${encodeURIComponent('value with spaces')}`))
        .toEqual({ name: 'value with spaces' });
    });

    test('should handle cookies with equal signs in values', () => {
      expect(parseCookies('token=abc=123=xyz')).toEqual({ token: 'abc=123=xyz' });
    });
  });

  describe('serializeCookie', () => {
    test('should serialize a basic cookie', () => {
      expect(serializeCookie('name', 'value')).toBe('name=value; Path=/; SameSite=strict');
    });

    test('should serialize cookie with domain', () => {
      expect(serializeCookie('name', 'value', { domain: 'example.com' }))
        .toBe('name=value; Domain=example.com; Path=/; SameSite=strict');
    });

    test('should serialize cookie with expiry date', () => {
      const date = new Date('2025-12-31');
      expect(serializeCookie('name', 'value', { expires: date }))
        .toBe(`name=value; Expires=${date.toUTCString()}; Path=/; SameSite=strict`);
    });

    test('should serialize cookie with max age', () => {
      expect(serializeCookie('name', 'value', { maxAge: 3600 }))
        .toBe('name=value; Max-Age=3600; Path=/; SameSite=strict');
    });

    test('should serialize secure cookie', () => {
      expect(serializeCookie('name', 'value', { secure: true }))
        .toBe('name=value; Path=/; Secure; SameSite=strict');
    });

    test('should serialize httpOnly cookie', () => {
      expect(serializeCookie('name', 'value', { httpOnly: true }))
        .toBe('name=value; Path=/; HttpOnly; SameSite=strict');
    });

    test('should serialize cookie with custom SameSite option', () => {
      expect(serializeCookie('name', 'value', { sameSite: 'lax' }))
        .toBe('name=value; Path=/; SameSite=lax');
    });

    test('should serialize cookie with multiple options', () => {
      expect(serializeCookie('name', 'value', {
        domain: 'example.com',
        path: '/admin',
        secure: true,
        httpOnly: true,
        sameSite: 'none'
      })).toBe('name=value; Domain=example.com; Path=/admin; Secure; HttpOnly; SameSite=none');
    });
  });
});