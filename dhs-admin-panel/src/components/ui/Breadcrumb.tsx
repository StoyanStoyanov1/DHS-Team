'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';

/**
 * Interface for breadcrumb items
 */
export interface BreadcrumbItem {
    /** Display label for the breadcrumb item */
    label: string;
    /** URL path for the breadcrumb item */
    path: string;
}

/**
 * Breadcrumb component for displaying navigation path
 */
export const Breadcrumb: React.FC = () => {
    const pathname = usePathname();

    /**
     * Generate breadcrumb items based on the current path
     */
    const getBreadcrumbItems = (): BreadcrumbItem[] => {
        if (!pathname) return [];

        const pathSegments = pathname.split('/').filter(Boolean);
        let currentPath = '';

        return pathSegments.map((segment) => {
            currentPath += `/${segment}`;

            let label = segment.charAt(0).toUpperCase() + segment.slice(1);

            // Custom labels for specific paths
            if (segment === 'auth') {
                label = 'Authentication';
            } else if (segment === 'users-list') {
                label = 'Users List';
            }

            return {
                label,
                path: currentPath,
            };
        });
    };

    const breadcrumbItems = getBreadcrumbItems();

    if (pathname === '/') {
        return null;
    }

    return (
        <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li>
                    <Link href="/" className="flex items-center hover:text-blue-600">
                        <Home size={16} />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>

                {breadcrumbItems.map((item, index) => (
                    <React.Fragment key={item.path}>
                        <li className="flex items-center">
                            <ChevronRight size={16} className="text-gray-400" />
                        </li>
                        <li>
                            {index === breadcrumbItems.length - 1 ? (
                                <span className="font-medium text-blue-600">{item.label}</span>
                            ) : (
                                <Link href={item.path} className="hover:text-blue-600">
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    </React.Fragment>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;