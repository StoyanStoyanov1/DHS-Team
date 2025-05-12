'use client';

import React, { useState, useEffect } from 'react';
import {
    Grid,
    Mail,
    MessageSquare,
    Calendar,
    Trello,
    ShoppingCart,
    BookOpen,
    Truck,
    FileText,
    Users,
    Lock,
    File,
    Key,
    Wand2,
    Maximize,
    LogIn,
    UserPlus,
    ChevronDown,
    ChevronUp,
    Pin,
    PinOff
} from 'lucide-react';
import NavItem from './NavItem';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeSection,
    setActiveSection,
    isCollapsed,
    toggleCollapse
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isUsersOpen, setIsUsersOpen] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

    const isAuthPath = pathname?.startsWith('/auth');
    const isLoginPath = pathname === '/auth/login';
    const isRegisterPath = pathname === '/auth/register';
    const isUsersListPath = pathname === '/users-list';

    useEffect(() => {
        if (isAuthPath) {
            setIsAuthOpen(true);
        }
    }, [pathname, isAuthPath]);

    useEffect(() => {
        if (isUsersListPath) {
            setIsUsersOpen(true);
            setActiveSection('users');
        }
    }, [pathname, isUsersListPath, setActiveSection]);

    const handleAuthClick = () => {
        setIsAuthOpen(!isAuthOpen);
        if (!isAuthPath) {
            setActiveSection('authentication');
        }
    };

    const handleUsersClick = () => {
        setIsUsersOpen(!isUsersOpen);
        setActiveSection('users');
    };

    const handleLoginClick = () => {
        router.push('/auth/login');
    };

    const handleRegisterClick = () => {
        router.push('/auth/register');
    };

    const togglePin = () => {
        setIsPinned(!isPinned);
    };

    const shouldExpand = isPinned || isHovering;

    return (
        <div
            className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 h-screen ${shouldExpand ? 'w-64' : 'w-20'} flex flex-col`}
            onMouseEnter={() => !isPinned && setIsHovering(true)}
            onMouseLeave={() => !isPinned && setIsHovering(false)}
        >
            <div className="sidebar-header relative flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center">
                    <div className="h-10 w-10 rounded bg-blue-500 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white transform rotate-45"></div>
                    </div>
                    {shouldExpand && (
                        <span className="ml-3 text-xl font-bold text-gray-800 dark:text-white">Admin Panel</span>
                    )}
                </div>
                {shouldExpand && (
                    <button
                        onClick={togglePin}
                        className={`pin-btn ${isPinned ? 'active' : ''} text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-md transition-colors`}
                        title={isPinned ? "Hide the sidebar" : "Keep the sidebar open"}
                        >
                        {isPinned ? <Pin size={20} /> : <PinOff size={20} />}
                    </button>
                )}
                {isPinned && !isHovering && (
                    <div className="pinned-indicator"></div>
                )}
            </div>

            <div className="px-4 py-2 overflow-y-auto flex-grow custom-scrollbar">
                <div className="mb-6">
                    <NavItem
                        icon={<Grid size={18} />}
                        label="Dashboards"
                        badge="5"
                        active={activeSection === 'dashboards'}
                        onClick={() => setActiveSection('dashboards')}
                        isCollapsed={!shouldExpand}
                    />
                    <NavItem
                        icon={<Maximize size={18} />}
                        label="Layouts"
                        active={activeSection === 'layouts'}
                        onClick={() => setActiveSection('layouts')}
                        isCollapsed={!shouldExpand}
                    />
                    <NavItem
                        icon={<File size={18} />}
                        label="Front Pages"
                        active={activeSection === 'frontpages'}
                        onClick={() => setActiveSection('frontpages')}
                        isCollapsed={!shouldExpand}
                    />
                </div>

                <div className="mb-6">
                    {shouldExpand && (
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider mb-3 px-3">
                            APPS & PAGES
                        </div>
                    )}
                    <NavItem
                        icon={<Mail size={18} />}
                        label="Email"
                        active={activeSection === 'email'}
                        onClick={() => setActiveSection('email')}
                        isCollapsed={!shouldExpand}
                    />
                    <NavItem
                        icon={<MessageSquare size={18} />}
                        label="Chat"
                        active={activeSection === 'chat'}
                        onClick={() => setActiveSection('chat')}
                        isCollapsed={!shouldExpand}
                    />
                    <NavItem
                        icon={<Calendar size={18} />}
                        label="Calendar"
                        active={activeSection === 'calendar'}
                        onClick={() => setActiveSection('calendar')}
                        isCollapsed={!shouldExpand}
                    />
                    <NavItem
                        icon={<Trello size={18} />}
                        label="Kanban"
                        active={activeSection === 'kanban'}
                        onClick={() => setActiveSection('kanban')}
                        isCollapsed={!shouldExpand}
                    />
                    <NavItem
                        icon={<ShoppingCart size={18} />}
                        label="eCommerce"
                        active={activeSection === 'ecommerce'}
                        onClick={() => setActiveSection('ecommerce')}
                        isCollapsed={!shouldExpand}
                    />
                    <NavItem
                        icon={<BookOpen size={18} />}
                        label="Academy"
                        active={activeSection === 'academy'}
                        onClick={() => setActiveSection('academy')}
                        isCollapsed={!shouldExpand}
                    />
                    <NavItem
                        icon={<Truck size={18} />}
                        label="Logistics"
                        active={activeSection === 'logistics'}
                        onClick={() => setActiveSection('logistics')}
                        isCollapsed={!shouldExpand}
                    />
                    <NavItem
                        icon={<FileText size={18} />}
                        label="Invoice"
                        active={activeSection === 'invoice'}
                        onClick={() => setActiveSection('invoice')}
                        isCollapsed={!shouldExpand}
                    />
                </div>

                <div className="mb-6">
                    {shouldExpand && (
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider mb-3 px-3">
                            ACCOUNT MANAGEMENT
                        </div>
                    )}
                    <div className="relative">
                        <div
                            className={`flex items-center px-3 py-2 rounded-md cursor-pointer mb-1 ${activeSection === 'users' ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            onClick={handleUsersClick}
                        >
                            <div className="text-gray-500 dark:text-gray-400"><Users size={18} /></div>
                            {shouldExpand && (
                                <>
                                    <span className="ml-3 text-sm font-medium">Users</span>
                                    <div className="ml-auto">
                                        {isUsersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                </>
                            )}
                        </div>
                        {shouldExpand && isUsersOpen && (
                            <div className="ml-4 mt-1 space-y-1">
                                <button
                                    onClick={() => router.push('/users-list')}
                                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${pathname === '/users-list' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                >
                                    <FileText size={16} className="mr-2" />
                                    List
                                </button>
                            </div>
                        )}
                    </div>
                    <NavItem
                        icon={<Lock size={18} />}
                        label="Roles & Permissions"
                        active={activeSection === 'roles'}
                        onClick={() => setActiveSection('roles')}
                        isCollapsed={!shouldExpand}
                    />
                </div>

                <div className="mb-6">
                    {shouldExpand && (
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider mb-3 px-3">
                            PAGES & FEATURES
                        </div>
                    )}
                    <NavItem
                        icon={<File size={18} />}
                        label="Pages"
                        active={activeSection === 'pages'}
                        onClick={() => setActiveSection('pages')}
                        isCollapsed={!shouldExpand}
                    />
                    <div className="relative">
                        <div
                            className={`flex items-center px-3 py-2 rounded-md cursor-pointer mb-1 ${isAuthPath || activeSection === 'authentication' ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            onClick={handleAuthClick}
                        >
                            <div className="text-gray-500 dark:text-gray-400"><Key size={18} /></div>
                            {shouldExpand && (
                                <>
                                    <span className="ml-3 text-sm font-medium">Authentication</span>
                                    <div className="ml-auto">
                                        {isAuthOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                </>
                            )}
                        </div>
                        {shouldExpand && isAuthOpen && (
                            <div className="ml-4 mt-1 space-y-1">
                                <button
                                    onClick={handleLoginClick}
                                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${isLoginPath ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                >
                                    <LogIn size={16} className="mr-2" />
                                    Login
                                </button>
                                <button
                                    onClick={handleRegisterClick}
                                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${isRegisterPath ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                >
                                    <UserPlus size={16} className="mr-2" />
                                    Register
                                </button>
                            </div>
                        )}
                    </div>
                    <NavItem
                        icon={<Wand2 size={18} />}
                        label="Wizard Examples"
                        active={activeSection === 'wizard'}
                        onClick={() => setActiveSection('wizard')}
                        isCollapsed={!shouldExpand}
                    />
                    <NavItem
                        icon={<Maximize size={18} />}
                        label="Modal Examples"
                        active={activeSection === 'modal'}
                        onClick={() => setActiveSection('modal')}
                        isCollapsed={!shouldExpand}
                    />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;