'use client';

import { useState, ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';
import { useAuth } from '@/src/hooks/useAuth';

interface DashboardLayoutProps {
    children: ReactNode;
}

const Layout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [activeSection, setActiveSection] = useState<string>('dashboards');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Default to collapsed
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useAuth();

    const isAuthPage = pathname?.startsWith('/auth');

    useEffect(() => {
        if (!loading && !user && !isAuthPage) {
            router.push('/auth/login');
        }
    }, [user, loading, isAuthPage, router]);

    if (loading || (!user && !isAuthPage)) {
        return null;
    }

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                isCollapsed={isSidebarCollapsed}
                toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header />

                <main className="flex-1 overflow-auto p-6">
                    <div className="mx-auto max-w-7xl w-full">
                        <Breadcrumb />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;