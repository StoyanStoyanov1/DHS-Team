'use client';

import { useState, ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
    children: ReactNode;
}

const Layout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [activeSection, setActiveSection] = useState<string>('dashboards');

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />

            <div className="flex-1">
                <Header />

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;