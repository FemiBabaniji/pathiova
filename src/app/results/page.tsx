"use client"

import React from "react"
import { motion } from "framer-motion"
import { Check, Play, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Head from "next/head"

const timelineSteps = [
  { icon: Check, title: "Set your learning goals", description: "You successfully created your profile and set your learning goals." },
  { icon: Play, title: "Today: Get Premium access", description: "Full access to 50+ interactive courses, and more." },
  { icon: Bell, title: "Day 5: Trial reminder", description: "We'll send you an email reminder about when your trial will end." },
  { icon: User, title: "Day 7: Trial ends", description: "You'll be charged and your subscription will start on 4 Nov. Cancel anytime before." },
]

export default function PremiumTrialPage() {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://use.typekit.net/gcd4kuc.css" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex items-center justify-center p-4 font-primary">
        <motion.div 
          className="w-full max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-12 text-gray-800">
            How your Premium free trial works
          </h1>
          
          <div className="mb-16">
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
          </div>
          
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-semibold mb-8 text-gray-800">
              $14.99/month after free trial
            </p>
            <p className="text-xl mb-8 text-gray-600">
              (billed annually)
            </p>
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-12 rounded-full text-2xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
              Start your 7-day free trial
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  )
}