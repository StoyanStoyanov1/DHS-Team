'use client';

import React, { ReactNode } from 'react';

interface NavItemProps {
    icon: ReactNode;
    label: string;
    badge?: string;
    active: boolean;
    onClick: () => void;
    isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
    icon,
    label,
    badge,
    active,
    onClick,
    isCollapsed
}) => {
    return (
        <div
            className={`flex items-center px-3 py-2 rounded-md cursor-pointer mb-1 transition-colors ${
                active
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400 pl-2'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
            onClick={onClick}
            title={isCollapsed ? label : undefined}
        >
            <div className={active ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}>{icon}</div>
            {!isCollapsed && (
                <>
                    <span className={`ml-3 text-sm font-medium ${active ? 'text-blue-600 dark:text-blue-400' : ''}`}>{label}</span>
                    {badge && (
                        <div className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {badge}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default NavItem;