import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/toaster";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "SparkDev - Иновативни софтуерни решения",
    description: "Персонализиран софтуер с изкуствен интелект и традиционни подходи за оптимални бизнес резултати",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="bg" suppressHydrationWarning>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
              try {
                const savedTheme = localStorage.getItem('theme');
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                
                if (savedTheme === 'dark' || (savedTheme === null && systemPrefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                console.error('Error applying theme:', e);
              }
            `,
                }}
            />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
              document.addEventListener('DOMContentLoaded', function() {
                // Функция за наблюдаване на елементи с клас 'reveal'
                function checkReveal() {
                  var reveals = document.querySelectorAll('.reveal');
                  
                  reveals.forEach(function(reveal) {
                    var windowHeight = window.innerHeight;
                    var elementTop = reveal.getBoundingClientRect().top;
                    var elementVisible = 150;
                    
                    if (elementTop < windowHeight - elementVisible) {
                      reveal.classList.add('active');
                    }
                  });
                }
                
                // Първоначално проверяваме всички елементи
                checkReveal();
                
                // Проверяваме при скролиране
                window.addEventListener('scroll', checkReveal);
              });
            `,
                }}
            />
            <title>SparkDev</title>
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        >
        <div
            className="min-h-screen bg-gradient-radial from-blue-50 to-transparent dark:from-gray-900 dark:to-gray-950">
            <header>
                <NavBar/>
            </header>
            <main>
                {children}
            </main>
            <footer>
                <Footer/>
            </footer>
        </div>

        <Toaster/>
        </body>
        </html>
    );
}