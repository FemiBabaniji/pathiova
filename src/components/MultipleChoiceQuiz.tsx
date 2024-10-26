"use client"

import React, { useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const fontUrl = "https://use.typekit.net/gcd4kuc.css";

interface Question {
  id: number
  type: string
  sentence: string
  options: string[]
  correctAnswer: string
}

interface MultipleChoiceQuizProps {
  questionData: {
    passage: string
    questions: Question[]
  }
  currentQuestionIndex: number
  onAnswerSubmit: (answer: string | null) => void
  onNavigate: (direction: 'next' | 'back') => void
  userAnswer: string | undefined
}

export default function MultipleChoiceQuiz({
  questionData,
  currentQuestionIndex,
  onAnswerSubmit,
  onNavigate,
  userAnswer
}: MultipleChoiceQuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(userAnswer || null)

  const currentQuestion = questionData.questions[currentQuestionIndex]
  const totalQuestions = questionData.questions.length

  // Add font import to document head
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
    setSelectedAnswer(userAnswer || null)
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
    <Card className="w-full max-w-7xl mx-auto bg-white bg-gray-100 bg-opacity-60 border-none" style={{ fontFamily: 'circe, sans-serif' }}> {/* Apply the font here */}
      <CardContent className="p-6 bg-transparent">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="w-full lg:w-[58%]">
            <div className="rounded-md overflow-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
              <div className="space-y-4">
                <p className="text-2xl font-semibold mb-2 px-4 py-2 rounded-md bg-transparent">
                  {currentQuestion.sentence}
                </p>
                <div className="p-6 rounded-md bg-transparent">
                  <p className="text-lg leading-relaxed -mt-5 ">{questionData.passage}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-px bg-gray-200 self-stretch hidden lg:block mr-8 " />
          <div className="w-full lg:w-[40%] space-y-6 mt-6 lg:mt-0">
            <div className="p-4">
              <p className="text-lg font-semibold -mb-5">Choose the correct answer:</p>
            </div>
            <RadioGroup value={selectedAnswer || ""} onValueChange={handleAnswerChange} className="space-y-3 ">
              {currentQuestion.options.map((option) => (
                <div
                  key={option}
                  className={`relative flex items-center p-4 rounded-lg
                    ${
                      selectedAnswer === option
                        ? "bg-green-100 border-2 border-green-500"
                        : "bg-transparent border border-gray-300 hover:border-green-500 hover:bg-green-50"
                    }`}
                >
                  <RadioGroupItem value={option} id={option} className="absolute left-4 top-1/2 -translate-y-1/2" />
                  <Label
                    htmlFor={option}
                    className="pl-8 cursor-pointer flex-grow text-base font-medium text-lg -mb-1 -mt-1 "
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
