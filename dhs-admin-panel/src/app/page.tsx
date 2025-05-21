"use client"

import Layout from "@/src/components/Layout";
import Image from "next/image";

export default function Home() {
  return (
    <Layout>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-gray-700/20">
        <h1 className="text-xl font-semibold mb-4 dark:text-white">Добре дошли в админ панела</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Изберете опция от страничната навигация, за да започнете работа.
        </p>
      </div>
    </Layout>
  );
}
