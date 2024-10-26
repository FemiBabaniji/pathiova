"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Question {
  id: number
  type: string
  question: string
  correctAnswer: string
}

interface ShortAnswerQuizProps {
  questionData: {
    passage: string
    questions: Question[]
  }
  currentQuestionIndex: number
  onAnswerSubmit: (answer: string) => void
  onNavigate: (direction: 'next' | 'back') => void
  userAnswer: string | undefined
}

export default function ShortAnswerQuiz({
  questionData,
  currentQuestionIndex,
  onAnswerSubmit,
  onNavigate,
  userAnswer
}: ShortAnswerQuizProps) {
  const [answer, setAnswer] = useState<string>(userAnswer || "")

  const currentQuestion = questionData.questions[currentQuestionIndex]
  const totalQuestions = questionData.questions.length

  useEffect(() => {
    setAnswer(userAnswer || "")
  }, [userAnswer, currentQuestionIndex])

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswer = e.target.value
    setAnswer(newAnswer)
    onAnswerSubmit(newAnswer)
  }

  const handleNext = () => {
    onNavigate('next')
  }

  const handleBack = () => {
    onNavigate('back')
  }

  return (
    <Card className="w-full max-w-7xl mx-auto bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="w-full lg:w-[58%]">
            <div className="rounded-md overflow-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
              <div className="space-y-4">
                <p className="text-lg font-semibold mb-4 bg-white px-4 py-2 rounded-md">
                  Short Answer Question
                </p>
                <div className="bg-white p-6 rounded-md border border-gray-200">
                  <p className="text-sm leading-relaxed">{questionData.passage}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-px bg-gray-200 self-stretch" />
          <div className="w-full lg:w-[40%] space-y-6">
            <div className="p-4">
              <p className="text-sm font-semibold">Answer the following question:</p>
            </div>
            <div className="space-y-4">
              <p className="font-medium">{currentQuestion.question}</p>
              <Input
                type="text"
                placeholder="Type your answer here"
                value={answer}
                onChange={handleAnswerChange}
                className="w-full mt-4 hover:border-green-500 focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                ← Back
              </Button>
              <Button
                onClick={handleNext}
                className="px-6 py-2 rounded-full bg-transparent border ${color} border-gray-300 hover:bg-transparent hover:border-gray-500 text-gray-900 transition duration-300 ease-in-out"
              >
                {currentQuestionIndex === totalQuestions - 1 ? "Finish" : "Next →"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}