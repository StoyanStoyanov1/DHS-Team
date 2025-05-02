'use client';

import React, { ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableNavItemProps {
    icon: ReactNode;
    label: string;
    isOpen: boolean;
    isActive: boolean;
    onClick: () => void;
    shouldExpand: boolean;
    children?: ReactNode;
}

/**
 * Expandable navigation item component with sub-items
 */
export const ExpandableNavItem: React.FC<ExpandableNavItemProps> = ({
    icon,
    label,
    isOpen,
    isActive,
    onClick,
    shouldExpand,
    children
}) => {
    return (
        <div className="relative">
            <div
                className={`flex items-center px-3 py-2 rounded-md cursor-pointer mb-1 ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={onClick}
            >
                <div className="text-gray-500">{icon}</div>
                {shouldExpand && (
                    <>
                        <span className="ml-3 text-sm font-medium">{label}</span>
                        <div className="ml-auto">
                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                    </>
                )}
            </div>
            {shouldExpand && isOpen && (
                <div className="ml-4 mt-1 space-y-1">
                    {children}
                </div>
            )}
        </div>
    );
};

export default ExpandableNavItem;