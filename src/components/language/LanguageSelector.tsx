"use client";

import 'flag-icons/css/flag-icons.min.css';
import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {ChevronDownIcon} from "lucide-react";
import { useLanguage } from '@/context/language/LanguageContext';

type Language = 'de' | 'en' | 'bg';

interface Languages {
  [key: string]: string;
}

export default function LanguageDropdown() {
  const languages: Languages = {
    de: "fi fi-de",
    en: "fi fi-gb",
    bg: "fi fi-bg"
  }

  const {language, setLanguage} = useLanguage();

  return (
    <div className="sm:block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1 p-2 text-sm">
            <span className={languages[language]}></span>
            <ChevronDownIcon className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-16 text-sm min-w-0">
          {Object.keys(languages).map((lang) => (
            <DropdownMenuItem  onClick={() => setLanguage(lang as Language)} key={lang} className="flex items-center justify-between">
              <span className={languages[lang as Language]}></span>
              <span>{lang.toUpperCase()}</span>
          </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
