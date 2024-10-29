"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { HiQuestionMarkCircle } from "react-icons/hi";
import AnimatedCircle from "@/components/animated-circle";
import { signIn } from "next-auth/react"; // Import signIn from next-auth/react

interface FinalPageProps {
  onStartJourney: () => void;
}

export default function FinalPage({ onStartJourney }: FinalPageProps) {
  const [isCirclePeeking, setIsCirclePeeking] = useState(false);

  // Function to handle hover
  const handleMouseEnter = () => {
    setIsCirclePeeking(false);
  };

  const handleMouseLeave = () => {
    setIsCirclePeeking(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-8">
      <div className="w-full max-w-6xl flex flex-row items-start justify-between space-x-12">
        <motion.div
          className="flex-1 text-left"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            You'll thrive here
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Thousands of learners use our app to achieve their goals, whether
            it's studying, working, or migrating abroad. You'll feel confident
            in our community of test-takers, language enthusiasts, and motivated
            individuals, all driven to succeed in their journey.
          </p>
          <Button
            onClick={onStartJourney}
            className="px-8 py-4 text-xl bg-orange-500 hover:bg-orange-600 text-white rounded-full transition duration-300 ease-in-out"
          >
            Start Your Journey
          </Button>
        </motion.div>
        <motion.div
          className="flex-1 relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute top-0 right-0 w-full h-full">
              <motion.div
                className="absolute top-0 right-0"
                animate={{
                  x: isCirclePeeking ? 0 : "50%",
                  y: isCirclePeeking ? 0 : "-50%",
                  rotate: isCirclePeeking ? 45 : 0,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <AnimatedCircle size="medium" />
              </motion.div>
            </div>
            <Card
              className="bg-white shadow-xl rounded-lg overflow-hidden relative z-10"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-center mb-6">
                  Create a free account to discover your personalized learning
                  path
                </h2>
                <div className="space-y-4 mb-6">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 h-12 text-base text-lg font-semibold text-gray-700"
                    onClick={() => signIn("google", { callbackUrl: "/premium-trial-page.tsx" })} // Trigger Google Sign-In
                  >
                    <FaGoogle className="w-5 h-5" />
                    <span>Continue with Google</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 h-12 text-base text-lg font-semibold text-gray-700"
                  >
                    <FaFacebook className="w-5 h-5 text-blue-600" />
                    <span>Continue with Facebook</span>
                  </Button>
                </div>
                <div className="relative mb-6">
                  <hr className="border-gray-300" />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-500 text-sm">
                    OR
                  </span>
                </div>
                <div className="mb-6 relative">
                  <Input
                    type="email"
                    placeholder="Email"
                    className="w-full h-12 pl-4 pr-10 rounded-lg border border-gray-300"
                  />
                  <HiQuestionMarkCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <Button className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-full text-lg font-semibold">
                  Sign up
                </Button>
                <p className="mt-4  text-center text-gray-500">
                  By clicking Sign up, I agree to Brilliant's{" "}
                  <a href="#" className="underline">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline">
                    Privacy Policy
                  </a>
                </p>
                <p className="mt-6 text-sm text-center">
                  Existing user?{" "}
                  <a href="#" className="text-blue-600 underline">
                    Sign in
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
