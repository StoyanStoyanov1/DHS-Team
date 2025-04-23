'use client';

import React from 'react';
import { SunMoon, LayoutGrid, Bell, Settings } from 'lucide-react';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
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
                    <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium border-2 border-white shadow-sm">
                        JD
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;