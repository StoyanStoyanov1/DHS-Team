"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Package, 
  DollarSign, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function AdminNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/appointments", label: "Termine", icon: Calendar },
    { href: "/admin/clients", label: "Kunden", icon: Users },
    { href: "/admin/products", label: "Produkte", icon: Package },
    { href: "/admin/finance", label: "Finanzen", icon: DollarSign },
    { href: "/admin/settings", label: "Einstellungen", icon: Settings },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white border-b">
      <nav className="container mx-auto px-4" aria-label="Admin navigation">
        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-primary"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
            <h1 className="text-lg font-semibold">Admin Panel</h1>
          </div>

          {isMobileMenuOpen && (
            <div 
              id="mobile-menu" 
              className="py-4 space-y-2"
              role="menu"
              aria-label="Mobile navigation"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                    role="menuitem"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
} 