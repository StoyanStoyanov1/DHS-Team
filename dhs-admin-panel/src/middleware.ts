/**
 * Middleware for handling requests and responses in the application.
 * Can be used for tasks like authentication, logging, or request modification.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which paths are protected (require authentication)
const protectedPaths = [
    '/dashboard',
    '/settings',
    '/profile',
    '/users',
    // Add other protected paths here
];

// Define which paths are for authentication
const authPaths = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the path is protected
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

    // Check if the path is for authentication
    const isAuthPath = authPaths.some(path => pathname === path);

    // Get token from cookie
    const token = request.cookies.get('refresh_token')?.value;

    // If the path is protected and there's no token, redirect to login
    if (isProtectedPath && !token) {
        const url = new URL('/auth/login', request.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }

    // If the path is for authentication and there's a token, redirect to home
    if (isAuthPath && token) {
        const url = new URL('/', request.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

// Configure the paths that this middleware should run on
export const config = {
    matcher: [
        // Match all protected paths
        ...protectedPaths.map(path => path + '/:path*'),
        // Match all auth paths
        ...authPaths,
        // Match home page
        '/',
    ],
};