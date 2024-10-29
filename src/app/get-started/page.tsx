"use client"

import React, { useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import QuizNavigationGetStarted from "@/components/QuizNavigationGetStarted"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import AnimatedCircle from "@/components/animated-circle-intro"
import FinalPage from "@/components/final-page"

const fontUrl = "https://use.typekit.net/gcd4kuc.css";

const funnelData = {
  passage: "Ready to achieve your goals? Whether you're looking to study, work, or migrate abroad, our IELTS/CELPIP preparation app will help you succeed. Our gamified quizzes, personalized feedback, and adaptive learning paths are designed to make your study experience efficient, fun, and tailored just for you.",
  questions: [
    {
      id: 1,
      type: "multiple-choice",
      sentence: "Why are you preparing for IELTS or CELPIP?",
      options: [
        "To study abroad",
        "For work or career advancement",
        "For permanent residency or citizenship",
        "Other"
      ],
      correctAnswer: null // User input will vary
    },
    {
      id: 2,
      type: "multiple-choice",
      sentence: "Which country are you targeting with your IELTS or CELPIP score?",
      options: [
        "Canada",
        "UK",
        "Australia",
        "United States",
        "Other"
      ],
      correctAnswer: null // User input will vary
    },
    {
      id: 3,
      type: "multiple-choice",
      sentence: "What has been your biggest obstacle in preparing so far?",
      options: [
        "I struggle with understanding the test structure",
        "I need better practice for listening, reading, or writing",
        "I find it hard to stay motivated",
        "I haven't received enough feedback on my progress",
        "I'm not sure where to start"
      ],
      correctAnswer: null
    },
    {
      id: 4,
      type: "multiple-choice",
      sentence: "What would help you most in your preparation?",
      options: [
        "Personalized feedback on my progress",
        "Full-length practice tests that simulate the real exam",
        "Gamified quizzes to keep me motivated",
        "A detailed study plan based on my goals"
      ],
      correctAnswer: null
    }
  ]
}

export default function GetStarted() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(new Array(funnelData.questions.length).fill(null))
  const [quizFinished, setQuizFinished] = useState(false)
  const [showAnimatedCircle, setShowAnimatedCircle] = useState(true)
  const router = useRouter()

  const currentQuestion = funnelData.questions[currentQuestionIndex]
  const totalQuestions = funnelData.questions.length

  useEffect(() => {
    const link = document.createElement("link")
    link.href = fontUrl
    link.rel = "stylesheet"
    document.head.appendChild(link)

    const timer = setTimeout(() => {
      setShowAnimatedCircle(false)
    }, 8000)

    return () => {
      document.head.removeChild(link)
      clearTimeout(timer)
    }
  }, [])

  const handleAnswerChange = (value: string) => {
    const newSelectedAnswers = [...selectedAnswers]
    newSelectedAnswers[currentQuestionIndex] = value
    setSelectedAnswers(newSelectedAnswers)
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      handleFinish()
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else {
      router.push('/')
    }
  }

  const handleFinish = () => {
    console.log("Quiz finished. Selected answers:", selectedAnswers)
    setQuizFinished(true)
  }

  const handleStartJourney = () => {
    console.log("Start your journey clicked")
    // Add your logic here for what happens when the user starts their journey
  }

  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ fontFamily: 'circe, sans-serif' }}>
      {showAnimatedCircle ? (
        <AnimatedCircle />
      ) : (
        <>
          {quizFinished ? (
            <FinalPage onStartJourney={handleStartJourney} />
          ) : (
            <>
              <QuizNavigationGetStarted
                questionIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                onBack={handleBack}
                onNext={handleNext}
                onFinish={handleFinish}
              />

              <main className="flex-1 container mx-auto px-4 py-8 mt-48">
                <Card className="w-full max-w-2xl mx-auto bg-white-100 bg-opacity-60 border-none">
                  <CardContent className="p-6 bg-transparent">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-full space-y-6">
                        <h2 className="text-2xl font-semibold mb-6 text-center">{currentQuestion.sentence}</h2>
                        <RadioGroup
                          value={selectedAnswers[currentQuestionIndex] || ""}
                          onValueChange={handleAnswerChange}
                          className="space-y-4"
                        >
                          {currentQuestion.options.map((option) => (
                            <div
                              key={option}
                              className={`relative flex items-center p-5 rounded-lg
                                ${
                                  selectedAnswers[currentQuestionIndex] === option
                                    ? "bg-orange-100 border-2 border-orange-500"
                                    : "bg-transparent border border-gray-300 hover:border-orange-500 hover:bg-orange-50"
                                }`}
                            >
                              <RadioGroupItem value={option} id={option} className="absolute left-4 top-1/2 -translate-y-1/2" />
                              <Label
                                htmlFor={option}
                                className="pl-8 cursor-pointer flex-grow text-base font-medium text-lg"
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <div className="flex justify-between mt-6">
                          <Button
                            onClick={handleBack}
                            className="px-6 py-2 text-xl rounded-full bg-transparent border border-gray-300 hover:bg-transparent hover:border-gray-500 text-gray-900 transition duration-300 ease-in-out"
                          >
                            ← Back
                          </Button>
                          <Button
                            onClick={handleNext}
                            className="px-6 py-2 text-xl rounded-full bg-transparent border border-gray-300 hover:bg-transparent hover:border-green-500 hover:bg-green-50 text-gray-900 transition duration-300 ease-in-out"
                          >
                            {currentQuestionIndex === totalQuestions - 1 ? "Next" : "Next →"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </main>
            </>
          )}
        </>
      )}
    </div>
  )
}