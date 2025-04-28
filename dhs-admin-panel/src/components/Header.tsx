'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SunMoon, LayoutGrid, Bell, Settings, LogOut, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import SearchBar from './SearchBar';
import { useAuth } from '@/src/hooks/useAuth';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Check if user is logged in
    useEffect(() => {
        if (!user) {
            const redirectPath = encodeURIComponent(pathname || '/');
            router.push(`/auth/login?redirect=${redirectPath}`);
        }
    }, [user, router, pathname]);

    // Close dropdown when clicking outside
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

    // Handle logout
    const handleLogout = async () => {
        await logout();
        // Save the current path for redirection after login
        const redirectPath = encodeURIComponent(pathname || '/');
        router.push(`/auth/login?redirect=${redirectPath}`);
    };

    // Get user initials for avatar
    const getInitials = () => {
        if (!user || !user.email) return 'U';
        return user.email.charAt(0).toUpperCase();
    };

    // If user is not authenticated, don't render the header content
    if (!user) {
        return null;
    }

    return (
        <header className="bg-white shadow-sm h-16 flex items-center">
            <div className="mx-auto max-w-7xl w-full px-6 flex items-center justify-between">
                <SearchBar />

                <div className="flex items-center space-x-4">
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
                    
                    {/* Profile dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium border-2 border-white shadow-sm hover:bg-blue-600 transition-colors"
                        >
                            {getInitials()}
                        </button>
                        
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                                    {user?.email || 'User'}
                                </div>
                                
                                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center">
                                        <User size={16} className="mr-2" />
                                        Profile
                                    </div>
                                </a>
                                
                                <button 
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
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