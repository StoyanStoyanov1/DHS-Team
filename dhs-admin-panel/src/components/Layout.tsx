'use client';

import { useState, ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';
import { useAuth } from '@/src/hooks/useAuth';
import { ThemeProvider } from './ThemeProvider';

interface DashboardLayoutProps {
    children: ReactNode;
}

const Layout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [activeSection, setActiveSection] = useState<string>('dashboards');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const pathname = usePathname();
    const { user, loading } = useAuth();
    const router = useRouter();

    const isAuthPage = pathname?.startsWith('/auth');

    // We no longer redirect non-authenticated users
    // They can access the application without being logged in

    if (isAuthPage) {
        return (
            <ThemeProvider>
                {children}
            </ThemeProvider>
        );
    }

    if (loading) {
        return (
            <ThemeProvider>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider>
            <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden transition-colors duration-200">
                <Sidebar
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    isCollapsed={isSidebarCollapsed}
                    toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                />

                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    <Header />

                    <main className="flex-1 overflow-auto p-4 md:p-6 dark:text-gray-100">
                        <div className="mx-auto max-w-7xl w-full">
                            <Breadcrumb />
                            <div className="mt-4">
                                {children}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Layout;
