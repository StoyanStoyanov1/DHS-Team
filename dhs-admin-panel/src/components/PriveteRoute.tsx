'use client';

import { useEffect, ReactNode, useState } from 'react';
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
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        // Само ако вече не зареждаме и нямаме потребител, ще обмислим пренасочване
        if (!loading && !user) {
            // Изчакваме малко преди да пренасочим, за да предотвратим бързите пренасочвания
            const timer = setTimeout(() => {
                // Проверяваме дали все още сме на същата страница и нямаме потребител
                if (pathname) {
                    const redirectPath = encodeURIComponent(pathname);
                    setShouldRedirect(true);
                    router.push(`/auth/login?redirect=${redirectPath}`);
                }
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [user, loading, router, pathname]);

    // Показваме loading индикатор, докато проверяваме автентикацията
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
        );
    }

    // Ако трябва да пренасочим, показваме loading индикатор
    if (shouldRedirect) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
        );
    }

    // Ако сме автентикирани или все още проверяваме, показваме децата
    return <>{children}</>;
};

export default PrivateRoute;