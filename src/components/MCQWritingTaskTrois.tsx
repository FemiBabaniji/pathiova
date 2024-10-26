"use client"; 

import React, { useState, useMemo, useCallback, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import questions from "../data/questionswritingtask1.json"; 
import { EyeIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Loader from "../components/Loader";
import Feedback from "../components/Feedback";
import TextArea from "../components/TextArea";
import Question from "../components/Question";

const MCQWritingTaskTrois = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false); 
  const [feedbackLoading, setFeedbackLoading] = useState(false); 
  const [feedbackData, setFeedbackData] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false); 
  const [isRetryMode, setIsRetryMode] = useState(false);

  const currentQuestion = useMemo(() => {
    return questions[questionIndex];
  }, [questionIndex]);

  const handleMarkAnswer = useCallback(async () => {
    if (answer.trim() !== "") {
      setLoading(true); 
      setFeedbackLoading(true); 

      try {
        const { data } = await axios.post(
          "/api/evaluate-answer",
          { answer, questionId: currentQuestion.id },
          { headers: { "Content-Type": "application/json" } }
        );

        setFeedbackData({
          answer,
          feedback: data.feedback,
          score: data.score, 
          highlights: data.highlights || [], 
          totalQuestions: questions.length,
        });

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
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prevIndex) => prevIndex + 1);
      setAnswer("");
      setShowFeedback(false);
      setFeedbackData(null);
      setIsRetryMode(false);
    }
  }, [questionIndex, questions.length]);

  const handleBack = useCallback(() => {
    if (questionIndex > 0) {
      setQuestionIndex((prevIndex) => prevIndex - 1);
      setAnswer(""); 
      setShowFeedback(false); 
      setFeedbackData(null);
      setIsRetryMode(false);
    }
  }, [questionIndex]);

  return (
    <div className="flex h-screen w-full bg-gray-50">
      <div className="flex flex-col flex-grow px-10 py-6">
        <TextArea answer={answer} setAnswer={setAnswer} loading={loading} />
      </div>

      <div className="w-[25%] h-[60%] bg-white border-l border-gray-200 shadow-sm mr-10 mt-10 rounded-lg p-4 flex flex-col justify-between">
        <div>
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

          <Loader loading={feedbackLoading} />

          {showFeedback && feedbackData && (
            <Feedback feedbackData={feedbackData} />
          )}

        </div>
      </div>
    </div>
  );
};

export default MCQWritingTaskTrois;
