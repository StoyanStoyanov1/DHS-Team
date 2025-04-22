'use client';

import { useState, ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
    children: ReactNode;
}

const Layout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [activeSection, setActiveSection] = useState<string>('dashboards');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const pathname = usePathname();
    
    // Check if current path is an auth page
    const isAuthPage = pathname?.startsWith('/auth');

    // Don't show the dashboard layout on auth pages
    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen w-full overflow-hidden bg-gray-50">
            <Sidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                isCollapsed={isSidebarCollapsed}
                toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />

                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;