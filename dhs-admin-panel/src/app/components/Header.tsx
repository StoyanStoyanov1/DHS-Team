'use client';

import React from 'react';
import { Sun, Grid, Bell } from 'lucide-react';
import SearchBar from './SearchBar';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
            <SearchBar />
            <div className="flex items-center space-x-4 ml-4">
                <button className="text-gray-500 hover:text-gray-700">
                    <Sun size={20} />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                    <Grid size={20} />
                </button>
                <div className="relative">
                    <button className="text-gray-500 hover:text-gray-700">
                        <Bell size={20} />
                    </button>
                    <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium">
                    JD
                </div>
            </div>
        </header>
    );
};

export default Header;