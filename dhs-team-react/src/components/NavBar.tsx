
import React, { useState, useEffect, useCallback } from 'react';
import ThemeToggle from './ThemeToggle';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import ContactInfo from './ContactInfo';

const NavBar: React.FC = () => {
  const [activeSection, setActiveSection] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

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

  // Функция за отваряне чат-а
  const openAiChat = useCallback(() => {
    const chatButton = document.querySelector('button[aria-label="Open AI Chat"]')
    || document.querySelector('.fixed.bottom-4.right-4');
    if (chatButton instanceof HTMLButtonElement) {
      chatButton.click();
    }
  }, []);

  // handleHome, handleStartProject, scrollToSection коригирам навсякъде
  const handleHome = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: 'home' } });
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      // Навигирай към началната и маркирай къде да скролира
      navigate('/', { state: { scrollTo: sectionId } });
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
    navigate('/project-request', { state: { reset: true } });
    setTimeout(() => {
      window.scrollTo({ top: 0 });
    }, 20);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glassmorphism">
      <div className="container mx-auto px-4">
        <div className="py-2 flex items-center justify-between gap-6 text-sm border-b border-gray-200 dark:border-gray-800">
          <ContactInfo openChat={openAiChat} />
        </div>
        <div className="py-4 flex items-center justify-between">
          {/* Махаме логото (къщичката) – само име */}
          <span className="font-bold text-xl select-none">SparkDev</span>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="/"
              onClick={e => { e.preventDefault(); handleHome(); }}
              className={`nav-link font-medium transition-colors ${activeSection === 'home' ? 'active' : ''}`}
            >
              Начало
            </a>
            <a
              href="#features"
              onClick={e => { e.preventDefault(); scrollToSection('features'); }}
              className={`nav-link font-medium transition-colors ${activeSection === 'features' ? 'active' : ''}`}
            >
              Услуги
            </a>
            <a
              href="#contact"
              onClick={e => { e.preventDefault(); scrollToSection('contact'); }}
              className={`nav-link font-medium transition-colors ${activeSection === 'contact' ? 'active' : ''}`}
            >
              Контакти
            </a>
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
