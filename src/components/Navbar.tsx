import Link from "next/link";
import React from "react";
import UserAccountNav from "./UserAccountNav";
import { ThemeToggle } from "./ThemeToggle";
import { getAuthSession } from "@/lib/nextauth";
import SignInButton from "./SignInButton";

const Navbar = async () => {
  const session = await getAuthSession();
  return (
    <header className="fixed inset-x-0 top-0 bg-white dark:bg-gray-900 z-10 h-20 border-b border-gray-300 dark:border-gray-700 py-4 shadow-sm">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl">
        {/* Logo */}
        <Link href={"/"} className="flex items-center gap-2">
          <p className="text-2xl font-bold text-orange-600">Cantova</p>
        </Link>

        {/* Navigation Links */}
        <nav className="flex space-x-4">
          <Link href="#" className="text-black hover:text-orange-600 dark:text-gray-100 dark:hover:text-orange-600">
            For Individuals
          </Link>
          <Link href="#" className="text-black hover:text-orange-600 dark:text-gray-100 dark:hover:text-orange-600">
            For Businesses
          </Link>
          <Link href="#" className="text-black hover:text-orange-600 dark:text-gray-100 dark:hover:text-orange-600">
            News & Reports
          </Link>
          <Link href="#" className="text-black hover:text-orange-600 dark:text-gray-100 dark:hover:text-orange-600">
            About Us
          </Link>
        </nav>

        <div className="flex items-center">
        
          {session?.user ? (
            <UserAccountNav user={session.user} />
          ) : (
            <SignInButton text={"Log In"} className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
