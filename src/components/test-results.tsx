"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, RefreshCw, BookOpen } from "lucide-react"
import Link from "next/link"
import { useScore } from "@/app/context/ScoreContext"
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import QuizNavigation from '@/components/QuizNavigation'
import AchievementStar from '@/components/AchievementStar'

interface Feedback {
  score: number
  isCorrect: boolean
}

interface TestResultsProps {
  feedbacks: Feedback[]
  totalQuestions: number
  onReset: () => void
  sendAverageScore: (score: number) => void
  testId: string
}

export default function TestResults({
  feedbacks = [],
  totalQuestions,
  onReset,
  sendAverageScore,
  testId,
}: TestResultsProps) {
  const [score, setScore] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [showAchievementStar, setShowAchievementStar] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const { updateScore, updateStars } = useScore()
  const scoreUpdatedRef = useRef(false)
  const starsUpdatedRef = useRef(false)
  const router = useRouter()

  const averageScore = useMemo(() => {
    if (!feedbacks || feedbacks.length === 0) return 0
    const totalScore = feedbacks.reduce((sum, feedback) => sum + (feedback?.score || 0), 0)
    return totalScore / feedbacks.length
  }, [feedbacks])

  const getBandScore = (score: number): number => {
    if (score >= 9) return 9
    if (score >= 8) return 8
    if (score >= 7) return 7
    if (score >= 6) return 6
    if (score >= 5) return 5
    if (score >= 4) return 4
    if (score >= 3) return 3
    if (score >= 2) return 2
    return 1
  }

  const bandScore = useMemo(() => getBandScore(averageScore), [averageScore])

  useEffect(() => {
    if (averageScore > 0 && testId && !scoreUpdatedRef.current) {
      updateScore(testId, averageScore)
      sendAverageScore(averageScore)
      scoreUpdatedRef.current = true
    }
  }, [averageScore, testId, updateScore, sendAverageScore])

  useEffect(() => {
    const timer = setTimeout(() => {
      setScore(averageScore)
      if (bandScore > 7) {
        setShowAchievementStar(true)
        setTimeout(() => {
          setShowAchievementStar(false)
          setShowResults(true)
        }, 4000) // Show AchievementStar for 4 seconds
      } else {
        setShowResults(true)
      }
      setIsVisible(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [averageScore, bandScore])

  useEffect(() => {
    if (score > 0 && bandScore > 7 && !starsUpdatedRef.current) {
      updateStars(prevStars => prevStars + 1)
      starsUpdatedRef.current = true
    }
  }, [score, bandScore, updateStars])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <QuizNavigation
        questionIndex={totalQuestions - 1}
        totalQuestions={totalQuestions}
        onBack={() => {}}
        onNext={() => {}}
        onFinish={() => {}}
      />
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence>
            {showAchievementStar && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.5 }}
                  transition={{ duration: 0.5 }}
                >
                  <AchievementStar size="large" bandScore={bandScore} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {showResults && (
            <Card className="mb-8 mt-60">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Your IELTS Writing Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: isVisible ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 text-purple-500 rounded-full"
                  >
                    <span className="text-4xl font-bold">{score.toFixed(1)}</span>
                  </motion.div>
                  <p className="mt-2 text-xl font-semibold text-gray-700">Band Score: {bandScore}</p>
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
                      localStorage.removeItem(`quiz-${testId}-progress`)
                      router.push('/learning/writing-task-masterclass')
                    }}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Back to Writing Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}