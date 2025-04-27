/**
 * Utility functions for managing cookies in the browser and server-side.
 */

/**
 * Get cookie value by name.
 * @param name - The name of the cookie to retrieve.
 * @returns The value of the cookie or null if not found.
 */
export function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

/**
 * Set a cookie with the given name, value, and options.
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 * @param options - Additional options for the cookie (e.g., expires, path, domain, secure).
 */
export function setCookie(
    name: string,
    value: string,
    options: {
        expires?: Date | number;
        path?: string;
        domain?: string;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
        httpOnly?: boolean;
    } = {}
): void {
    if (typeof document === 'undefined') return;

    const {
        expires,
        path = '/',
        domain,
        secure,
        sameSite = 'strict',
        httpOnly,
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (expires) {
        if (typeof expires === 'number') {
            const days = expires;
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            cookieString += `; expires=${date.toUTCString()}`;
        } else {
            cookieString += `; expires=${expires.toUTCString()}`;
        }
    }

    if (path) cookieString += `; path=${path}`;
    if (domain) cookieString += `; domain=${domain}`;
    if (secure) cookieString += '; secure';
    if (sameSite) cookieString += `; samesite=${sameSite}`;
    if (httpOnly) cookieString += '; httponly';

    document.cookie = cookieString;
}

/**
 * Remove a cookie by name.
 * @param name - The name of the cookie to remove.
 * @param path - The path of the cookie (default is '/').
 */
export function removeCookie(name: string, path = '/'): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
}

/**
 * Parse cookies from a request header string (for server-side use).
 * @param cookieHeader - The raw cookie header string.
 * @returns An object mapping cookie names to their values.
 */
export function parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (!cookieHeader) return cookies;

    cookieHeader.split(';').forEach(cookie => {
        const [name, ...valueParts] = cookie.trim().split('=');
        const value = valueParts.join('=');
        cookies[name] = decodeURIComponent(value);
    });

    return cookies;
}

/**
 * Serialize a cookie for use in HTTP response headers.
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 * @param options - Additional options for the cookie (e.g., expires, path, domain, secure).
 * @returns A serialized cookie string.
 */
export function serializeCookie(
    name: string,
    value: string,
    options: {
        expires?: Date | number;
        path?: string;
        domain?: string;
        secure?: boolean;
        sameSite?: 'strict' | 'lax' | 'none';
        httpOnly?: boolean;
        maxAge?: number;
    } = {}
): string {
    const {
        expires,
        path = '/',
        domain,
        secure,
        sameSite = 'strict',
        httpOnly,
        maxAge,
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (expires) {
        if (typeof expires === 'number') {
            const days = expires;
            const date = new Date();
            date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            cookieString += `; Expires=${date.toUTCString()}`;
        } else {
            cookieString += `; Expires=${expires.toUTCString()}`;
        }
    }

    if (maxAge !== undefined) cookieString += `; Max-Age=${maxAge}`;
    if (domain) cookieString += `; Domain=${domain}`;
    if (path) cookieString += `; Path=${path}`;
    if (secure) cookieString += '; Secure';
    if (httpOnly) cookieString += '; HttpOnly';
    if (sameSite) cookieString += `; SameSite=${sameSite}`;

    return cookieString;
}