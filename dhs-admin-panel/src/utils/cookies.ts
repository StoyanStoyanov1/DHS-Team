// src/utils/cookies.ts

/**
 * Get cookie value by name
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
 * Set a cookie with the given name, value, and options
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
 * Remove a cookie by name
 */
export function removeCookie(name: string, path = '/'): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
}

/**
 * Parse cookies from a request header string (for server-side use)
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
 * Serialize cookie for response header (for server-side use)
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