
import React, { useEffect } from 'react';
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import CodeEditorAnimation from '@/components/CodeEditorAnimation';
import SqlEditorAnimation from '@/components/SqlEditorAnimation';
import useScrollAnimation from '@/hooks/useScrollAnimation';
import FeatureCards from '@/components/FeatureCards';
import { useLocation } from 'react-router-dom';

const Index = () => {
  useScrollAnimation();
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      const heroElements = document.querySelectorAll('.hero-reveal');
      heroElements.forEach(el => el.classList.add('active'));
    }, 300);
  }, []);

  // Навигация към секция по заявка от навигационния бар (навигира през NavBar с location.state)
  useEffect(() => {
    if (location.state && 'scrollTo' in location.state && typeof location.state.scrollTo === 'string') {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth' });
        }, 220);
      }
      // Изчистване на state
      window.history.replaceState(null, '');
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gradient-radial from-blue-50 to-transparent dark:from-gray-900 dark:to-gray-950">
      <NavBar />
      <main>
        <section className="container mx-auto px-4 pt-20">
          <div className="w-full mb-20 hero-reveal stagger-children text-center">
            <HeroSection />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            <div className="hero-reveal reveal-delay-2">
              <CodeEditorAnimation />
            </div>
            <div className="hero-reveal reveal-delay-3">
              <SqlEditorAnimation />
            </div>
          </div>
          <div className="mb-20">
            <FeaturesSection />
          </div>
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
