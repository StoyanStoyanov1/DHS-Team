"use client"

import Image from "next/image";

export default function Home() {
  return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-xl font-semibold mb-4">Добре дошли в админ панела</h1>
        <p className="text-gray-600">
          Изберете опция от страничната навигация, за да започнете работа.
        </p>
      </div>
  );
}
