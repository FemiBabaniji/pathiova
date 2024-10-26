"use client";

import React from "react";
import { cn } from "@/lib/utils";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-100"> {/* Main container without sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden"> {/* Full-width container */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-white rounded-tl-2xl shadow-md">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
