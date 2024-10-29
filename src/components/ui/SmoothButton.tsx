import React from 'react'
import { cn } from "@/lib/utils"

interface SmoothButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children: React.ReactNode
}

export default function SmoothButton({ className, children, ...props }: SmoothButtonProps) {
  return (
    <button
      className={cn(
        "relative px-6 py-3 bg-orange-500 text-white font-bold uppercase tracking-wider rounded-xl shadow-[0_5px_0_#58a700] active:shadow-none active:translate-y-[5px] transition-all duration-150 ease-in-out",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Example usage
export function ButtonExample() {
  return (
    <div className="p-8 bg-gray-900 flex flex-col items-center justify-center min-h-screen">
      <SmoothButton onClick={() => console.log('Button clicked')}>
        Click Me
      </SmoothButton>
      <p className="mt-8 text-white text-center">
        So now you get nice and smooth,<br />satisfying pressable buttons.
      </p>
    </div>
  )
}