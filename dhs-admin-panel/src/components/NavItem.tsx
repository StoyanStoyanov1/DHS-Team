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
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-2'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
            onClick={onClick}
            title={isCollapsed ? label : undefined}
        >
            <div className={active ? "text-blue-600" : "text-gray-500"}>{icon}</div>
            {!isCollapsed && (
                <>
                    <span className={`ml-3 text-sm font-medium ${active ? 'text-blue-600' : ''}`}>{label}</span>
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