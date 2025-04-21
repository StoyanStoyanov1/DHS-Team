"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function ThemeToggle() {
    // Use null as initial state to handle server-side rendering
    const [isDark, setIsDark] = useState<boolean | null>(null);

    useEffect(() => {
        // Get theme from localStorage or system preference
        const savedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        // Determine the initial theme
        const initialIsDark =
            savedTheme === "dark" ||
            (savedTheme === null && systemPrefersDark);

        setIsDark(initialIsDark);

        // Apply theme
        if (initialIsDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);

        if (newIsDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    // Only render the component after hydration
    if (isDark === null) {
        return null;
    }

    return (
        <div className="flex items-center space-x-2">
        <Sun size={18} className="text-yellow-500" />
    <Switch checked={isDark} onCheckedChange={toggleTheme} />
    <Moon size={18} className="text-blue-500" />
        </div>
);
}