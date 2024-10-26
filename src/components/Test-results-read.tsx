"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, RefreshCw, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useScore } from '@/app/context/ScoreContext';
import AchievementStar from '@/components/AchievementStar';
import QuizNavigation from '@/components/QuizNavigation';

interface Feedback {
  answer: string | { [key: string]: string };
  correctAnswer: string;
  correctPairs?: { [key: string]: string };
  isCorrect: boolean;
  feedback: string;
}

interface TestResultsReadProps {
  feedbacks: Feedback[];
  totalQuestions: number;
  onReset: () => void;
  sendAverageScore: (score: number) => void;
  testId: string;
}

// Font URL from Adobe Typekit
const fontUrl = "https://use.typekit.net/gcd4kuc.css";

export default function TestResultsRead({
  feedbacks,
  totalQuestions,
  onReset,
  sendAverageScore,
  testId,
}: TestResultsReadProps) {
  const [score, setScore] = useState(0);
  const { updateScore, updateStars } = useScore();
  const [hasUpdatedScore, setHasUpdatedScore] = useState(false);
  const [hasUpdatedStars, setHasUpdatedStars] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showAchievementStar, setShowAchievementStar] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const getBandScore = useCallback((score: number): number => {
    if (score >= 9) return 9;
    if (score >= 8) return 8;
    if (score >= 7) return 7;
    if (score >= 6) return 6;
    if (score >= 5) return 5;
    if (score >= 4) return 4;
    if (score >= 3) return 3;
    if (score >= 2) return 2;
    return 1;
  }, []);

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

  useEffect(() => {
    const correctAnswers = feedbacks.filter(f => f.isCorrect).length;
    const calculatedScore = Math.round((correctAnswers / totalQuestions) * 9);

    setTimeout(() => {
      setScore(calculatedScore);
      setIsVisible(true);
      if (getBandScore(calculatedScore) > 7) {
        setShowAchievementStar(true);
        setTimeout(() => {
          setShowAchievementStar(false);
          setShowResults(true);
        }, 4000); // Show AchievementStar for 4 seconds
      } else {
        setShowResults(true);
      }
    }, 500);

    sendAverageScore(calculatedScore);
  }, [feedbacks, totalQuestions, sendAverageScore, getBandScore]);

  useEffect(() => {
    if (score > 0 && !hasUpdatedScore) {
      updateScore(testId, score);
      setHasUpdatedScore(true);
    }
  }, [score, testId, updateScore, hasUpdatedScore]);

  useEffect(() => {
    if (score > 0 && getBandScore(score) > 7 && !hasUpdatedStars) {
      updateStars(prevStars => prevStars + 1);
      setHasUpdatedStars(true);
    }
  }, [score, getBandScore, updateStars, hasUpdatedStars]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100" style={{ fontFamily: 'circe, sans-serif' }}>
      <QuizNavigation
        questionIndex={totalQuestions - 1}
        totalQuestions={totalQuestions}
        onBack={() => {}}
        onNext={() => {}}
        onFinish={() => {}}
      />
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {showAchievementStar && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <AchievementStar size="large" score={getBandScore(score)} />
            </div>
          )}

          {showResults && (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center">Your IELTS Reading Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: isVisible ? 1 : 0 }}
                      transition={{ duration: 0.5 }}
                      className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-500 rounded-full"
                    >
                      <span className="text-4xl font-bold">{score}</span>
                    </motion.div>
                    <p className="mt-2 text-xl font-semibold text-gray-700">Band Score: {getBandScore(score)}</p>
                    <Progress value={(score / 9) * 100} className="mt-4" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Questions</p>
                      <p className="text-xl font-semibold text-gray-700">{totalQuestions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Correct Answers</p>
                      <p className="text-xl font-semibold">{feedbacks.filter(f => f.isCorrect).length}</p>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Button onClick={onReset} className="px-6 py-2 rounded-full bg-transparent border border-gray-300 hover:bg-transparent hover:border-gray-500 text-gray-900 transition duration-300 ease-in-out">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry Test
                    </Button>
                    <Button
                      variant="outline"
                      className="px-6 py-2 rounded-full bg-transparent border border-gray-300 hover:bg-transparent hover:border-gray-500 text-gray-900 transition duration-300 ease-in-out"
                      onClick={() => {
                        localStorage.removeItem(`quiz-${testId}-progress`);
                        router.push('/learning/reading-mastery');
                      }}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Back to Reading Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Question Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] rounded-md border p-4">
                    {feedbacks.map((feedback, index) => (
                      <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                        <h3 className="font-semibold mb-2">Question {index + 1}</h3>
                        <p className={`mb-1 ${feedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                          {feedback.isCorrect ? 'Correct' : 'Incorrect'}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1">
                          Your answer: {typeof feedback.answer === 'string' ? feedback.answer : JSON.stringify(feedback.answer)}
                        </p>
                        <p className="text-sm text-muted-foreground mb-1">Correct answer: {feedback.correctAnswer}</p>
                        <p className="text-sm">{feedback.feedback}</p>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}