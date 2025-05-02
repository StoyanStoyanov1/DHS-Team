'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';

/**
 * User dropdown component for the header
 */
export const UserDropdown: React.FC = () => {
    const { user, logout, isDebugMode } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    return (
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
                        {isDebugMode ? 'Debug User' : (user?.email || 'User')}
                        {isDebugMode && (
                            <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Debug
                            </span>
                        )}
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
    );
};

export default UserDropdown;