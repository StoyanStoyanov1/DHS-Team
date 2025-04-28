'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';

interface PrivateRouteProps {
    children: ReactNode;
}

// List of routes that don't require authentication
// Add other routes here if needed
const publicRoutes = ['/users-list', '/public-dashboard', '/about', '/contact'];

/**
 * A client-side component that redirects to the login page if the user is not authenticated
 * Use this as a wrapper around components or pages that require authentication
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user, loading, isDebugMode } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Improved check for public routes to handle both exact matches and sub-paths
    const isPublicRoute = pathname ? 
        publicRoutes.some(route => 
            pathname === route || pathname.startsWith(`${route}/`)
        ) : false;

    useEffect(() => {
        // Skip redirect for public routes regardless of authentication status
        if (isPublicRoute) {
            return;
        }
        
        // Allow access to all routes in debug mode
        if (isDebugMode) {
            return;
        }
        
        // Redirect only if user is not authenticated and we're not on a public route
        if (!loading && !user) {
            // Encode the current path to redirect back after login
            const redirectPath = encodeURIComponent(pathname || '/');
            router.push(`/auth/login?redirect=${redirectPath}`);
        }
    }, [user, loading, router, pathname, isPublicRoute, isDebugMode]);

    // Show spinner only if we're loading authentication and not on a public route
    if (loading && !isPublicRoute) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
        );
    }

    // Always show content for public routes, debug mode, or authenticated users
    if (isPublicRoute || isDebugMode || user) {
        return <>{children}</>;
    }

    // Default loader for non-public routes while authentication is being checked
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
    );
}

export default PrivateRoute;