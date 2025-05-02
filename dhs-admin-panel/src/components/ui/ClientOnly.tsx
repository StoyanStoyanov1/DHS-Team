'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

/**
 * Props for the ClientOnly component
 */
export interface ClientOnlyProps {
    /** The content to render only on the client side */
    children: ReactNode;
}

/**
 * ClientOnly component ensures its children are only rendered on the client side
 * This avoids hydration errors and "useAuth must be used within an AuthProvider" errors during SSR
 */
export const ClientOnlyComponent = ({ children }: ClientOnlyProps) => {
    return <>{children}</>;
};

/**
 * Export the component with dynamic import to disable SSR
 */
export const ClientOnly = dynamic(() => Promise.resolve(ClientOnlyComponent), {
    ssr: false,
});

export default ClientOnly;