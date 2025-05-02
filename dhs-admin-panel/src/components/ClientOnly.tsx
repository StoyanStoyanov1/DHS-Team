'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// This component avoids the "useAuth must be used within an AuthProvider" error during SSR
const ClientOnly = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default dynamic(() => Promise.resolve(ClientOnly), {
  ssr: false,
});