"use client";  // Ensure this component runs on the client-side

import React, { useState, useMemo, useCallback, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import questions from "../data/questionswritingtask2.json"; // Import the new set of questions from task2.json
import { EyeIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Loader from "../components/Loader";  // Import the Loader component
import Feedback from "../components/Feedback"; // Import Feedback component
import TextArea from "../components/TextArea"; // Import TextArea component
import Question from "../components/Question"; // Import Question component

const MCQWritingTaskDEUX = () => {  // Changed component name to MCQWritingTaskDEUX
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false); 
  const [feedbackLoading, setFeedbackLoading] = useState(false); 
  const [feedbackData, setFeedbackData] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false); 
  const [isRetryMode, setIsRetryMode] = useState(false);
  const [storedScores, setStoredScores] = useState([]); 

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem("quizScores")) || [];
    setStoredScores(savedScores);
  }, []);

  const currentQuestion = useMemo(() => {
    return questions[questionIndex];
  }, [questionIndex]);

  const saveScoresToLocalStorage = (newScore) => {
    const updatedScores = [...storedScores, newScore];
    setStoredScores(updatedScores);
    localStorage.setItem("quizScores", JSON.stringify(updatedScores));
  };

  const handleMarkAnswer = useCallback(async () => {
    if (answer.trim() !== "") {
      setLoading(true); 
      setFeedbackLoading(true); 

      try {
        const { data } = await axios.post(
          "/api/evaluate-answer",
          {
            answer: answer, 
            questionId: currentQuestion.id 
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setFeedbackData({
          answer: answer,
          feedback: data.feedback,
          score: data.score, 
          highlights: data.highlights || [], 
          totalQuestions: questions.length,
        });

        saveScoresToLocalStorage(data.score);
        setShowFeedback(true); 
        setIsRetryMode(true); 

      } catch (error) {
        console.error("Error evaluating answer:", error);
        alert("An error occurred while evaluating your answer. Please try again.");
      } finally {
        setLoading(false); 
        setFeedbackLoading(false); 
      }
    }
  }, [answer, currentQuestion.id]);

  const handleRetry = () => {
    setAnswer("");
    setFeedbackData(null);
    setShowFeedback(false); 
    setIsRetryMode(false); 
  };

  const handleNext = useCallback(() => {
    if (feedbackData) { 
      setQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
      setAnswer(""); 
      setShowFeedback(false); 
      setFeedbackData(null); 
      setIsRetryMode(false); 
    }
  }, [feedbackData, questions.length]);

  const handleBack = useCallback(() => {
    if (questionIndex > 0) {
      setQuestionIndex((prevIndex) => prevIndex - 1);
      setAnswers((prev) => prev.slice(0, -1));
      setAnswer(answers[questionIndex - 1] || "");
      setShowFeedback(false); 
      setFeedbackData(null);
      setIsRetryMode(false); 
    }
  }, [questionIndex, answers]);

  const getScoreColor = (score) => {
    if (score < 5) return "bg-red-500 text-white"; 
    if (score >= 5 && score <= 6.5) return "bg-yellow-500 text-white"; 
    return "bg-green-500 text-white"; 
  };

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <div className="flex flex-col flex-grow px-10 py-6">
        {/* Use the TextArea component */}
        <TextArea answer={answer} setAnswer={setAnswer} loading={loading} />
      </div>

      <div className="w-[25%] h-[60%] bg-white border-l border-gray-200 shadow-sm mr-10 mt-10 rounded-lg p-4 flex flex-col justify-between">
        <div>
          {/* Use the Question component */}
          <Question
            currentQuestion={currentQuestion}
            handleNext={handleNext}
            handleBack={handleBack}
            questionIndex={questionIndex}
            totalQuestions={questions.length}
            loading={loading}
            feedbackData={feedbackData}
          />

          <div className="flex justify-center mt-4">
            {isRetryMode ? (
              <div 
                onClick={handleRetry} 
                className="cursor-pointer text-blue-500 hover:text-orange-500 flex items-center"
              >
                <ArrowPathIcon className="h-6 w-6 mr-2" />
                <span>Retry</span>
              </div>
            ) : (
              <div 
                onClick={handleMarkAnswer} 
                className="cursor-pointer text-blue-500 hover:text-orange-500 flex items-center"
              >
                <EyeIcon className="h-6 w-6 mr-2" />
                <span>Show solution</span>
              </div>
            )}
          </div>

          {/* Loader Component */}
          <Loader loading={feedbackLoading} />

          {/* Feedback Component */}
          {showFeedback && feedbackData && (
            <Feedback feedbackData={feedbackData} getScoreColor={getScoreColor} />
          )}

        </div>
      </div>
    </div>
  );
};

export default MCQWritingTaskDEUX; // Updated export name
