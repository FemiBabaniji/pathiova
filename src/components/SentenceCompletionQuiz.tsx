"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Question {
  id: number
  type: string
  sentence: string
  options: string[]
  correctAnswer: string
}

interface SentenceCompletionQuizProps {
  questionData: {
    passage: string
    questions: Question[]
  }
  currentQuestionIndex: number
  onAnswerSubmit: (answer: string) => void
  onNavigate: (direction: 'next' | 'back') => void
  userAnswer: string | undefined
}

export default function SentenceCompletionQuiz({
  questionData,
  currentQuestionIndex,
  onAnswerSubmit,
  onNavigate,
  userAnswer
}: SentenceCompletionQuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>(userAnswer || "")

  const currentQuestion = questionData.questions[currentQuestionIndex]
  const totalQuestions = questionData.questions.length

  useEffect(() => {
    setSelectedAnswer(userAnswer || "")
  }, [userAnswer, currentQuestionIndex])

  const handleAnswerChange = (value: string) => {
    setSelectedAnswer(value)
    onAnswerSubmit(value)
  }

  const handleNext = () => {
    onNavigate('next')
  }

  const handleBack = () => {
    onNavigate('back')
  }

  return (
    <Card className="w-full max-w-7xl mx-auto bg-white bg-gray-100 bg-opacity-60 border-none" style={{ fontFamily: 'circe, sans-serif' }}>
      <CardContent className="p-6 bg-transparent" >
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="w-full lg:w-[58%]">
            <div className="rounded-md overflow-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
              <div className="space-y-4">
                <p className="text-2xl font-semibold mb-2 px-4 py-2 rounded-md bg-transparent">
                  Complete the sentence
                </p>
                <div className="p-6 rounded-md bg-transparent">
                  <p className="text-lg   leading-relaxed -mt-5 ">{questionData.passage}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-px bg-gray-200 self-stretch hidden lg:block mr-8 "/>
          <div className="w-full lg:w-[40%] space-y-6">
            <div className="p-4">
              <p className="text-lg font-semibold -mb-5">Select the correct completion for the sentence:</p>
            </div>
            <div className="space-y-4">
              <p className="font-medium">{currentQuestion.sentence}</p>
              <Select
                value={selectedAnswer}
                onValueChange={handleAnswerChange}
              >
                <SelectTrigger className="w-full hover:border-green-500 hover:bg-green-50">
                  <SelectValue placeholder="Select the correct completion" />
                </SelectTrigger>
                <SelectContent>
                  {currentQuestion.options.map((option, index) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                ← Back
              </Button>
              <Button
                onClick={handleNext}
                className="px-6 py-2 rounded-full bg-transparent border ${color} border-gray-300 hover:bg-transparent hover:border-gray-500 text-gray-900 transition duration-300 ease-in-out"
              >
                {currentQuestionIndex === totalQuestions - 1 ? "Next" : "Next →"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}