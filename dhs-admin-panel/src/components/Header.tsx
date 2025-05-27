'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LayoutGrid, Bell, Settings, LogOut, User, LogIn, Menu, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import SearchBar from './SearchBar';
import { useAuth } from '@/src/hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    // We no longer redirect non-authenticated users

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
                setMobileMenuOpen(false);
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

    const handleLogin = () => {
        const redirectPath = encodeURIComponent(pathname || '/');
        router.push(`/auth/login?redirect=${redirectPath}`);
    };

    const getInitials = () => {
        if (!user || !user.email) return 'U';
        return user.email.charAt(0).toUpperCase();
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-800/50 h-16 flex items-center transition-colors duration-200 sticky top-0 z-30">
            <div className="mx-auto max-w-7xl w-full px-4 md:px-6 flex items-center justify-between">
                {/* Mobile menu button - only visible on small screens */}
                <button 
                    className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-all"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className="hidden md:block flex-1 max-w-md">
                    <SearchBar />
                </div>

                <div className="flex items-center space-x-2 md:space-x-4">
                    <ThemeToggle />

                    <button className="hidden md:flex text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-all">
                        <LayoutGrid size={20} />
                    </button>

                    <div className="relative">
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-all">
                            <Bell size={20} />
                        </button>
                        <div className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse"></div>
                    </div>

                    <button className="hidden md:flex text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-all">
                        <Settings size={20} />
                    </button>

                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={cn(
                                    "w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-medium border-2 border-white dark:border-gray-700 shadow-sm hover:shadow-md transition-all",
                                    dropdownOpen && "ring-2 ring-blue-300 dark:ring-blue-700"
                                )}
                            >
                                {getInitials()}
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700 transition-all duration-200 animate-in fade-in-50 slide-in-from-top-5">
                                    <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                                        <div className="font-medium">{user?.email || 'User'}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Administrator</div>
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
                    ) : (
                        <button 
                            onClick={handleLogin}
                            className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-medium border-2 border-white dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                            title="Log in"
                        >
                            <LogIn size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile menu - only visible when toggled */}
            {mobileMenuOpen && (
                <div 
                    ref={mobileMenuRef}
                    className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 p-4 z-20 animate-in slide-in-from-top-5"
                >
                    <div className="mb-4">
                        <SearchBar />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <button className="flex flex-col items-center justify-center p-3 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <LayoutGrid size={20} />
                            <span className="text-xs mt-1">Apps</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-3 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <Settings size={20} />
                            <span className="text-xs mt-1">Settings</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-3 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <User size={20} />
                            <span className="text-xs mt-1">Profile</span>
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
