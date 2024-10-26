"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Question {
  id: number
  type: string
  statement: string
  correctAnswer: string
}

interface TrueFalseNotGivenQuizProps {
  questionData: {
    passage: string
    questions: Question[]
  }
  currentQuestionIndex: number
  onAnswerSubmit: (answer: string) => void
  onNavigate: (direction: 'next' | 'back') => void
  userAnswer: string | undefined
}

export default function TrueFalseNotGivenQuiz({
  questionData,
  currentQuestionIndex,
  onAnswerSubmit,
  onNavigate,
  userAnswer
}: TrueFalseNotGivenQuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(userAnswer)

  const currentQuestion = questionData.questions[currentQuestionIndex]
  const totalQuestions = questionData.questions.length

  useEffect(() => {
    setSelectedAnswer(userAnswer)
  }, [userAnswer])

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

  const options = ["True", "False", "Not Given"]

  return (
    <Card className="w-full max-w-7xl mx-auto bg-white bg-gray-100 bg-opacity-60 border-none" style={{ fontFamily: 'circe, sans-serif' }}> 
      <CardContent className="p-6 bg-transparent">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="w-full lg:w-[58%]">
            <div className="rounded-md overflow-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
              <div className="space-y-4">
                <p className="text-lg font-semibold mb-4  px-4 py-2 rounded-md bg-transparent ">
                  {currentQuestion.statement}
                </p>
                <div className="bg-transparent p-6 rounded-md border border-gray-200 border-none">
                  <p className="text-lg leading-relaxed -mt-5 ">{questionData.passage}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-px bg-gray-200 self-stretch hidden lg:block mr-8 "/>
          <div className="w-full lg:w-[40%] space-y-6">
            <div className="p-4">
              <p className="text-lg font-semibold -mb-5">Is the statement True, False, or Not Given?</p>
            </div>
            <RadioGroup value={selectedAnswer || ""} onValueChange={handleAnswerChange} className="space-y-3">
              {options.map((option) => (
                <div
                  key={option}
                  className={`relative flex items-center p-4 rounded-lg cursor-pointer
                    ${
                      selectedAnswer === option
                        ? "bg-green-100 border-2 border-green-500"
                        : "bg-transparent border border-gray-300 hover:border-green-500 hover:bg-green-50"
                    }`}
                >
                  <RadioGroupItem value={option} id={option} className="absolute left-4 top-1/2 -translate-y-1/2" />
                  <Label
                    htmlFor={option}
                    className="pl-8 cursor-pointer flex-grow text-base font-medium text-lg -mb-1 -mt-1"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="flex justify-between mt-6">
              <Button
                onClick={handleBack}
                className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                ← Back
              </Button>
              <Button
                onClick={handleNext}
                className="px-6 py-2 rounded-full bg-transparent border ${color} border-gray-300 hover:bg-transparent hover:border-gray-500 text-gray-900 transition duration-300 ease-in-out">
                {currentQuestionIndex === totalQuestions - 1 ? "Next" : "Next →"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}