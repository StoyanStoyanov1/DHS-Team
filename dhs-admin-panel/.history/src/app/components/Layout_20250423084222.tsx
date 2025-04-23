'use client';

import { useState, ReactNode } from 'react';
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

    const isAuthPage = pathname?.startsWith('/auth');

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                isCollapsed={isSidebarCollapsed}
                toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <div className="flex-1">
                <Header />

                <main className="p-6 mx-auto w-full">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;