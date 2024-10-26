'use client'

import React, { useState, useMemo, useCallback, useEffect } from "react"
import axios from "axios"
import { CheckCircle, RefreshCw, Loader2 } from "lucide-react"
import { useScore } from "@/app/context/ScoreContext"
import { v4 as uuidv4 } from 'uuid'

import Feedback from "@/components/Feedback"
import TextArea from "@/components/TextArea"
import TestResults from "@/components/test-results"
import LoadingSpinner from "@/components/LoadingSpinner"
import IELTSWritingTestIntro from "@/components/IELTS-writing-test-intro"
import QuizNavigation from "@/components/QuizNavigation"

export default function MCQWritingTaskUN({ params }: { params: { testId: string } }) {
  const { testId } = params
  const { updateScore, getScore } = useScore()

  const [showIntro, setShowIntro] = useState(true)
  const [questions, setQuestions] = useState([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [answers, setAnswers] = useState<string[]>([])
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [retryModes, setRetryModes] = useState<boolean[]>([])
  const [loading, setLoading] = useState(false)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [feedbackData, setFeedbackData] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isRetryMode, setIsRetryMode] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [questionsLoading, setQuestionsLoading] = useState(true)
  const [attemptId, setAttemptId] = useState(uuidv4())

  const handleReceiveTestResults = (averageScore: number) => {
    console.log(`Average Score received: ${averageScore}`)
    if (testId) {
      updateScore(testId.toString(), averageScore)
      console.log(`Test ID ${testId} score updated:`, averageScore)
    } else {
      console.error("testId is undefined!")
    }
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!testId) {
        console.error("testId is undefined, cannot fetch questions.")
        return
      }

      try {
        setQuestionsLoading(true)
        const { data } = await axios.get(`/api/tests/${testId}`)
        console.log("Questions fetched:", data)
        setQuestions(data)
      } catch (error) {
        console.error("Error fetching test questions:", error)
      } finally {
        setQuestionsLoading(false)
      }
    }
    fetchQuestions()
  }, [testId])

  const currentQuestion = useMemo(() => {
    console.log("Current question index:", questionIndex)
    return questions[questionIndex]
  }, [questionIndex, questions])

  const getScoreColor = useCallback((score: number) => {
    if (score < 5) return "bg-red-500"
    if (score >= 5 && score <= 6.5) return "bg-yellow-500"
    return "bg-green-500"
  }, [])

  const saveProgressToLocalStorage = useCallback(() => {
    const progress = { questionIndex, answers, feedbacks, retryModes }
    console.log("Saving progress to localStorage:", progress)
    localStorage.setItem("quizProgress", JSON.stringify(progress))
  }, [questionIndex, answers, feedbacks, retryModes])

  const handleStartQuiz = () => {
    setShowIntro(false)
    setAttemptId(uuidv4())
  }

  const handleNext = useCallback(() => {
    const updatedAnswers = [...answers]
    updatedAnswers[questionIndex] = answer
    setAnswers(updatedAnswers)

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prevIndex) => prevIndex + 1)
      setAnswer(updatedAnswers[questionIndex + 1] || "")
      setFeedbackData(feedbacks[questionIndex + 1] || null)
      setShowFeedback(!!feedbacks[questionIndex + 1])
      setIsRetryMode(retryModes[questionIndex + 1] || false)
    } else {
      setShowResults(true)
    }

    saveProgressToLocalStorage()
  }, [answer, questionIndex, answers, feedbacks, retryModes, saveProgressToLocalStorage, questions.length])

  const handleBack = useCallback(() => {
    if (questionIndex > 0) {
      setQuestionIndex((prevIndex) => prevIndex - 1)
      setAnswer(answers[questionIndex - 1] || "")
      setFeedbackData(feedbacks[questionIndex - 1] || null)
      setShowFeedback(!!feedbacks[questionIndex - 1])
      setIsRetryMode(retryModes[questionIndex - 1] || false)
    }
    saveProgressToLocalStorage()
  }, [questionIndex, answers, feedbacks, retryModes, saveProgressToLocalStorage])

  const handleMarkAnswer = useCallback(async () => {
    if (answer.trim() !== "" && currentQuestion) {
      setFeedbackLoading(true)
      try {
        const { data } = await axios.post(
          "/api/evaluate-answer",
          { answer, questionId: currentQuestion.id },
          { headers: { "Content-Type": "application/json" } }
        )
        console.log("Feedback received:", data)
        const feedback = {
          answer,
          feedback: data.feedback,
          score: data.score,
          highlights: data.highlights || [],
        }
        setFeedbackData(feedback)
        setShowFeedback(true)
        const updatedRetryModes = [...retryModes]
        updatedRetryModes[questionIndex] = true
        setRetryModes(updatedRetryModes)
        setIsRetryMode(true)
        const updatedFeedbacks = [...feedbacks]
        updatedFeedbacks[questionIndex] = feedback
        setFeedbacks(updatedFeedbacks)
        saveProgressToLocalStorage()
      } catch (error) {
        console.error("Error evaluating answer:", error)
        alert("An error occurred while evaluating your answer. Please try again.")
      } finally {
        setFeedbackLoading(false)
      }
    }
  }, [answer, currentQuestion, questionIndex, feedbacks, retryModes, saveProgressToLocalStorage])

  const handleRetry = useCallback(() => {
    setAnswer("")
    setFeedbackData(null)
    setShowFeedback(false)
    setIsRetryMode(false)
    setAttemptId(uuidv4())
  }, [])

  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem("quizProgress"))
    console.log("Restoring saved progress:", savedProgress)
    if (savedProgress) {
      setQuestionIndex(savedProgress.questionIndex || 0)
      setAnswers(savedProgress.answers || [])
      setFeedbacks(savedProgress.feedbacks || [])
      setRetryModes(savedProgress.retryModes || [])
      const currentRetryMode = savedProgress.retryModes ? savedProgress.retryModes[savedProgress.questionIndex] : false
      setIsRetryMode(currentRetryMode || false)
      setAnswer(savedProgress.answers[savedProgress.questionIndex] || "")
      setFeedbackData(savedProgress.feedbacks[savedProgress.questionIndex] || null)
      setShowFeedback(!!savedProgress.feedbacks[savedProgress.questionIndex])
    }
  }, [])

  const handleFinishTest = useCallback(() => {
    console.log("Finishing the test.")
    setShowResults(true)
    localStorage.removeItem("quizProgress")
  }, [])

  if (showIntro) {
    return (
      <IELTSWritingTestIntro
        section="Writing"
        onContinue={handleStartQuiz}
      />
    )
  }

  if (showResults) {
    return (
      <TestResults
        feedbacks={feedbacks}
        totalQuestions={questions.length}
        onReset={() => {
          setShowResults(false)
          setQuestionIndex(0)
          setAnswers([])
          setFeedbacks([])
          setRetryModes([])
          setAnswer("")
          setFeedbackData(null)
          setShowFeedback(false)
          setIsRetryMode(false)
          localStorage.removeItem("quizProgress")
          setAttemptId(uuidv4())
        }}
        sendAverageScore={handleReceiveTestResults}
        testId={testId}
      />
    )
  }

  if (questionsLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ fontFamily: 'circe, sans-serif' }}>
      <QuizNavigation
        questionIndex={questionIndex}
        totalQuestions={questions.length}
        onBack={handleBack}
        onNext={questionIndex === questions.length - 1 ? handleFinishTest : handleNext}
        onFinish={handleFinishTest}
      />

      <main className="flex-1 container mx-auto px-4 py-8 mt-40">
        <div className="bg-gray-100 bg-opacity-40 rounded-2xl overflow-hidden">
          <div className="flex">
            <div className="w-2/3 p-6 border-r border-gray-200">
              <TextArea answer={answer} setAnswer={setAnswer} loading={feedbackLoading} />
            </div>
            <div className="w-1/3 p-6">
              <h2 className="text-2xl font-semibold mb-4">Question</h2>
              <p className="text-lg leading-relaxed mb-6">
                {currentQuestion?.question}
              </p>
              <hr className="w-full border-t border-gray-300 mb-4" />
              <button
                className="flex items-center justify-center w-full px-4 py-2 bg-transparent border border-gray-300 rounded-md text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                onClick={isRetryMode ? handleRetry : handleMarkAnswer}
                disabled={feedbackLoading}
              >
                {feedbackLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    {isRetryMode ? <RefreshCw className="w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                    {isRetryMode ? "Retry" : "Mark Answer"}
                  </>
                )}
              </button>
              {showFeedback && feedbackData && (
                <div className="mt-4">
                  <Feedback 
                    feedbackData={feedbackData} 
                    getScoreColor={getScoreColor} 
                    questionId={currentQuestion.id}
                    attemptId={attemptId}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}