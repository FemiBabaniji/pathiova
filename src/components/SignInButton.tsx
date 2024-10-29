import React from "react";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils"; // Ensure utils are correctly imported

interface SignInButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

const SignInButton = ({ className, children, ...props }: SignInButtonProps) => {
  return (
    <button
      className={cn(
        "relative px-6 py-3 font-bold uppercase tracking-wider rounded-full",
        "bg-gray-500 hover:bg-gray-600 text-white", // Grey background and hover states
        "shadow-[0_8px_0_#4B5563] active:shadow-none active:translate-y-[8px]", // Grey shadow and active effect
        "transition-all duration-150 ease-in-out shimmer-btn-light-grey overflow-hidden", // Grey shimmer effect
        className
      )}
      {...props}
      onClick={() => {
        signIn("google", { callbackUrl: "/dashboard" }).catch(console.error); // Sign in with Google
      }}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default SignInButton;
