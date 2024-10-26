'use client'

import { X, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useScore } from '@/app/context/ScoreContext'

interface QuizNavigationProps {
  questionIndex: number
  totalQuestions: number
  onBack: () => void
  onNext: () => void
  onFinish: () => void
}

export default function QuizNavigation({
  questionIndex,
  totalQuestions,
  onBack,
  onNext,
  onFinish
}: QuizNavigationProps) {
  const handleGoBack = () => {
    window.history.back()
  }

  const { stars, updateStars } = useScore()

  const handleStarClick = () => {
    if (updateStars) {
      updateStars(stars + 1)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 py-4 sm:py-6 flex items-center justify-between">
        <div className="w-1/5 sm:w-1/4">
          <button
            className="text-gray-800 hover:text-gray-600"
            onClick={handleGoBack}
          >
            <X className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
        </div>

        <div className="w-3/5 sm:w-1/2 px-2 sm:px-4 flex items-center">
          <div className="w-full h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden mr-2">
            <div
              className="h-full bg-green-500 transition-all duration-300 ease-in-out"
              style={{
                width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
          <div className="flex items-center space-x-1">
            <button onClick={handleStarClick} className="focus:outline-none">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-yellow-400" />
            </button>
            <span className="text-sm sm:text-base font-semibold text-yellow-400">{stars}</span>
          </div>
        </div>

        <div className="w-1/5 sm:w-1/4 flex items-center justify-end space-x-2 sm:space-x-4">
          <button
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onBack}
            disabled={questionIndex === 0}
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <span className="text-lg sm:text-2xl font-semibold">
            {questionIndex + 1} / {totalQuestions}
          </span>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={questionIndex === totalQuestions - 1 ? onFinish : onNext}
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>
      </div>
    </header>
  )
}