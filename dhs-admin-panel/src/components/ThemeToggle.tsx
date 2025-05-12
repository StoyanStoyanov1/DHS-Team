"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, MonitorSmartphone } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Avoid hydration mismatch by only rendering client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className={`
            relative overflow-hidden rounded-full w-10 h-10 
            border-gray-200 dark:border-gray-700
            bg-white hover:bg-gray-100 
            dark:bg-gray-800 dark:hover:bg-gray-700
            shadow-sm hover:shadow-md
            transition-all duration-300 ease-in-out
            ${isOpen ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
          `}
        >
          <span className="sr-only">Toggle theme</span>
          
          {/* Light mode icon with animation */}
          <span 
            className={`
              absolute inset-0 flex items-center justify-center
              transition-all duration-500 ease-spring
              ${theme === 'dark' ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}
            `}
          >
            <Sun className="h-5 w-5 text-amber-500 animate-slight-pulse" />
          </span>
          
          {/* Dark mode icon with animation */}
          <span 
            className={`
              absolute inset-0 flex items-center justify-center
              transition-all duration-500 ease-spring
              ${theme === 'light' ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}
            `}
          >
            <Moon className="h-5 w-5 text-indigo-400" />
          </span>

          {/* System mode indicator */}
          {theme === 'system' && (
            <span className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-green-500 rounded-full shadow-glow-sm"></span>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-[200px] p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/30"
        sideOffset={8}
      >
        <div className="grid grid-cols-1 gap-1.5">
          <Button
            variant={theme === "light" ? "default" : "ghost"}
            className={`
              flex items-center justify-start gap-3 px-3 py-2 rounded-lg
              ${theme === "light" 
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100"}
              transition-all duration-200
            `}
            onClick={() => {
              setTheme("light");
              setTimeout(() => setIsOpen(false), 200);
            }}
          >
            <Sun className={`h-5 w-5 ${theme === "light" ? "text-white" : "text-amber-500"}`} />
            <span className="font-medium">Light Mode</span>
          </Button>
          
          <Button
            variant={theme === "dark" ? "default" : "ghost"}
            className={`
              flex items-center justify-start gap-3 px-3 py-2 rounded-lg
              ${theme === "dark" 
                ? "bg-blue-500 hover:bg-blue-600 text-white" 
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100"}
              transition-all duration-200
            `}
            onClick={() => {
              setTheme("dark");
              setTimeout(() => setIsOpen(false), 200);
            }}
          >
            <Moon className={`h-5 w-5 ${theme === "dark" ? "text-white" : "text-indigo-400"}`} />
            <span className="font-medium">Dark Mode</span>
          </Button>
          
          <Button
            variant={theme === "system" ? "default" : "ghost"}
            className={`
              flex items-center justify-start gap-3 px-3 py-2 rounded-lg
              ${theme === "system" 
                ? "bg-blue-500 hover:bg-blue-600 text-white" 
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100"}
              transition-all duration-200
            `}
            onClick={() => {
              setTheme("system");
              setTimeout(() => setIsOpen(false), 200);
            }}
          >
            <MonitorSmartphone className={`h-5 w-5 ${theme === "system" ? "text-white" : "text-green-500 dark:text-green-400"}`} />
            <span className="font-medium">System Default</span>
          </Button>
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            {theme === "system" ? "Following your system preference" : 
              theme === "dark" ? "Dark mode activated" : "Light mode activated"}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}