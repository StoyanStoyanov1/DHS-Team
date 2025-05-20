'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LayoutGrid, Bell, Settings, LogOut, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import SearchBar from './SearchBar';
import { useAuth } from '@/src/hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) {
            const redirectPath = encodeURIComponent(pathname || '/');
            router.push(`/auth/login?redirect=${redirectPath}`);
        }
    }, [user, router, pathname]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        const redirectPath = encodeURIComponent(pathname || '/');
        router.push(`/auth/login?redirect=${redirectPath}`);
    };

    const getInitials = () => {
        if (!user || !user.email) return 'U';
        return user.email.charAt(0).toUpperCase();
    };

    if (!user) {
        return null;
    }

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-800 h-16 flex items-center transition-colors duration-200">
            <div className="mx-auto max-w-7xl w-full px-6 flex items-center justify-between">
                <SearchBar />

                <div className="flex items-center space-x-4">
                    <ThemeToggle />

                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors">
                        <LayoutGrid size={20} />
                    </button>
                    <div className="relative">
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors">
                            <Bell size={20} />
                        </button>
                        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors">
                        <Settings size={20} />
                    </button>

                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium border-2 border-white dark:border-gray-700 shadow-sm hover:bg-blue-600 transition-colors"
                        >
                            {getInitials()}
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                                    {user?.email || 'User'}
                                </div>

                                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                    <div className="flex items-center">
                                        <User size={16} className="mr-2" />
                                        Profile
                                    </div>
                                </a>

                                <button 
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <LogOut size={16} className="mr-2" />
                                        Log out
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
