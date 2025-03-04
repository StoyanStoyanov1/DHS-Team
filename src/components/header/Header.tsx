"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import SearchBar from "../searchBar/SearchBar";
import Logo from "../logo/Logo";
import Register from "@/components/auth/register";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Ref за проследяване на иконата на потребителя и самия Register компонент
  const userRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);

  // Функция, която затваря формуляра ако е кликнато извън него
  const handleClickOutside = (e: MouseEvent) => {
    // Проверяваме дали кликът е извън потребителската икона и самия Register компонент
    if (
      userRef.current && !userRef.current.contains(e.target as Node) &&
      registerRef.current && !registerRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false); // Затваряме менюто
    }
  };

  // Добавяне и премахване на слушател за клик извън компонента
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <header className="relative flex items-center justify-between p-6 bg-white shadow">
      <Logo />
      <SearchBar />

      <div className="relative" ref={userRef}>
        <User
          className="w-6 h-6 text-gray-600 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
        {isOpen && (
          <div
            ref={registerRef}
            className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-2 z-20"
          >
            <Register />
          </div>
        )}
      </div>
    </header>
  );
}
