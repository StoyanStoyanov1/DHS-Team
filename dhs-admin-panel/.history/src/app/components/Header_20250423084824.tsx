'use client';

import React from 'react';
import { Sun, Grid, Bell, Search } from 'lucide-react';
import Link from 'next/link';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search (CTRL + K)"
                        className="w-full pl-10 pr-4 py-2 border border-gray-100 bg-gray-50 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm font-medium"
                    />
                </div>

                <div className="flex items-center space-x-5 ml-4">
                    <button className="text-gray-600 hover:text-gray-800 relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
                        <Sun size={20} />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
                        <Grid size={20} />
                    </button>
                    <div className="relative">
                        <button className="text-gray-600 hover:text-gray-800 relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100">
                            <Bell size={20} />
                        </button>
                        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium cursor-pointer border border-indigo-200">
                        JD
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;