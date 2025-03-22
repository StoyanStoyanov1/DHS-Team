"use client";

import { useState, useRef, useEffect } from "react";
import Logo from "../logo/Logo";
import Menu from "@/components/menu/Menu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faBars, faPhone, faClock } from '@fortawesome/free-solid-svg-icons';
import { useRouter, usePathname } from "next/navigation";
import routes from "@/utils/routes";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* Top Bar */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-8 text-sm">
            <div className="flex items-center space-x-4">
              <a href="tel:+49123456789" className="group flex items-center text-gray-600 hover:text-primary transition-all duration-300">
                <FontAwesomeIcon icon={faPhone} className="mr-2 w-4 h-4 transform group-hover:scale-110 transition-transform duration-300" />
                +49 123 456 789
              </a>
              <div className="flex items-center text-gray-600">
                <FontAwesomeIcon icon={faClock} className="mr-2 w-4 h-4" />
                Mo - Fr: 09:00 - 20:00
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a href="#" className="relative text-gray-600 hover:text-primary transition-colors duration-300 group">
                Impressum
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#" className="relative text-gray-600 hover:text-primary transition-colors duration-300 group">
                Datenschutz
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <Logo onClick={() => router.push(routes.home)} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              <Link 
                href={routes.appointments} 
                className={`relative text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-300 group ${
                  isActive(routes.appointments) ? 'text-primary after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-primary' : ''
                }`}
              >
                Termine
              </Link>
              <Link 
                href={routes.services} 
                className={`relative text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-300 group ${
                  isActive(routes.services) ? 'text-primary after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-primary' : ''
                }`}
              >
                Dienstleistungen
              </Link>
              <Link 
                href={routes.products} 
                className={`relative text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-300 group ${
                  isActive(routes.products) ? 'text-primary after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-primary' : ''
                }`}
              >
                Produkte
              </Link>
              <Link 
                href="/uber-uns" 
                className={`relative text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-300 group ${
                  isActive('/uber-uns') ? 'text-primary after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-primary' : ''
                }`}
              >
                Über uns
              </Link>
              <Link 
                href="/kontakt" 
                className={`relative text-sm font-medium text-gray-700 hover:text-primary transition-colors duration-300 group ${
                  isActive('/kontakt') ? 'text-primary after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-0.5 after:bg-primary' : ''
                }`}
              >
                Kontakt
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.push(routes.auth)}
                className="group relative inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-white shadow hover:bg-primary/90 h-10 px-6 py-2"
              >
                <span className="relative z-10 flex items-center">
                  <FontAwesomeIcon icon={faSignInAlt} className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                  Anmelden
                </span>
              </button>
              <Menu />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-all duration-300"
            >
              <FontAwesomeIcon icon={faBars} className="h-6 w-6 transform group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white border-b shadow-lg" ref={menuRef}>
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link 
                href={routes.appointments} 
                className={`group block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-300 ${
                  isActive(routes.appointments) ? 'text-primary' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                  Termine
                </span>
              </Link>
              <Link 
                href={routes.services} 
                className={`group block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-300 ${
                  isActive(routes.services) ? 'text-primary' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                  Dienstleistungen
                </span>
              </Link>
              <Link 
                href={routes.products} 
                className={`group block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-300 ${
                  isActive(routes.products) ? 'text-primary' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                  Produkte
                </span>
              </Link>
              <Link 
                href="/uber-uns" 
                className={`group block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-300 ${
                  isActive('/uber-uns') ? 'text-primary' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                  Über uns
                </span>
              </Link>
              <Link 
                href="/kontakt" 
                className={`group block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-all duration-300 ${
                  isActive('/kontakt') ? 'text-primary' : ''
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                  Kontakt
                </span>
              </Link>
              <div className="border-t border-gray-200 pt-2">
                <button 
                  onClick={() => {
                    router.push(routes.auth);
                    setIsMenuOpen(false);
                  }}
                  className="group relative w-full inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-white shadow hover:bg-primary/90 h-10 px-6 py-2"
                >
                  <span className="relative z-10 flex items-center">
                    <FontAwesomeIcon icon={faSignInAlt} className="mr-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                    Anmelden
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
