"use client";

import React, { useState, useEffect } from "react";

// Import the JSON data directly from the src/data folder
import everydayReadingData from "@/data/Everydayreadingone.json";

// Import quiz components
import MultipleChoiceQuiz from "@components/MultipleChoiceQuiz";
import TrueFalseNotGivenQuiz from "@components/TrueFalseNotGivenQuiz";
import HeadingMatchingQuiz from "@components/HeadingMatchingQuiz";
import MatchingPairsQuiz from "@components/MatchingPairsQuiz";
import SentenceCompletionQuiz from "@components/SentenceCompletionQuiz";
import ShortAnswerQuiz from "@components/ShortAnswerQuiz";

// Main Dynamic Quiz Component
export default function DynamicQuiz() {
  const [passages, setPassages] = useState<any[]>([]); // Holds the passages and questions dynamically loaded
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0); // Tracks the current passage index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Tracks the current question index in a passage
  const [loading, setLoading] = useState(true); // Loading state
  const [score, setScore] = useState(0); // Tracks the score
  const [isQuizComplete, setIsQuizComplete] = useState(false); // Whether the quiz is complete

  // Fetch data from the JSON file
  useEffect(() => {
    setPassages(everydayReadingData.passages);
    setLoading(false);
  }, []);

  // If loading, show loader
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  // If quiz is complete, show results
  if (isQuizComplete) {
    const totalQuestions = passages.reduce((acc, passage) => acc + passage.questions.length, 0);
    const percentageCorrect = (score / totalQuestions) * 100;

    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Test Complete!</h1>
          <p className="text-lg mb-6">
            Your final score is: {score} out of {totalQuestions} ({percentageCorrect.toFixed(2)}%)
          </p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded">
            Restart Test
          </button>
        </div>
      </div>
    );
  }

  const currentPassage = passages[currentPassageIndex];
  const currentQuestion = currentPassage.questions[currentQuestionIndex];

  // Handle when a question is answered
  const handleAnswerSubmit = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1); // Increment score if the answer is correct
    }

    // Move to the next question or finish quiz
    if (currentQuestionIndex < currentPassage.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1); // Go to the next question in the same passage
    } else if (currentPassageIndex < passages.length - 1) {
      setCurrentPassageIndex((prev) => prev + 1); // Go to the next passage if all questions in the current one are done
      setCurrentQuestionIndex(0); // Reset question index for the next passage
    } else {
      setIsQuizComplete(true); // Mark quiz as complete
    }
  };

  // Dynamically render the appropriate component based on question type
  const renderQuestion = (question: any) => {
    switch (question.type) {
      case "multiple choice":
        return <MultipleChoiceQuiz questionData={question} onAnswerSubmit={handleAnswerSubmit} />;
      case "true/false/not given":
        return <TrueFalseNotGivenQuiz questionData={question} onAnswerSubmit={handleAnswerSubmit} />;
      case "heading matching":
        return <HeadingMatchingQuiz questionData={question} onAnswerSubmit={handleAnswerSubmit} />;
      case "matching pairs":
        return <MatchingPairsQuiz questionData={question} onAnswerSubmit={handleAnswerSubmit} />;
      case "sentence completion":
        return <SentenceCompletionQuiz questionData={question} onAnswerSubmit={handleAnswerSubmit} />;
      case "short answer":
        return <ShortAnswerQuiz questionData={question} onAnswerSubmit={handleAnswerSubmit} />;
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="quiz-container">
      <h1 className="text-xl font-semibold mb-4">Quiz on Everyday Topics</h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">{currentPassage.title}</h2>
        <p className="mb-4">{currentPassage.passage}</p>
      </div>
      <div>{renderQuestion(currentQuestion)}</div>
      <div className="navigation-buttons mt-6">
        {currentQuestionIndex > 0 && (
          <button onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)} className="px-4 py-2 bg-gray-300 rounded">
            Previous
          </button>
        )}
      </div>
    </div>
  );
}
