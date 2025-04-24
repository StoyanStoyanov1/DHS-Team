'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SunMoon, LayoutGrid, Bell, Settings, LogOut } from 'lucide-react';
import SearchBar from './SearchBar';
import { useAuth } from '@/src/hooks/useAuth';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const { user, logout } = useAuth();
    const router = useRouter();

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    const handleLogout = async () => {
        await logout();
        setIsProfileMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getInitials = (user: { email?: string; name?: string } | null | undefined) => {
        if (!user) return '?';
        
        if (user.name) {
            const parts = user.name.split(' ');
            if (parts.length > 1) {
                return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            }
            return user.name[0].toUpperCase();
        }
        
        if (user.email) {
            return user.email[0].toUpperCase();
        }
        
        return 'U';
    };

    return (
        <header className="bg-white shadow-sm h-16 flex items-center sticky top-0 z-30">
            <div className="mx-auto max-w-7xl w-full px-6 flex items-center justify-between">
                <SearchBar />

                <div className="flex items-center space-x-2 md:space-x-4">
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
                    <div className="relative" ref={profileMenuRef}>
                        <button 
                            onClick={toggleProfileMenu}
                            className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium border-2 border-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {getInitials(user)}
                        </button>

                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-40 border border-gray-100">
                                <div className="px-4 py-2 text-xs text-gray-500">
                                    Signed in as <span className="font-medium text-gray-700">{user?.email}</span>
                                </div>
                                <div className="border-t border-gray-100"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                >
                                    <LogOut size={16} className="mr-2" />
                                    Logout
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