'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// This component will only be rendered on the client side
// This avoids the "useAuth must be used within an AuthProvider" error during SSR
const ClientOnly = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

// Export as a dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(ClientOnly), {
  ssr: false,
});