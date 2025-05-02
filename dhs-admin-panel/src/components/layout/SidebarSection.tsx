'use client';

import React, { ReactNode } from 'react';

interface SidebarSectionProps {
    title?: string;
    shouldExpand: boolean;
    children: ReactNode;
    className?: string;
}

/**
 * Section component for grouping related navigation items in the sidebar
 */
export const SidebarSection: React.FC<SidebarSectionProps> = ({
    title,
    shouldExpand,
    children,
    className = ''
}) => {
    return (
        <div className={`mb-6 ${className}`}>
            {shouldExpand && title && (
                <div className="text-xs font-semibold text-gray-500 tracking-wider mb-3 px-3">
                    {title}
                </div>
            )}
            {children}
        </div>
    );
};

export default SidebarSection;