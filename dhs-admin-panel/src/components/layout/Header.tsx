'use client';

import React from 'react';
import { SunMoon, LayoutGrid, Bell, Settings, Bug } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import UserDropdown from './UserDropdown';

/**
 * Header component for the application
 */
export const Header: React.FC = () => {
    const { user, isDebugMode } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    if (!user && !isDebugMode) {
        return null;
    }

    return (
        <header className="bg-white shadow-sm h-16 flex items-center">
            <div className="mx-auto max-w-7xl w-full px-6 flex items-center justify-between">
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {process.env.NODE_ENV === 'development' && isDebugMode && (
                        <div className="flex items-center text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-medium">
                            <Bug size={14} className="mr-1" />
                            <span>Debug Mode</span>
                        </div>
                    )}
                    
                    <button className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors">
                        <SunMoon size={20} />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors">
                        <LayoutGrid size={20} />
                    </button>
                    <div className="relative">
                        <button className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors">
                            <Bell size={20} />
                        </button>
                        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors">
                        <Settings size={20} />
                    </button>
                    
                    <UserDropdown />
                </div>
            </div>
        </header>
    );
};

export default Header;