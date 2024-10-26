"use client"

import React from 'react'
import { motion } from 'framer-motion'

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
      <div className="flex w-full items-start space-x-4">
        <motion.div 
          className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg overflow-hidden ${getScoreColor(feedbackData.score)}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.6 
          }}
        >
          <div className="absolute inset-1 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl font-bold text-white">{Math.round(feedbackData.score)}</span>
          </div>
        </motion.div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-700 mb-1">Feedback & Suggestions</h3>
          <HighlightText text={feedbackData.feedback} highlights={feedbackData.highlights} />
        </div>
      </div>
    </div>
  )
}

export default Feedback