'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';

interface PrivateRouteProps {
    children: ReactNode;
}

/**
 * A client-side component that redirects to the login page if the user is not authenticated
 * Use this as a wrapper around components or pages that require authentication
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Only redirect after the authentication check is complete
        if (!loading && !user) {
            // Encode the current path to redirect back after login
            const redirectPath = encodeURIComponent(pathname || '/');
            router.push(`/auth/login?redirect=${redirectPath}`);
        }
    }, [user, loading, router, pathname]);

    // Show nothing while checking authentication
    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
        );
    }

    // If authenticated, render the children
    return <>{children}</>;
};

export default PrivateRoute;