"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MatchingPair {
  id: string
  text: string
}

interface Question {
  id: number
  type: string
  pairs: MatchingPair[]
  matchingOptions: string[]
  correctPairs: { [key: string]: string }
}

interface MatchingPairsQuizProps {
  questionData: {
    passage: string
    questions: Question[]
  }
  currentQuestionIndex: number
  onAnswerSubmit: (answer: { [key: string]: string }) => void
  onNavigate: (direction: 'next' | 'back') => void
  userAnswer: { [key: string]: string } | undefined
}

export default function  MatchingPairsQuiz({
  questionData,
  currentQuestionIndex,
  onAnswerSubmit,
  onNavigate,
  userAnswer
}: MatchingPairsQuizProps) {
  const [selectedPairs, setSelectedPairs] = useState<{ [key: string]: string }>(userAnswer || {})

  console.log("MatchingPairsQuiz: Component rendered")
  console.log("questionData:", questionData)
  console.log("currentQuestionIndex:", currentQuestionIndex)
  console.log("userAnswer:", userAnswer)

  const currentQuestion = questionData?.questions?.[currentQuestionIndex]
  console.log("currentQuestion:", currentQuestion)

  const totalQuestions = questionData?.questions?.length || 0
  console.log("totalQuestions:", totalQuestions)

  useEffect(() => {
    console.log("MatchingPairsQuiz: useEffect triggered")
    console.log("Setting selectedPairs to:", userAnswer || {})
    setSelectedPairs(userAnswer || {})
  }, [userAnswer, currentQuestionIndex])

  const handleSelectAnswer = (pairId: string, value: string) => {
    console.log(`handleSelectAnswer called with pairId: ${pairId}, value: ${value}`)
    const newSelectedPairs = { ...selectedPairs, [pairId]: value }
    console.log("New selectedPairs:", newSelectedPairs)
    setSelectedPairs(newSelectedPairs)
    onAnswerSubmit(newSelectedPairs)
  }

  if (!currentQuestion) {
    console.error("MatchingPairsQuiz: currentQuestion is undefined")
    return (
      <Card className="w-full max-w-7xl mx-auto bg-white">
        <CardContent className="p-6">
          <p className="text-red-500">Error: Current question data is missing</p>
        </CardContent>
      </Card>
    )
  }

  if (!Array.isArray(currentQuestion.pairs) || currentQuestion.pairs.length === 0) {
    console.error("MatchingPairsQuiz: currentQuestion.pairs is invalid", currentQuestion.pairs)
    return (
      <Card className="w-full max-w-7xl mx-auto bg-white">
        <CardContent className="p-6">
          <p className="text-red-500">Error: Invalid question data for matching pairs</p>
        </CardContent>
      </Card>
    )
  }

  console.log("MatchingPairsQuiz: Rendering quiz content")
  return (
    <Card className="w-full max-w-7xl mx-auto bg-white bg-gray-100 bg-opacity-60 border-none" style={{ fontFamily: 'circe, sans-serif' }}> {/* Apply the font here */}
      <CardContent className="p-6 bg-transparent">
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <div className="w-full lg:w-[58%]">
            <div className="rounded-md overflow-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
              <div className="space-y-4">
                <p className="text-2xl font-semibold mb-2 px-4 py-2 rounded-md bg-transparent">
                  Match the following pairs
                </p>
                <div className="p-6 rounded-md bg-transparent">
                  <p className="text-lg leading-relaxed -mt-5 ">{questionData.passage}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-px bg-gray-200 self-stretch hidden lg:block mr-8 " />
          <div className="w-full lg:w-[40%] space-y-6">
            <div className="p-4">
              <p className="text-lg font-semibold -mb-5">Select the matching term for each item:</p>
            </div>
            {currentQuestion.pairs.map((pair) => {
              console.log("Rendering pair:", pair)
              return (
                <div key={pair.id} className="space-y-2">
                  <p className="font-medium">{pair.text}</p>
                  <Select
                    value={selectedPairs[pair.id] || ""}
                    onValueChange={(value) => {
                      console.log(`Select onValueChange triggered for pair ${pair.id} with value:`, value)
                      if (typeof value === 'string') {
                        handleSelectAnswer(pair.id, value)
                      } else {
                        console.error("Unexpected value type in onValueChange:", value)
                      }
                    }}
                  >
                    <SelectTrigger className="w-full hover:border-green-500 hover:bg-green-50">
                      <SelectValue placeholder="Select the matching term" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentQuestion.matchingOptions && currentQuestion.matchingOptions.map((option, optionIndex) => (
                        <SelectItem key={optionIndex} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )
            })}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  console.log("Back button clicked")
                  onNavigate('back')
                }}
                
                className="px-6 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                ← Back
              </Button>
              <Button
                onClick={() => {
                  console.log("Next button clicked")
                  onNavigate('next')
                }}
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