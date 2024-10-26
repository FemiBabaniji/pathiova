import React from "react";
import Link from "next/link";

const Navbar2 = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between h-16 px-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <p className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</p>
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link href="/dashboard" className="text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white">
            Home
          </Link>
          <Link href="/dashboard/leaderboard" className="text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white">
            Leaderboard
          </Link>
          <Link href="/dashboard/quests" className="text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white">
            Quests
          </Link>
          <Link href="/dashboard/shop" className="text-gray-600 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white">
            Shop
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar2;