'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ThemeToggle from './ThemeToggle';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ContactInfo from './ContactInfo';
import { useRouter, usePathname } from 'next/navigation';

const NavBar: React.FC = () => {
    const [activeSection, setActiveSection] = useState('');
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();

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
            router.push('/');
            sessionStorage.setItem('scrollTo', 'home');
        }
    };

    const scrollToSection = (sectionId: string) => {
        if (pathname !== '/') {
            router.push('/');
            sessionStorage.setItem('scrollTo', sectionId);
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
        router.push('/project-request');
        sessionStorage.setItem('resetForm', 'true');
        setTimeout(() => {
            window.scrollTo({ top: 0 });
        }, 20);
    };

    useEffect(() => {
        const scrollToTarget = sessionStorage.getItem('scrollTo');
        if (scrollToTarget) {
            if (scrollToTarget === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setTimeout(() => {
                    const section = document.getElementById(scrollToTarget);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100); // Small delay to ensure DOM is ready
            }
            sessionStorage.removeItem('scrollTo');
        }
    }, [pathname]);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glassmorphism">
            <div className="container mx-auto px-4">
                <div className="py-2 flex items-center justify-between gap-6 text-sm border-b border-gray-200 dark:border-gray-800">
                    <ContactInfo openChat={openAiChat} />
                </div>
                <div className="py-4 flex items-center justify-between">
                    <span className="font-bold text-xl select-none">SparkDev</span>
                    <nav className="hidden md:flex items-center gap-8">
                        <button
                            onClick={handleHome}
                            className={`nav-link font-medium transition-colors ${activeSection === 'home' ? 'active' : ''}`}
                        >
                            Начало
                        </button>
                        <button
                            onClick={() => scrollToSection('features')}
                            className={`nav-link font-medium transition-colors ${activeSection === 'features' ? 'active' : ''}`}
                        >
                            Услуги
                        </button>
                        <button
                            onClick={() => scrollToSection('contact')}
                            className={`nav-link font-medium transition-colors ${activeSection === 'contact' ? 'active' : ''}`}
                        >
                            Контакти
                        </button>
                        <ThemeToggle />
                    </nav>
                    <div>
                        <Button
                            className="bg-blue-purple-gradient hover:opacity-90 transition-opacity"
                            onClick={handleStartProject}
                        >
                            Започни проект
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default NavBar;