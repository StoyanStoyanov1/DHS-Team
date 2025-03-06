"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import SearchBar from "../searchBar/SearchBar";
import Logo from "../logo/Logo";
import LoginForm from "@/components/auth/login-form";
import LanguageSelector from "../language/LanguageSelector";
import Menu from "@/components/menu/Menu";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const userRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      userRef.current && !userRef.current.contains(e.target as Node) &&
      registerRef.current && !registerRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <header className="relative flex items-center justify-between p-3 bg-white shadow">
      <Menu />
      <Logo />
      <SearchBar />
      
      <div className="absolute top-1 right-6">
        <LanguageSelector />
      </div>

      <div className="relative" ref={userRef}>
        
        {isOpen && (
          <div
            ref={registerRef}
            className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-lg p-1 z-20"
          >
            <LoginForm />
          </div>
        )}
      </div>
    </header>
  );
}
