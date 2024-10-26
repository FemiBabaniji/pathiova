"use client"

import React from 'react'

type FeedbackProps = {
  feedbackData: {
    score: number
    feedback: string
    highlights: string[]
  }
  getScoreColor: (score: number) => string
}

const HighlightText: React.FC<{ text: string; highlights: string[] }> = ({ text, highlights }) => {
  if (!highlights || highlights.length === 0) return <span>{text}</span>

  const regex = new RegExp(`(${highlights.join('|')})`, 'gi')
  const parts = text.split(regex)

  return (
    <span>
      {parts.map((part, index) =>
        highlights.some(h => h.toLowerCase() === part.toLowerCase()) ? (
          <span key={index} className="bg-green-200 px-1">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  )
}

const Feedback: React.FC<FeedbackProps> = ({ feedbackData, getScoreColor }) => {
  return (
    <div className="mt-4">
      <div className="flex w-full justify-between items-start">
        <div className={`w-16 h-16 flex items-center justify-center rounded-lg ${getScoreColor(feedbackData.score)}`}>
          <span className="text-2xl font-bold text-white">{feedbackData.score}</span>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Feedback & Suggestions</h3>
          <HighlightText text={feedbackData.feedback} highlights={feedbackData.highlights} />
        </div>
      </div>
    </div>
  )
}

export default Feedback