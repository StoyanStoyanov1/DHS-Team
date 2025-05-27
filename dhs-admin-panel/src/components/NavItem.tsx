'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

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
            className={cn(
                "flex items-center px-3 py-2 rounded-md cursor-pointer mb-1 transition-all duration-200",
                active
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400 pl-2'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
            )}
            onClick={onClick}
            title={isCollapsed ? label : undefined}
        >
            <div className={cn(
                "transition-colors duration-200",
                active ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
            )}>
                {icon}
            </div>
            {!isCollapsed && (
                <>
                    <span className={cn(
                        "ml-3 text-sm font-medium transition-colors duration-200",
                        active && 'text-blue-600 dark:text-blue-400'
                    )}>
                        {label}
                    </span>
                    {badge && (
                        <div className="ml-auto bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                            {badge}
                        </div>
                    )}
                </>
            )}
            {isCollapsed && badge && (
                <div className="absolute -right-1 top-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    {badge}
                </div>
            )}
        </div>
    );
};

export default NavItem;
