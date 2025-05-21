import type { Metadata } from 'next';
import './globals.css';
import Layout from '@/src/components/Layout';
import { AuthProvider } from '@/src/hooks/useAuth';
import { ThemeProvider } from '@/src/components/ThemeProvider';
// Импортът на ReduxProvider е коментиран, тъй като още няма да го използваме
// import ReduxProvider from '@/src/components/providers/ReduxProvider';

export const metadata: Metadata = {
    title: 'Admin Dashboard',
    description: 'NextJS Admin Dashboard',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
            {/* ReduxProvider е премахнат временно, тъй като още няма да се използва */}
            <ThemeProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </ThemeProvider>
        </body>
        </html>
    );
}
