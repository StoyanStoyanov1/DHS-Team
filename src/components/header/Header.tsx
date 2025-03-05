"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import SearchBar from "../searchBar/SearchBar";
import Logo from "../logo/Logo";
import Register from "@/components/auth/register";
import LanguageSelector from "../language/LanguageSelector";

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
    <header className="relative flex items-center justify-between p-4 bg-white shadow">
      <Logo />
      <SearchBar />
      
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      <div className="relative" ref={userRef}>
        <User
          className="w-6 h-6 text-gray-600 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
        {isOpen && (
          <div
            ref={registerRef}
            className="absolute right-0 mt-2 w-65 bg-white shadow-lg rounded-lg p-1 z-20"
          >
            <Register />
          </div>
        )}
      </div>
    </header>
  );
}
