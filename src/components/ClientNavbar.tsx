"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Navbar2 from "@/components/Navbar2";
import { useEffect, useState } from "react";

const ClientNavbar = () => {
  const pathname = usePathname();
  const [isDashboard, setIsDashboard] = useState(false);

  useEffect(() => {
    // Check if pathname is available and starts with "/dashboard"
    setIsDashboard(pathname?.startsWith("/dashboard") ?? false);
  }, [pathname]);

  // Render placeholder or loading state initially
  if (typeof pathname === 'undefined') {
    return <div>Loading...</div>; // Or any other placeholder
  }

  return isDashboard ? <Navbar2 /> : <Navbar />;
};

export default ClientNavbar;