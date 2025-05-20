'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';

interface PrivateRouteProps {
    children: ReactNode;
}

const publicRoutes = ['/users-list', '/public-dashboard', '/about', '/contact'];

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isPublicRoute = pathname ? 
        publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`)) 
        : false;

    useEffect(() => {
        if (isPublicRoute) return;

        if (!loading && !user) {
            const redirectPath = encodeURIComponent(pathname || '/');
            router.push(`/auth/login?redirect=${redirectPath}`);
        }
    }, [user, loading, router, pathname, isPublicRoute]);

    if (loading && !isPublicRoute) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isPublicRoute || user) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
    );
}

export default PrivateRoute;
