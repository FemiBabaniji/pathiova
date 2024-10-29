"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface GetStartedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

const GetStartedButton = ({ className, children, ...props }: GetStartedButtonProps) => {
  return (
    <Link href="/get-started" passHref legacyBehavior>
      <a className="inline-block">
        <button
          className={cn(
            "relative px-10 py-5 text-white font-semibold tracking-wider rounded-full", // Increased padding, font-semibold, no uppercase
            "bg-orange-500 hover:bg-orange-600", // Background hover effect
            "shadow-[0_8px_0_#e67300] active:shadow-none active:translate-y-[8px]",
            "transition-all duration-150 ease-in-out shimmer-btn overflow-hidden",
            className
          )}
          {...props}
        >
          <span className="relative z-10">{children}</span>
        </button>
      </a>
    </Link>
  );
};

export default GetStartedButton;

// Example usage
export function ButtonExample() {
  return (
    <div className="p-8 bg-gray-900 flex flex-col items-center justify-center min-h-screen">
      <GetStartedButton onClick={() => console.log("Get Started clicked")}>
        Get Started
      </GetStartedButton>
      <p className="mt-8 text-white text-center">
        Hover over the button to see the shimmer effect!
      </p>
    </div>
  );
}
