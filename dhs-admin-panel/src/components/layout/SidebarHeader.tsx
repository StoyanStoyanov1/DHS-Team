'use client';

import React from 'react';
import { Pin, PinOff } from 'lucide-react';

interface SidebarHeaderProps {
    isPinned: boolean;
    togglePin: () => void;
    shouldExpand: boolean;
}

/**
 * Header component for the sidebar with logo and pin button
 */
export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
    isPinned,
    togglePin,
    shouldExpand
}) => {
    return (
        <div className="sidebar-header relative flex items-center justify-between p-5 border-b border-gray-100">
            <div className="flex items-center">
                <div className="h-10 w-10 rounded bg-blue-500 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white transform rotate-45"></div>
                </div>
                {shouldExpand && (
                    <span className="ml-3 text-xl font-bold text-gray-800">Admin Panel</span>
                )}
            </div>
            {shouldExpand && (
                <button
                    onClick={togglePin}
                    className={`pin-btn ${isPinned ? 'active' : ''} text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1 rounded-md transition-colors`}
                    title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
                >
                    {isPinned ? <Pin size={20} /> : <PinOff size={20} />}
                </button>
            )}
            {isPinned && !shouldExpand && (
                <div className="pinned-indicator"></div>
            )}
        </div>
    );
};

export default SidebarHeader;
