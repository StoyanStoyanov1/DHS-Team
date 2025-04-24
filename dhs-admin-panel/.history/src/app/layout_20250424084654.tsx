import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import DashboardLayout from '../components/Layout';
import { AuthProvider } from '@/src/hooks/useAuth';

const inter = Inter({ subsets: ['latin'] });

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
            <body className={inter.className}>
                <AuthProvider>
                    <DashboardLayout>
                        {children}
                    </DashboardLayout>
                </AuthProvider>
            </body>
        </html>
    );
}