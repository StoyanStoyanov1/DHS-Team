'use client';

import React, { useState, useEffect, useCallback } from 'react';
// import ThemeToggle from './ThemeToggle';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { useToast } from '@/hooks/use-toast';
// import ContactInfo from './ContactInfo';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const NavBar: React.FC = () => {
    const [activeSection, setActiveSection] = useState('');
    // const navigate = useNavigate();
    // const location = useLocation();
    const router = useRouter();
    const pathname = usePathname();
    // const { toast } = useToast();

    // Фокус на 'home' САМО най-горе (scroll < 100)
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY < 100) {
                setActiveSection('home');
                return;
            }
            const sections = document.querySelectorAll('section[id]');
            let currentSection = '';
            sections.forEach(section => {
                const htmlSection = section as HTMLElement;
                const sectionTop = htmlSection.offsetTop;
                if (window.scrollY >= sectionTop - 100) {
                    currentSection = section.getAttribute('id') || '';
                }
            });
            setActiveSection(currentSection);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const openAiChat = useCallback(() => {
        const chatButton = document.querySelector('button[aria-label="Open AI Chat"]')
            || document.querySelector('.fixed.bottom-4.right-4');
        if (chatButton instanceof HTMLButtonElement) {
            chatButton.click();
        }
    }, []);

    const handleHome = () => {
        if (pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // navigate('/', { state: { scrollTo: 'home' } });
            router.push('/');
            localStorage.setItem('scrollTo', 'home');
        }
    };

    const scrollToSection = (sectionId: string) => {
        if (pathname !== '/') {
            // navigate('/', { state: { scrollTo: sectionId } });
            router.push('/');
            localStorage.setItem('scrollTo', sectionId);
        } else {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                document.body.classList.add('section-transition');
                setTimeout(() => {
                    document.body.classList.remove('section-transition');
                }, 500);
            }
        }
    };

    const handleStartProject = () => {
        // navigate('/project-request', { state: { reset: true } });
        router.push('/project-request');
        localStorage.setItem('resetForm', 'true');
        setTimeout(() => {
            window.scrollTo({ top: 0 });
        }, 20);
    };

    // Проверяваме за scrollTo параметър при компонент mount
    useEffect(() => {
        const scrollToTarget = localStorage.getItem('scrollTo');
        if (scrollToTarget) {
            if (scrollToTarget === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const section = document.getElementById(scrollToTarget);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }
            localStorage.removeItem('scrollTo');
        }
    }, [pathname]);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glassmorphism">
            <div className="container mx-auto px-4">
                <div className="py-2 flex items-center justify-between gap-6 text-sm border-b border-gray-200 dark:border-gray-800">
                    {/* <ContactInfo openChat={openAiChat} /> */}
                </div>
                <div className="py-4 flex items-center justify-between">
                    <span className="font-bold text-xl select-none">SparkDev</span>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            onClick={e => { e.preventDefault(); handleHome(); }}
                            className={`nav-link font-medium transition-colors ${activeSection === 'home' ? 'active' : ''}`}
                        >
                            Начало
                        </Link>
                        <Link
                            href="#features"
                            onClick={e => { e.preventDefault(); scrollToSection('features'); }}
                            className={`nav-link font-medium transition-colors ${activeSection === 'features' ? 'active' : ''}`}
                        >
                            Услуги
                        </Link>
                        <Link
                            href="#contact"
                            onClick={e => { e.preventDefault(); scrollToSection('contact'); }}
                            className={`nav-link font-medium transition-colors ${activeSection === 'contact' ? 'active' : ''}`}
                        >
                            Контакти
                        </Link>
                        {/* <ThemeToggle /> */}
                    </nav>
                    <div>
                        {/* <Button
                            className="bg-blue-purple-gradient hover:opacity-90 transition-opacity"
                            onClick={handleStartProject}
                        >
                            Започни проект
                        </Button> */}
                        <button
                            className="bg-blue-purple-gradient hover:opacity-90 transition-opacity px-4 py-2 rounded-md text-white font-medium"
                            onClick={handleStartProject}
                        >
                            Започни проект
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default NavBar;