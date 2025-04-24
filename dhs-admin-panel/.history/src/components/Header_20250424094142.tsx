'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SunMoon, LayoutGrid, Bell, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import SearchBar from './SearchBar';
import { useAuth } from '@/src/hooks/useAuth';
import Link from 'next/link';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await logout();
    };

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
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                        >
                            <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium border-2 border-white shadow-sm">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                    <div className="font-medium">{user?.email}</div>
                                </div>
                                <Link
                                    href="/profile"
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <User size={16} className="mr-2" />
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    <LogOut size={16} className="mr-2" />
                                    Sign out
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