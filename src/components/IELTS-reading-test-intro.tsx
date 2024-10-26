"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Clock, BookOpen } from "lucide-react";
import QuizNavigation from "@/components/QuizNavigation";

interface QuizIntroProps {
  section: "Listening" | "Reading" | "Writing" | "Speaking";
  onContinue: () => void;
  questionIndex: number;
  totalQuestions: number;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
}

// Font URL from Adobe Typekit
const fontUrl = "https://use.typekit.net/gcd4kuc.css";

const sectionInfo = {
  Listening: {
    color: "border-gray-300 hover:border-green-500",
    description: "You will hear a series of recordings and answer questions based on what you hear. The test is designed to assess how well you understand main ideas, specific factual information, and the opinions and attitudes of speakers.",
    duration: "30 minutes",
    questions: "40 questions",
  },
  Reading: {
    color: "border-gray-300 hover:border-green-500",
    description: "You will read three different passages and answer questions to test your comprehension. This section assesses your ability to understand main ideas, details, inferences, and the author's attitude.",
    duration: "Unlimited",
    questions: "15 questions",
  },
  Writing: {
    color: "border-gray-300 hover:border-green-500",
    description: "You will complete two writing tasks. Task 1 involves describing visual information, while Task 2 requires you to write an essay in response to a point of view, argument, or problem.",
    duration: "60 minutes",
    questions: "2 tasks",
  },
  Speaking: {
    color: "border-gray-300 hover:border-green-500",
    description: "You will have a face-to-face interview with an examiner. The test is in three parts and assesses your ability to communicate opinions and information on everyday topics and common experiences.",
    duration: "11-14 minutes",
    questions: "3 parts",
  },
};

function HoveringBookIcon({ size = "large" }: { size?: "small" | "large" }) {
  const iconSize = size === "small" ? "w-8 h-8" : "w-32 h-32";

  const containerVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="relative w-52 h-52 rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-green-500"
      variants={containerVariants}
      animate="animate"
    >
      <div className="relative z-10 w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
        <BookOpen className={`${iconSize} text-white`} />
      </div>
    </motion.div>
  );
}

export default function Component({
  section = "Reading",
  onContinue = () => console.log("Continue clicked"),
  questionIndex,
  totalQuestions,
  onBack,
  onNext,
  onFinish
}: QuizIntroProps) {
  const { color, description, duration, questions } = sectionInfo[section];

  // Import font
  useEffect(() => {
    const link = document.createElement("link");
    link.href = fontUrl;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50" style={{ fontFamily: 'circe, sans-serif' }}>
      <QuizNavigation
        questionIndex={questionIndex}
        totalQuestions={totalQuestions}
        onBack={onBack}
        onNext={onNext}
        onFinish={onFinish}
      />

      <div className="w-full max-w-4xl flex flex-col items-center justify-center space-y-12 p-8">
        <HoveringBookIcon />

        <motion.div 
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold text-gray-800">IELTS {section} Test</h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            {description}
          </p>
          <div className="flex justify-center space-x-8 text-lg text-gray-700">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span><strong>Duration:</strong> {duration}</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              <span><strong>Format:</strong> {questions}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button 
            onClick={onContinue} 
            className={`px-8 py-4 text-xl bg-transparent hover:bg-transparent border-4 ${color} text-gray-700 hover:border-gray-500 rounded-full transition duration-300 ease-in-out`}
          >
            Start {section} Test
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
