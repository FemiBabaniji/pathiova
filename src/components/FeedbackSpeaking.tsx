import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

type FeedbackSpeakingProps = {
  feedback: string;
  overallBandScore?: number;
};

const FeedbackSpeaking: React.FC<FeedbackSpeakingProps> = ({ feedback, overallBandScore }) => {
  const getOverallColor = (score: number | undefined) => {
    if (score === undefined) return 'bg-gray-500';
    if (score < 5) return 'bg-red-500';
    if (score >= 5 && score <= 6.5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getScoreColor = (score: number | undefined) => {
    if (score === undefined) return 'text-gray-500';
    if (score < 5) return 'text-red-500';
    if (score >= 5 && score <= 6.5) return 'text-yellow-500';
    return 'text-green-500';
  };

  const renderScore = (score: number | undefined) => {
    if (score === undefined) return '?';
    return score.toFixed(1);
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex">
            <div className={`w-16 h-full flex items-center justify-center text-3xl font-bold ${getOverallColor(overallBandScore)} text-white`}>
              {overallBandScore !== undefined ? Math.round(overallBandScore) : '?'}
            </div>
            <div className="flex-1 p-4">
              <h3 className="text-lg font-semibold mb-2">Feedback & Suggestions</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{feedback}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="bg-blue-50 rounded-md p-4">
            <h4 className="text-lg font-medium text-blue-700">Overall Band Score:</h4>
            <p className={`text-3xl font-bold ${getScoreColor(overallBandScore)}`}>
              {renderScore(overallBandScore)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackSpeaking;