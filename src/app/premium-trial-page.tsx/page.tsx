"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Cpu, Compass, Smartphone } from "lucide-react"
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"

const fontUrl = "https://use.typekit.net/gcd4kuc.css";

const timelineSteps = [
  { icon: BookOpen, title: "Key Resources, No Extra Cost", description: "All the study materials you need, ready to go." },
  { icon: Cpu, title: "Practice Questions with AI-Powered Support", description: "Practice speaking and listening with AI, like having a tutor at a fraction of the cost." },
  { icon: Compass, title: "Guided Support for a Clear Path", description: "Low-commitment guidance for exams, immigration, and beyond." },
  { icon: Smartphone, title: "Practice Anytime, Anywhere", description: "Flexible practice that fits your schedule." },
]

const GetStartedButton = ({ className, children, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) => {
  return (
    <button
      className={cn(
        "relative px-10 py-5 text-white font-semibold tracking-wider rounded-full",
        "bg-orange-500 hover:bg-orange-600",
        "shadow-[0_8px_0_#e67300] active:shadow-none active:translate-y-[8px]",
        "transition-all duration-150 ease-in-out shimmer-btn overflow-hidden",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  )
}

export default function PremiumTrialPage() {
  const [isExiting, setIsExiting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const link = document.createElement("link")
    link.href = fontUrl
    link.rel = "stylesheet"
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  const handleStartPrototype = () => {
    setIsExiting(true)
    // Wait for the animation to complete before navigating
    setTimeout(() => {
      router.push('/dashboard')
    }, 500) // This should match the duration of the exit animation
  }

  const pageVariants = {
    initial: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "-100%" },
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-4 overflow-hidden"
      style={{ fontFamily: 'circe, sans-serif' }}
      initial="initial"
      animate={isExiting ? "exit" : "initial"}
      variants={pageVariants}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="w-full max-w-6xl mx-auto">
        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-12 text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          So, Here's How It All Works!
        </motion.h1>
        
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {timelineSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${index === 1 ? 'bg-yellow-400' : 'bg-gray-200'}`}>
                  <step.icon className={`w-12 h-12 ${index === 1 ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-lg text-gray-600 max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-lg md:text-lg font-semibold mb-8 text-gray-800">
            $14.99 on release but you test for free
          </p>
          <p className="text-sm mb-8 text-gray-600">
          
          </p>
          <GetStartedButton className="text-2xl" onClick={handleStartPrototype}>
            Start the prototype
          </GetStartedButton>
        </motion.div>
      </div>
    </motion.div>
  )
}