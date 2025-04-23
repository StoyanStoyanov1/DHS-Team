'use client';

import React from 'react';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
    return (
        <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
            </div>
            <input
                type="text"
                placeholder="Search (CTRL + K)"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">⌘K</span>
            </div>
        </div>
    );
};

export default SearchBar;