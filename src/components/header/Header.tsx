"use client"

import { Heart, ShoppingCart, User } from "lucide-react";
import { useState } from "react";

import SearchBar from "../searchBar/SearchBar";
import Logo from "../logo/Logo";

export default function Header() {
  const [wishlistCount, setWishlistCount] = useState(5);
  const [cartCount, setCartCount] = useState(3);

  return (
    <header className="flex items-center justify-between p-6 bg-white shadow">
      <Logo />

      <SearchBar />

      <div className="flex items-center space-x-4">
        <User className="w-6 h-6 text-gray-600" />
        <div className="relative">
          <Heart className="w-6 h-6 text-gray-600" />
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
              {wishlistCount}
            </span>
          )}
        </div>
        <div className="relative">
          <ShoppingCart className="w-6 h-6 text-gray-600" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
