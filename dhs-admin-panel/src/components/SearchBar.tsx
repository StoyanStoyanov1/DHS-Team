'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch?: (term: string) => void;
    placeholder?: string;
    className?: string;
    initialValue?: string;
    autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    placeholder = "Search (CTRL + K)",
    className = "",
    initialValue = "",
    autoFocus = false
}) => {
    const [searchTerm, setSearchTerm] = useState(initialValue);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };
    
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setSearchTerm('');
            if (onSearch) {
                onSearch('');
            }
            e.preventDefault();
        }
    }, [onSearch]);

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.querySelector<HTMLInputElement>('input[type="text"][data-search-input="true"]')?.focus();
            }
        };

        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, []);

    return (
        <div className={`relative flex-1 max-w-md ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
                type="text"
                data-search-input="true"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoFocus={autoFocus}
                aria-label="Search"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-xs text-gray-400 bg-gray-100 dark:text-gray-400 dark:bg-gray-700 px-1.5 py-0.5 rounded">⌘K</span>
            </div>
        </div>
    );
};

export default SearchBar;