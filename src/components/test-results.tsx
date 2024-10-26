"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, RefreshCw, PenLine } from "lucide-react";
import Link from "next/link";
import { useScore } from "@/app/context/ScoreContext";

export default function TestResults({
  feedbacks = [],
  totalQuestions,
  onReset,
  sendAverageScore,
  testId,
}) {
  const [animatedScore, setAnimatedScore] = useState(0); // For animating the score
  const [isVisible, setIsVisible] = useState(false); // For showing the score
  const { updateScore } = useScore(); // Context function to update score
  const scoreUpdatedRef = useRef(false); // Ref to track if score has already been updated

  console.log("TestResults component rendered. TestId:", testId);

  // Calculate the average score
  const averageScore = useMemo(() => {
    if (!feedbacks || feedbacks.length === 0) return 0;
    const totalScore = feedbacks.reduce(
      (sum, feedback) => sum + (feedback?.score || 0),
      0
    );
    return totalScore / feedbacks.length;
  }, [feedbacks]);

  // Trigger the score update only once when averageScore or testId changes
  useEffect(() => {
    if (averageScore > 0 && testId && !scoreUpdatedRef.current) {
      console.log(
        "Updating score for testId:",
        testId,
        "with averageScore:",
        averageScore
      );
      updateScore(testId, averageScore); // Update the score in context
      sendAverageScore(averageScore); // Send the average score
      scoreUpdatedRef.current = true; // Set the flag to true to prevent future updates
    }
  }, [averageScore, testId, updateScore, sendAverageScore]);

  // Animate the score display
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(averageScore);
      setIsVisible(true); // Make score visible
    }, 500);
    return () => clearTimeout(timer); // Cleanup
  }, [averageScore]);

  // Helper functions for displaying feedback based on score
  const getScoreInterpretation = (score) => {
    if (score >= 8) return "Expert";
    if (score >= 7) return "Very Good";
    if (score >= 6) return "Competent";
    if (score >= 5) return "Modest";
    if (score >= 4) return "Limited";
    return "Developing";
  };

  const getFeedbackMessage = (score) => {
    if (score >= 8)
      return "Excellent work! Your writing skills are at a very advanced level. Keep refining your expertise.";
    if (score >= 7)
      return "Great job! You have good command of English writing. Focus on nuanced improvements to reach the highest level.";
    if (score >= 6)
      return "You're doing well! Your writing is effective. Work on more complex structures and vocabulary to improve further.";
    if (score >= 5)
      return "You're on the right track. Focus on improving your grammar accuracy and expanding your vocabulary.";
    if (score >= 4)
      return "You're making progress. Concentrate on basic grammar rules and sentence structures to build a stronger foundation.";
    return "Keep practicing! Focus on basic English writing skills and grammar. Regular practice will help you improve.";
  };

  return (
    <div className="flex flex-col justify-start items-center min-h-screen bg-white pt-24">
      <div className="w-full max-w-md px-4">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <motion.div
                className="flex justify-center mb-8"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <div className="bg-purple-100 p-3 rounded-full">
                  <PenLine className="w-8 h-8 text-purple-600" />
                </div>
              </motion.div>
              <motion.h2
                className="text-3xl font-bold mb-4 text-center text-gray-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Your IELTS Writing Score
              </motion.h2>
              <div className="relative h-16 bg-gray-200 rounded-full overflow-hidden mb-8 shadow-inner">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${animatedScore * 11.11}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{
                    boxShadow:
                      "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
                    transform: "translateZ(0)",
                  }}
                />
                <motion.div
                  className="absolute top-0 left-0 h-full w-full flex items-center justify-center text-white font-bold text-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                >
                  {animatedScore.toFixed(1)}
                </motion.div>
              </div>
              <motion.p
                className="text-center mb-4 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                Questions Answered:{" "}
                <span className="font-semibold">
                  {feedbacks?.length}/{totalQuestions}
                </span>
              </motion.p>
              <motion.p
                className="text-center font-bold mb-4 text-xl text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                Band: {getScoreInterpretation(averageScore)}
              </motion.p>
              <motion.p
                className="text-sm text-gray-600 mb-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                {getFeedbackMessage(averageScore)}
              </motion.p>
              <motion.div
                className="flex flex-col gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.5 }}
              >
                <Button
                  variant="outline"
                  className="w-full hover:bg-gray-100 rounded-full text-sm py-1.5 px-3 h-auto flex items-center justify-center"
                  onClick={() => {
                    console.log("Try Another Test button clicked");
                    onReset();
                    scoreUpdatedRef.current = false; // Reset the flag when starting a new test
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Try Another Test
                </Button>
                <Button
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white rounded-full text-sm py-1.5 px-3 h-auto flex items-center justify-center"
                  asChild
                >
                  <Link href="/learning/writing-task-masterclass">
                    My Dashboard <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
