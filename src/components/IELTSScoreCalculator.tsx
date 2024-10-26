"use client"

import React from 'react'

export interface IELTSScore {
  score: number
  band: string
}

interface IELTSScoreCalculatorProps {
  percentageScore: number
}

export const calculateIELTSScore = (percentageScore: number): IELTSScore => {
  if (percentageScore >= 90) return { score: 9, band: 'Expert' }
  if (percentageScore >= 80) return { score: 8, band: 'Very Good' }
  if (percentageScore >= 70) return { score: 7, band: 'Good' }
  if (percentageScore >= 60) return { score: 6, band: 'Competent' }
  if (percentageScore >= 50) return { score: 5, band: 'Modest' }
  if (percentageScore >= 40) return { score: 4, band: 'Limited' }
  if (percentageScore >= 30) return { score: 3, band: 'Extremely Limited' }
  if (percentageScore >= 20) return { score: 2, band: 'Intermittent' }
  return { score: 1, band: 'Non User' }
}

const IELTSScoreCalculator: React.FC<IELTSScoreCalculatorProps> = ({ percentageScore }) => {
  const ieltsScore = calculateIELTSScore(percentageScore)

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Estimated IELTS Score</h3>
      <p className="text-3xl font-bold text-blue-600">{ieltsScore.score}</p>
      <p className="text-sm text-gray-600">{ieltsScore.band}</p>
    </div>
  )
}

export default IELTSScoreCalculator