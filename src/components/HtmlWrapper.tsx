"use client";

import { useLanguage } from "@/context/language/LanguageContext";

export default function HtmlWrapper({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();

  return (
    <html lang={language}>
      <body>{children}</body>
    </html>
  );
}
