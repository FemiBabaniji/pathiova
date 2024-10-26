'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, CheckCircle, ChevronLeft, ChevronRight, X, Zap, Loader2, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: number
  text: string
  part: number
}

interface SpeakingPracticePageProps {
  testId: string
}

export default function SpeakingPracticePage({ testId }: SpeakingPracticePageProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [transcription, setTranscription] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRetryMode, setIsRetryMode] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch(`/api/speaking-questions/${testId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch questions')
        }
        const data = await response.json()
        setQuestions(data)
      } catch (err) {
        setError('Failed to load questions. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [testId])

  useEffect(() => {
    if (isRecording) {
      startRecording()
    } else {
      stopRecording()
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        setAudioBlob(audioBlob)
      }

      mediaRecorderRef.current.start()
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const handleStartRecording = useCallback(() => {
    setIsRecording(true)
    setTranscription('')
    setFeedback('')
    setIsRetryMode(false)
  }, [])

  const handleStopRecording = useCallback(() => {
    setIsRecording(false)
  }, [])

  const handleSubmitRecording = useCallback(async () => {
    if (!audioBlob) return

    setIsLoading(true)
    try {
      // Step 1: Send audio to transcription API
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.wav')
      const transcriptionResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })
      const transcriptionData = await transcriptionResponse.json()
      setTranscription(transcriptionData.text)

      // Step 2: Send transcription to OpenAI for feedback
      const feedbackResponse = await fetch('/api/generate-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questions[currentQuestionIndex].text,
          answer: transcriptionData.text,
        }),
      })
      const feedbackData = await feedbackResponse.json()
      setFeedback(feedbackData.feedback)
    } catch (error) {
      console.error('Error processing recording:', error)
      setFeedback('An error occurred while processing your recording. Please try again.')
    } finally {
      setIsLoading(false)
      setIsRetryMode(true)
    }
  }, [audioBlob, questions, currentQuestionIndex])

  const handleRetry = useCallback(() => {
    setAudioBlob(null)
    setTranscription('')
    setFeedback('')
    setIsRetryMode(false)
  }, [])

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1)
      handleRetry()
    }
  }, [currentQuestionIndex, questions.length, handleRetry])

  const handleBack = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1)
      handleRetry()
    }
  }, [currentQuestionIndex, handleRetry])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (questions.length === 0) {
    return <div>No questions available.</div>
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/learning/speaking-mastery" className="text-gray-800 hover:text-gray-600">
            <X className="w-8 h-8" aria-label="Close" />
          </Link>

          <div className="flex-1 mx-8">
            <Progress 
              value={((currentQuestionIndex + 1) / questions.length) * 100} 
              className="w-full" 
              aria-label={`Question ${currentQuestionIndex + 1} of ${questions.length}`}
            />
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleBack} disabled={currentQuestionIndex === 0} aria-label="Previous question">
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <span className="text-xl font-semibold">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
            <Zap className="w-6 h-6 text-yellow-400" aria-hidden="true" />
            <Button variant="ghost" onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1} aria-label="Next question">
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 mt-24">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/3 p-6 border-r border-gray-200">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl font-bold">Speaking Task - Part {currentQuestion.part}</CardTitle>
                </CardHeader>
                <div className="mt-4 space-y-4">
                  <p className="text-lg">{currentQuestion.text}</p>
                  <img 
                    src="/placeholder.svg?height=200&width=400" 
                    alt="Task related image" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    className={`w-full py-3 text-lg ${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    disabled={isLoading}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="mr-2 h-6 w-6" /> Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-6 w-6" /> Start Recording
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-1/3 p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl font-bold">Feedback</CardTitle>
                </CardHeader>
                {feedback ? (
                  <div className="mt-4 space-y-4">
                    <h3 className="text-lg font-semibold">Your transcribed answer:</h3>
                    <p className="text-gray-700">{transcription}</p>
                    <h3 className="text-lg font-semibold">AI Feedback:</h3>
                    <p className="text-gray-700">{feedback}</p>
                  </div>
                ) : (
                  <p className="mt-4 text-lg text-gray-500">Record your answer and click "Submit Recording" to receive feedback.</p>
                )}
                <Button
                  className="flex items-center justify-center w-full mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  onClick={isRetryMode ? handleRetry : handleSubmitRecording}
                  disabled={isLoading || isRecording || !audioBlob}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isRetryMode ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Retry
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Submit Recording
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}