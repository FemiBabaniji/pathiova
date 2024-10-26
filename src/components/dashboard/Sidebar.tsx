"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
// Import icons individually to ensure they're available
import { FaHome } from "react-icons/fa";

import { FaTrophy } from "react-icons/fa";
import { FaTarget } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";

type MenuItemProps = {
  label: string;
  icon: React.ComponentType;
  href: string;
  currentPath: string;
};

const MenuItem = ({ label, icon: Icon, href, currentPath }: MenuItemProps) => {
  const isActive = currentPath === href;

  return (
    <Button
      variant={isActive ? "sidebarOutline" : "sidebar"}
      className="justify-start h-[52px]"
      asChild
    >
      <Link href={href}>
        <div className="flex items-center">
          {Icon ? <Icon className="mr-5" size={30} /> : <div className="mr-5 w-[30px] h-[30px] bg-gray-500"></div>}
          {label}
        </div>
      </Link>
    </Button>
  );
};

const Sidebar = ({ currentPath }: { currentPath: string }) => {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6">Lingo</h1>
      <nav>
        <MenuItem label="Learn" icon={FaHome} href="/learn" currentPath={currentPath} />
        <MenuItem label="Leaderboard" icon={FaTrophy} href="/leaderboard" currentPath={currentPath} />
        <MenuItem label="Quests" icon={FaTarget} href="/quests" currentPath={currentPath} />
        <MenuItem label="Shop" icon={FaShoppingBag} href="/shop" currentPath={currentPath} />
      </nav>
    </div>
  );
};

export default Sidebar;