import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import DashboardLayout from './components/Layout';
import Script from 'next/script';

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
        <head>
            <Script id="remove-footer-bar" strategy="afterInteractive">
                {`
                function removeFooterBar() {
                  // Get all elements in body
                  const allElements = document.body.getElementsByTagName('*');
                  
                  // Loop through elements to find the footer bar
                  for (let i = 0; i < allElements.length; i++) {
                    const element = allElements[i];
                    
                    // Check if it's a full width element at the bottom with black/dark background
                    const style = window.getComputedStyle(element);
                    const rect = element.getBoundingClientRect();
                    
                    // Fixed position elements at bottom that are dark
                    if (
                      (style.position === 'fixed' && rect.bottom >= window.innerHeight - 10) || 
                      (style.position === 'absolute' && rect.top >= window.innerHeight - 50) ||
                      (element.tagName === 'DIV' && rect.height < 50 && rect.width === document.body.clientWidth && rect.bottom === window.innerHeight)
                    ) {
                      element.style.display = 'none';
                      console.log('Removed footer element');
                    }
                  }
                }
                
                // Run on load and after a small delay to catch dynamically added elements
                window.addEventListener('load', function() {
                  removeFooterBar();
                  setTimeout(removeFooterBar, 1000);
                  setTimeout(removeFooterBar, 2000);
                });
                `}
            </Script>
        </head>
        <body className={inter.className}>
        <DashboardLayout>
            {children}
        </DashboardLayout>
        </body>
        </html>
    );
}