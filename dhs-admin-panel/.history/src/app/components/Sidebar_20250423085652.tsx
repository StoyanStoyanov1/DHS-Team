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
    ChevronLeft,
    ChevronRight,
    LogIn,
    UserPlus,
    ChevronDown,
    ChevronUp,
    PanelLeftClose,
    PanelLeftOpen,
    Menu,
    SidebarClose
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
    
    // Check if current path is an auth path and which specific auth page
    const isAuthPath = pathname?.startsWith('/auth');
    const isLoginPage = pathname === '/auth/login';
    const isRegisterPage = pathname === '/auth/register';
    
    // Effect to auto-open auth submenu and set active section when on auth pages
    useEffect(() => {
        if (isAuthPath) {
            setIsAuthOpen(true);
            setActiveSection('authentication');
        }
    }, [pathname, isAuthPath, setActiveSection]);

    const handleAuthClick = () => {
        setIsAuthOpen(!isAuthOpen);
        setActiveSection('authentication');
    };

    const handleLoginClick = () => {
        router.push('/auth/login');
    };

    const handleRegisterClick = () => {
        router.push('/auth/register');
    };

    // Function to determine if a submenu item is active
    const isSubmenuItemActive = (path: string) => {
        return pathname === path;
    };

    return (
        <div className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-sm flex flex-col h-full ${isCollapsed ? 'w-20' : 'w-64'}`}>
            {/* Logo and Title */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center">
                    <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center shadow-sm">
                        <div className="w-6 h-6 bg-white transform rotate-45"></div>
                    </div>
                    {!isCollapsed && (
                        <span className="ml-3 text-xl font-bold text-gray-800">Admin Panel</span>
                    )}
                </div>
                <button 
                    onClick={toggleCollapse}
                    className={`p-2 rounded-full transition-all duration-200 ${
                        isCollapsed 
                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 rotate-180' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <SidebarClose size={24} strokeWidth={1.5} />
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="mb-6">
                    <NavItem
                        icon={<Grid size={18} />}
                        label="Dashboards"
                        badge="5"
                        active={activeSection === 'dashboards'}
                        onClick={() => {
                            setActiveSection('dashboards');
                            router.push('/dashboard');
                        }}
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        icon={<Maximize size={18} />}
                        label="Layouts"
                        active={activeSection === 'layouts'}
                        onClick={() => setActiveSection('layouts')}
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        icon={<File size={18} />}
                        label="Front Pages"
                        active={activeSection === 'frontpages'}
                        onClick={() => setActiveSection('frontpages')}
                        isCollapsed={isCollapsed}
                    />
                </div>

                <div className="mb-6">
                    {!isCollapsed && (
                        <div className="text-xs font-semibold text-gray-500 tracking-wider mb-3 px-3">
                            APPS & PAGES
                        </div>
                    )}
                    <NavItem
                        icon={<Mail size={18} />}
                        label="Email"
                        active={activeSection === 'email'}
                        onClick={() => setActiveSection('email')}
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        icon={<MessageSquare size={18} />}
                        label="Chat"
                        active={activeSection === 'chat'}
                        onClick={() => setActiveSection('chat')}
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        icon={<Calendar size={18} />}
                        label="Calendar"
                        active={activeSection === 'calendar'}
                        onClick={() => setActiveSection('calendar')}
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        icon={<Trello size={18} />}
                        label="Kanban"
                        active={activeSection === 'kanban'}
                        onClick={() => setActiveSection('kanban')}
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        icon={<ShoppingCart size={18} />}
                        label="eCommerce"
                        active={activeSection === 'ecommerce'}
                        onClick={() => setActiveSection('ecommerce')}
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        icon={<BookOpen size={18} />}
                        label="Academy"
                        active={activeSection === 'academy'}
                        onClick={() => setActiveSection('academy')}
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        icon={<Truck size={18} />}
                        label="Logistics"
                        active={activeSection === 'logistics'}
                        onClick={() => setActiveSection('logistics')}
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        icon={<FileText size={18} />}
                        label="Invoice"
                        active={activeSection === 'invoice'}
                        onClick={() => setActiveSection('invoice')}
                        isCollapsed={isCollapsed}
                    />
                </div>

                <div className="mb-6">
                    {!isCollapsed && (
                        <div className="text-xs font-semibold text-gray-500 tracking-wider mb-3 px-3">
                            ACCOUNT MANAGEMENT
                        </div>
                    )}
                    <NavItem
                        icon={<Users size={18} />}
                        label="Users"
                        active={activeSection === 'users'}
                        onClick={() => setActiveSection('users')}
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        icon={<Lock size={18} />}
                        label="Roles & Permissions"
                        active={activeSection === 'roles'}
                        onClick={() => setActiveSection('roles')}
                        isCollapsed={isCollapsed}
                    />
                </div>

                <div className="mb-6">
                    {!isCollapsed && (
                        <div className="text-xs font-semibold text-gray-500 tracking-wider mb-3 px-3">
                            PAGES & FEATURES
                        </div>
                    )}
                    <NavItem
                        icon={<File size={18} />}
                        label="Pages"
                        active={activeSection === 'pages'}
                        onClick={() => setActiveSection('pages')}
                        isCollapsed={isCollapsed}
                    />
                    <div className="relative">
                        <div
                            className={`flex items-center px-3 py-2 rounded-md cursor-pointer mb-1 ${
                                activeSection === 'authentication' 
                                ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700' 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                            onClick={handleAuthClick}
                        >
                            <div className={`${activeSection === 'authentication' ? 'text-blue-600' : 'text-gray-500'}`}>
                                <Key size={18} />
                            </div>
                            {!isCollapsed && (
                                <>
                                    <span className="ml-3 text-sm font-medium">Authentication</span>
                                    <div className="ml-auto">
                                        {isAuthOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </div>
                                </>
                            )}
                        </div>
                        {!isCollapsed && isAuthOpen && (
                            <div className="ml-6 mt-1 space-y-1 border-l-2 border-blue-200 pl-2">
                                <button
                                    onClick={handleLoginClick}
                                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition duration-150 ${
                                        isLoginPage 
                                        ? 'bg-blue-50 text-blue-700 font-medium' 
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <LogIn size={16} className={`mr-2 ${isLoginPage ? 'text-blue-600' : 'text-gray-500'}`} />
                                    Login
                                </button>
                                <button
                                    onClick={handleRegisterClick}
                                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition duration-150 ${
                                        isRegisterPage 
                                        ? 'bg-blue-50 text-blue-700 font-medium' 
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <UserPlus size={16} className={`mr-2 ${isRegisterPage ? 'text-blue-600' : 'text-gray-500'}`} />
                                    Register
                                </button>
                            </div>
                        )}
                    </div>
                    <NavItem
                        icon={<Wand2 size={18} />}
                        label="Utilities"
                        active={activeSection === 'utilities'}
                        onClick={() => setActiveSection('utilities')}
                        isCollapsed={isCollapsed}
                    />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;