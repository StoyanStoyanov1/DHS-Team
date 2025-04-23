'use client';

import React from 'react';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
    return (
        <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
        </div>
        <input
    type="text"
    placeholder="Search (CTRL + K)"
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        </div>
);
};

export default SearchBar;