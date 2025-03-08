"use client";

import { useState, useRef, useEffect } from "react";
import Logo from "../logo/Logo";
import LanguageSelector from "../language/LanguageSelector";
import Menu from "@/components/menu/Menu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "next/navigation";
import routes from "@/utils/routes";

export default function Header() {
      const router = useRouter();
  

  const userRef = useRef<HTMLDivElement>(null);
  const registerRef = useRef<HTMLDivElement>(null);


  return (
    <header className="relative flex items-center justify-between p-2 bg-white shadow">
      <div className="flex gap-5">
      <Logo onClick={() => router.push(routes.home)}/>
      <LanguageSelector />

      </div>
            
      <div>
                  <FontAwesomeIcon onClick={() => router.push(routes.login)} icon={faSignInAlt} size="2x" style={{ color: '#4CAF50', transition: '0.3s' }} />
                  <Menu />
      </div>
      

    </header>
  );
}
