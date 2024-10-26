import React, { useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TestResultsProps {
  feedbacks: Array<{ score: number }>;
  totalQuestions: number;
  onReset: () => void;
}

export default function TestResults({ feedbacks = [], totalQuestions, onReset }: TestResultsProps) {
  const averageScore = useMemo(() => {
    if (!feedbacks || feedbacks.length === 0) return 0;
    const totalScore = feedbacks.reduce((sum, feedback) => sum + (feedback?.score || 0), 0);
    return totalScore / feedbacks.length;
  }, [feedbacks]);

  const getScoreInterpretation = (score: number): string => {
    if (score >= 8) return "Expert";
    if (score >= 7) return "Very Good";
    if (score >= 6) return "Competent";
    if (score >= 5) return "Modest";
    if (score >= 4) return "Limited";
    return "Developing";
  };i n

  const getFeedbackMessage = (score: number): string => {
    if (score >= 8) return "Excellent work! Keep refining your expertise.";
    if (score >= 7) return "Great job! Focus on nuanced improvements.";
    if (score >= 6) return "You're doing well! Work on more complex structures.";
    if (score >= 5) return "You're on the right track. Focus on improving grammar.";
    if (score >= 4) return "Making progress. Concentrate on basic grammar rules.";
    return "Keep practicing! Focus on building your basic writing skills.";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <Card className="bg-white mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Your IELTS Score: {averageScore.toFixed(1)}
            </h2>
            <Progress value={averageScore * 11.11} className="mb-4" />
            <p className="mb-2">Questions Answered: {feedbacks.length}/{totalQuestions}</p>
            <p className="font-semibold mb-2">Band: {getScoreInterpretation(averageScore)}</p>
            <p className="text-sm text-gray-600 mb-4">{getFeedbackMessage(averageScore)}</p>
            <Button variant="outline" onClick={onReset} className="mb-2">
              Retake Test
            </Button>
            <Link href="/learning/writing-task-masterclass" className="block">
              <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white">
                My Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
