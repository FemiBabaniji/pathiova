"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, ChevronRight, FastForward, Rewind } from "lucide-react"
import QuizNavigation from '@/components/QuizNavigation'
import TestResultsRead from '@/components/Test-results-read'
import MultipleChoiceQuiz from "@/components/MultipleChoiceQuiz"
import TrueFalseNotGivenQuiz from "@/components/TrueFalseNotGivenQuiz"
import YesNoNotGivenQuiz from "@/components/YesNoNotGivenQuiz"
import SentenceCompletionQuiz from "@/components/SentenceCompletionQuiz"

interface Question {
  id: number
  type: string
  sentence?: string
  statement?: string
  options?: string[]
  correctAnswer: string
}

interface AudioPassage {
  title: string
  audioUrl: string
  questions: Question[]
}

export default function DynamicQuiz({ params }: { params: { testId: string } }) {
  const [audios, setAudios] = useState<AudioPassage[]>([])
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)
  const [loading, setLoading] = useState(true)
  const [isQuizComplete, setIsQuizComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)
  const [audioFinished, setAudioFinished] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const { testId } = params

  useEffect(() => {
    const loadData = async () => {
      try {
        const quizModule = await import(`@/data/LISTENING-QUESTIONS/${testId}.json`)
        const quizData = quizModule.default
        
        if (quizData && Array.isArray(quizData.audios)) {
          setAudios(quizData.audios)
        } else {
          setError("Invalid data structure in the imported JSON file.")
        }
      } catch (err) {
        setError("Failed to load passages from JSON file.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [testId])

  // Handle audio source changes
  useEffect(() => {
    if (audioRef.current && audios[currentAudioIndex]) {
      audioRef.current.src = audios[currentAudioIndex].audioUrl
      audioRef.current.load()
      setIsPlaying(false)
      setAudioProgress(0)
      setAudioFinished(false)
      setHasStartedPlaying(false)
    }
  }, [currentAudioIndex, audios])

  // Handle playback rate changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate
    }
  }, [playbackRate])

  const currentAudio = audios[currentAudioIndex]
  const currentQuestion = currentQuestionIndex >= 0 ? currentAudio?.questions[currentQuestionIndex] : null
  const totalQuestions = audios.reduce((acc, audio) => acc + audio.questions.length, 0)
  const currentQuestionNumber = audios.slice(0, currentAudioIndex).reduce((acc, audio) => acc + audio.questions.length, 0) + currentQuestionIndex + 1

  const handleAnswerSubmit = (answer: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestion!.id]: answer }))
  }

  const handleNavigation = (direction: 'next' | 'back') => {
    if (direction === 'back') {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1)
      } else if (currentAudioIndex > 0) {
        setCurrentAudioIndex(prev => prev - 1)
        setCurrentQuestionIndex(audios[currentAudioIndex - 1].questions.length - 1)
      }
    } else {
      if (currentQuestionIndex < currentAudio.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else if (currentAudioIndex < audios.length - 1) {
        setCurrentAudioIndex(prev => prev + 1)
        setCurrentQuestionIndex(0)
      } else {
        setIsQuizComplete(true)
      }
    }
  }

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else if (!audioFinished) {
      if (!hasStartedPlaying) {
        setHasStartedPlaying(true)
      }
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error)
        setIsPlaying(false)
      })
    }
  }

  const updateAudioProgress = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setAudioProgress(progress)
    }
  }

  const handleAudioEnd = () => {
    setIsPlaying(false)
    setAudioFinished(true)
    setCurrentQuestionIndex(0)
  }

  const fastForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10)
    }
  }

  const rewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10)
    }
  }

  const handleSpeedChange = (newSpeed: number[]) => {
    setPlaybackRate(newSpeed[0])
  }

  const startQuestions = () => {
    if (hasStartedPlaying) {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setAudioFinished(true)
      setCurrentQuestionIndex(0)
    }
  }

  const renderQuizComponent = () => {
    if (!currentQuestion) return null

    const commonProps = {
      questionData: {
        passage: currentAudio.title,
        questions: [currentQuestion]
      },
      currentQuestionIndex: 0,
      onAnswerSubmit: handleAnswerSubmit,
      onNavigate: handleNavigation,
      userAnswer: userAnswers[currentQuestion.id]
    }

    switch (currentQuestion.type.toLowerCase()) {
      case "multiple choice":
        return <MultipleChoiceQuiz {...commonProps} />
      case "true/false/not given":
        return <TrueFalseNotGivenQuiz {...commonProps} />
      case "yes/no/not given":
        return <YesNoNotGivenQuiz {...commonProps} />
      case "sentence completion":
        return <SentenceCompletionQuiz {...commonProps} />
      default:
        return <div>Unsupported question type: {currentQuestion.type}</div>
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-2xl">
          <CardContent className="text-center p-6">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-lg mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (audios.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-2xl">
          <CardContent className="text-center p-6">
            <h1 className="text-2xl font-bold mb-4">No questions available</h1>
            <p className="text-lg mb-6">Please check the question data and try again.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isQuizComplete) {
    const allQuestions = audios.flatMap(audio => audio.questions)
    const feedbacks = allQuestions.map(question => ({
      answer: userAnswers[question.id],
      correctAnswer: question.correctAnswer
    }))

    return (
      <TestResultsRead
        feedbacks={feedbacks}
        totalQuestions={totalQuestions}
        onReset={() => {
          setIsQuizComplete(false)
          setCurrentAudioIndex(0)
          setCurrentQuestionIndex(-1)
          setUserAnswers({})
          setAudioFinished(false)
          setHasStartedPlaying(false)
          if (audioRef.current) {
            audioRef.current.currentTime = 0
          }
        }}
        testId={testId}
      />
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <QuizNavigation
        questionIndex={currentQuestionNumber - 1}
        totalQuestions={totalQuestions}
        onBack={() => handleNavigation('back')}
        onNext={() => handleNavigation('next')}
        onFinish={() => setIsQuizComplete(true)}
        timeRemaining={timeRemaining}
      />
      <main className="flex-1 container mx-auto px-4 py-8 mt-28">
        <Card className="w-full max-w-3xl mx-auto bg-white">
          <CardContent className="p-6">
            <h1 className="text-2xl font-semibold mb-4">{currentAudio.title}</h1>
            {!audioFinished ? (
              <div className="mb-6">
                <div className="relative w-48 h-48 mx-auto mb-4">
                  <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center">
                    <Button
                      onClick={togglePlayPause}
                      variant="outline"
                      size="icon"
                      className="w-24 h-24 rounded-full bg-yellow-400 text-yellow-900 hover:bg-yellow-500 focus:ring-yellow-500"
                    >
                      {isPlaying ? (
                        <Pause className="h-12 w-12" />
                      ) : (
                        <Play className="h-12 w-12" />
                      )}
                    </Button>
                  </div>
                  {isPlaying && (
                    <div className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-pulse" />
                  )}
                </div>
                <audio
                  ref={audioRef}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={handleAudioEnd}
                  onTimeUpdate={updateAudioProgress}
                  onError={(e) => {
                    console.error("Audio error:", e)
                    setError("Failed to load audio file. Please try again.")
                  }}
                >
                  <source src={currentAudio.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <Progress value={audioProgress} className="mt-4 bg-yellow-100" indicatorClassName="bg-yellow-400"/>
                <div className="flex justify-between items-center mt-4">
                  <Button
                    onClick={rewind}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                    disabled={!hasStartedPlaying}
                  >
                    <Rewind className="h-4 w-4" />
                    <span>10s</span>
                  </Button>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-yellow-600">Speed: {playbackRate}x</span>
                    <Slider
                      min={0.5}
                      max={2}
                      step={0.25}
                      value={[playbackRate]}
                      onValueChange={handleSpeedChange}
                      className="w-32"
                      disabled={!hasStartedPlaying}
                    />
                  </div>
                  <Button
                    onClick={fastForward}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                    disabled={!hasStartedPlaying}
                  >
                    <FastForward className="h-4 w-4" />
                    <span>10s</span>
                  </Button>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-600">
                    {!hasStartedPlaying 
                      ? "Note: The audio can only be played once."
                      : "You can pause and resume during playback."}
                  </p>
                  <Button
                    onClick={startQuestions}
                    className="flex items-center space-x-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-full px-4 py-2"
                    disabled={!hasStartedPlaying}
                  >
                    <span>Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              renderQuizComponent()
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}