'use client';

import React from 'react';
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
    ChevronRight
} from 'lucide-react';
import NavItem from './NavItem';

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
    return (
        <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            {/* Logo and Title */}
            <div className="flex items-center justify-between p-5">
                <div className="flex items-center">
                    <div className="h-10 w-10 rounded bg-blue-500 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white transform rotate-45"></div>
                    </div>
                    {!isCollapsed && (
                        <span className="ml-3 text-xl font-bold text-gray-800">Admin Panel</span>
                    )}
                </div>
                <button 
                    onClick={toggleCollapse}
                    className="text-gray-500 hover:text-gray-700"
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            {/* Navigation */}
            <div className="px-4 py-2">
                <div className="mb-6">
                    <NavItem
                        icon={<Grid size={18} />}
                        label="Dashboards"
                        badge="5"
                        active={activeSection === 'dashboards'}
                        onClick={() => setActiveSection('dashboards')}
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
                    <NavItem
                        icon={<Key size={18} />}
                        label="Authentication"
                        active={activeSection === 'authentication'}
                        onClick={() => setActiveSection('authentication')}
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        icon={<Wand2 size={18} />}
                        label="Wizard Examples"
                        active={activeSection === 'wizard'}
                        onClick={() => setActiveSection('wizard')}
                        isCollapsed={isCollapsed}
                    />
                    <NavItem
                        icon={<Maximize size={18} />}
                        label="Modal Examples"
                        active={activeSection === 'modal'}
                        onClick={() => setActiveSection('modal')}
                        isCollapsed={isCollapsed}
                    />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;