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
    UserPlus
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

import SidebarHeader from './SidebarHeader';
import SidebarSection from './SidebarSection';
import NavItem from './NavItem';
import ExpandableNavItem from './ExpandableNavItem';

interface SidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

/**
 * Main sidebar component for navigation
 */
export const Sidebar: React.FC<SidebarProps> = ({
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

    const togglePin = () => {
        setIsPinned(!isPinned);
    };

    const shouldExpand = isPinned || isHovering;

    return (
        <div
            className={`bg-white border-r border-gray-200 transition-all duration-300 h-screen ${shouldExpand ? 'w-64' : 'w-20'} flex flex-col`}
            onMouseEnter={() => !isPinned && setIsHovering(true)}
            onMouseLeave={() => !isPinned && setIsHovering(false)}
        >
            <SidebarHeader 
                isPinned={isPinned} 
                togglePin={togglePin} 
                shouldExpand={shouldExpand} 
            />

            <div className="px-4 py-2 overflow-y-auto flex-grow custom-scrollbar">
                <SidebarSection shouldExpand={shouldExpand}>
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
                </SidebarSection>

                <SidebarSection title="APPS & PAGES" shouldExpand={shouldExpand}>
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
                </SidebarSection>

                <SidebarSection title="ACCOUNT MANAGEMENT" shouldExpand={shouldExpand}>
                    <ExpandableNavItem
                        icon={<Users size={18} />}
                        label="Users"
                        isOpen={isUsersOpen}
                        isActive={activeSection === 'users'}
                        onClick={handleUsersClick}
                        shouldExpand={shouldExpand}
                    >
                        <button
                            onClick={() => router.push('/users-list')}
                            className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${pathname === '/users-list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <FileText size={16} className="mr-2" />
                            List
                        </button>
                    </ExpandableNavItem>
                    <NavItem
                        icon={<Lock size={18} />}
                        label="Roles & Permissions"
                        active={activeSection === 'roles'}
                        onClick={() => setActiveSection('roles')}
                        isCollapsed={!shouldExpand}
                    />
                </SidebarSection>

                <SidebarSection title="PAGES & FEATURES" shouldExpand={shouldExpand}>
                    <NavItem
                        icon={<File size={18} />}
                        label="Pages"
                        active={activeSection === 'pages'}
                        onClick={() => setActiveSection('pages')}
                        isCollapsed={!shouldExpand}
                    />
                    <ExpandableNavItem
                        icon={<Key size={18} />}
                        label="Authentication"
                        isOpen={isAuthOpen}
                        isActive={isAuthPath || activeSection === 'authentication'}
                        onClick={handleAuthClick}
                        shouldExpand={shouldExpand}
                    >
                        <button
                            onClick={() => router.push('/auth/login')}
                            className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${isLoginPath ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <LogIn size={16} className="mr-2" />
                            Login
                        </button>
                        <button
                            onClick={() => router.push('/auth/register')}
                            className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${isRegisterPath ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <UserPlus size={16} className="mr-2" />
                            Register
                        </button>
                    </ExpandableNavItem>
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
                </SidebarSection>
            </div>
        </div>
    );
};

export default Sidebar;