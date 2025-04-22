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
    Maximize
} from 'lucide-react';
import NavItem from './NavItem';

interface SidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
    return (
        <div className="w-64 bg-white border-r border-gray-200">
            {/* Лого */}
            <div className="flex items-center p-5">
                <div className="h-10 w-10 rounded bg-blue-500 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white transform rotate-45"></div>
                </div>
                <span className="ml-3 text-xl font-semibold">Admin Panel</span>
            </div>

            {/* Навигация */}
            <div className="px-4 py-2">
                <div className="mb-6">
                    <NavItem
                        icon={<Grid size={18} />}
                        label="Dashboards"
                        badge="5"
                        active={activeSection === 'dashboards'}
                        onClick={() => setActiveSection('dashboards')}
                    />
                    <NavItem
                        icon={<Maximize size={18} />}
                        label="Layouts"
                        active={activeSection === 'layouts'}
                        onClick={() => setActiveSection('layouts')}
                    />
                    <NavItem
                        icon={<File size={18} />}
                        label="Front Pages"
                        active={activeSection === 'frontpages'}
                        onClick={() => setActiveSection('frontpages')}
                    />
                </div>

                <div className="mb-6">
                    <div className="text-xs font-semibold text-gray-500 tracking-wider mb-3 px-3">
                        APPS & PAGES
                    </div>
                    <NavItem
                        icon={<Mail size={18} />}
                        label="Email"
                        active={activeSection === 'email'}
                        onClick={() => setActiveSection('email')}
                    />
                    <NavItem
                        icon={<MessageSquare size={18} />}
                        label="Chat"
                        active={activeSection === 'chat'}
                        onClick={() => setActiveSection('chat')}
                    />
                    <NavItem
                        icon={<Calendar size={18} />}
                        label="Calendar"
                        active={activeSection === 'calendar'}
                        onClick={() => setActiveSection('calendar')}
                    />
                    <NavItem
                        icon={<Trello size={18} />}
                        label="Kanban"
                        active={activeSection === 'kanban'}
                        onClick={() => setActiveSection('kanban')}
                    />
                    <NavItem
                        icon={<ShoppingCart size={18} />}
                        label="eCommerce"
                        active={activeSection === 'ecommerce'}
                        onClick={() => setActiveSection('ecommerce')}
                    />
                    <NavItem
                        icon={<BookOpen size={18} />}
                        label="Academy"
                        active={activeSection === 'academy'}
                        onClick={() => setActiveSection('academy')}
                    />
                    <NavItem
                        icon={<Truck size={18} />}
                        label="Logistics"
                        active={activeSection === 'logistics'}
                        onClick={() => setActiveSection('logistics')}
                    />
                    <NavItem
                        icon={<FileText size={18} />}
                        label="Invoice"
                        active={activeSection === 'invoice'}
                        onClick={() => setActiveSection('invoice')}
                    />
                </div>

                <div className="mb-6">
                    <div className="text-xs font-semibold text-gray-500 tracking-wider mb-3 px-3">
                        ACCOUNT MANAGEMENT
                    </div>
                    <NavItem
                        icon={<Users size={18} />}
                        label="Users"
                        active={activeSection === 'users'}
                        onClick={() => setActiveSection('users')}
                    />
                    <NavItem
                        icon={<Lock size={18} />}
                        label="Roles & Permissions"
                        active={activeSection === 'roles'}
                        onClick={() => setActiveSection('roles')}
                    />
                </div>

                <div className="mb-6">
                    <div className="text-xs font-semibold text-gray-500 tracking-wider mb-3 px-3">
                        PAGES & FEATURES
                    </div>
                    <NavItem
                        icon={<File size={18} />}
                        label="Pages"
                        active={activeSection === 'pages'}
                        onClick={() => setActiveSection('pages')}
                    />
                    <NavItem
                        icon={<Key size={18} />}
                        label="Authentication"
                        active={activeSection === 'authentication'}
                        onClick={() => setActiveSection('authentication')}
                    />
                    <NavItem
                        icon={<Wand2 size={18} />}
                        label="Wizard Examples"
                        active={activeSection === 'wizard'}
                        onClick={() => setActiveSection('wizard')}
                    />
                    <NavItem
                        icon={<Maximize size={18} />}
                        label="Modal Examples"
                        active={activeSection === 'modal'}
                        onClick={() => setActiveSection('modal')}
                    />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;