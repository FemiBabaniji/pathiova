"use client"

import React, { useEffect } from "react"
import { motion } from "framer-motion"
import { Wave } from "lucide-react"
import { Button } from "@/components/ui/button"

const fontUrl = "https://use.typekit.net/gcd4kuc.css"

function WavingHand() {
  return (
    <motion.div
      className="inline-block"
      animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
      transition={{
        duration: 2.5,
        ease: "easeInOut",
        times: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1],
        repeat: Infinity,
        repeatDelay: 1
      }}
    >
      <Wave className="w-16 h-16 text-yellow-400" />
    </motion.div>
  )
}

export default function QuizEndPage() {
  useEffect(() => {
    const link = document.createElement("link")
    link.href = fontUrl
    link.rel = "stylesheet"
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-green-50" style={{ fontFamily: 'circe, sans-serif' }}>
      <div className="w-full max-w-4xl flex flex-col items-center justify-center space-y-12 p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <WavingHand />
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          You'll thrive here
        </motion.h1>

        <motion.p
          className="text-xl text-gray-600 max-w-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Thousands of learners use our app to achieve their goals, whether it's studying, working, or migrating abroad. You'll feel confident in our community of test-takers, language enthusiasts, and motivated individuals, all driven to succeed in their journey.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button 
            onClick={() => console.log("Start your journey clicked")}
            className="px-8 py-4 text-xl bg-green-500 hover:bg-green-600 text-white rounded-full transition duration-300 ease-in-out"
          >
            Start Your Journey
          </Button>
        </motion.div>
      </div>
    </div>
  )
}