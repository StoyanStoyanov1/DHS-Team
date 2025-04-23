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
            className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-3 py-2.5 rounded-md cursor-pointer mb-1.5 transition-all duration-150 ease-in-out ${
                active 
                ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={onClick}
            title={isCollapsed ? label : undefined}
        >
            <div className={`${active ? 'text-blue-600' : 'text-gray-500'} ${isCollapsed ? 'w-6 h-6 flex items-center justify-center' : ''}`}>
                {icon}
            </div>
            
            {!isCollapsed && (
                <>
                    <span className={`ml-3 text-sm ${active ? 'font-medium' : ''}`}>{label}</span>
                    {badge && (
                        <div className="ml-auto bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                            {badge}
                        </div>
                    )}
                </>
            )}
            
            {isCollapsed && badge && (
                <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                    {badge}
                </div>
            )}
        </div>
    );
};

export default NavItem;