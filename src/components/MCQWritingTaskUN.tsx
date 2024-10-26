"use client"; 

import React, { useState, useMemo, useCallback, useEffect } from "react";
import axios from "axios";
import questions from "../data/questionswritingtask1.json";
import { EyeIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Loader from "../components/Loader";
import Feedback from "../components/Feedback";
import TextArea from "../components/TextArea";
import Question from "../components/Question";
import TestResults from "../components/test-results";

const MCQWritingTaskUN = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [retryModes, setRetryModes] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isRetryMode, setIsRetryMode] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = useMemo(() => {
    return questions[questionIndex];
  }, [questionIndex]);

  const getScoreColor = useCallback((score: number) => {
    if (score < 5) return "bg-red-500 text-white";
    if (score >= 5 && score <= 6.5) return "bg-yellow-500 text-white";
    return "bg-green-500 text-white";
  }, []);

  const saveProgressToLocalStorage = useCallback(() => {
    const progress = {
      questionIndex,
      answers,
      feedbacks, 
      retryModes,
    };
    localStorage.setItem("quizProgress", JSON.stringify(progress));
  }, [questionIndex, answers, feedbacks, retryModes]);

  const handleNext = useCallback(() => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = answer;
    setAnswers(updatedAnswers);

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prevIndex) => prevIndex + 1);
      setAnswer(updatedAnswers[questionIndex + 1] || "");
      setFeedbackData(feedbacks[questionIndex + 1] || null);
      setShowFeedback(!!feedbacks[questionIndex + 1]);
      setIsRetryMode(retryModes[questionIndex + 1] || false);
    } else {
      setShowResults(true);
    }

    saveProgressToLocalStorage();
  }, [answer, questionIndex, answers, feedbacks, retryModes, saveProgressToLocalStorage, questions.length]);

  const handleBack = useCallback(() => {
    if (questionIndex > 0) {
      setQuestionIndex((prevIndex) => prevIndex - 1);
      setAnswer(answers[questionIndex - 1] || "");
      setFeedbackData(feedbacks[questionIndex - 1] || null);
      setShowFeedback(!!feedbacks[questionIndex - 1]);
      setIsRetryMode(retryModes[questionIndex - 1] || false);
    }

    saveProgressToLocalStorage();
  }, [questionIndex, answers, feedbacks, retryModes, saveProgressToLocalStorage]);

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

        const feedback = {
          answer,
          feedback: data.feedback,
          score: data.score,
          highlights: data.highlights || [],
        };

        setFeedbackData(feedback);
        setShowFeedback(true);

        const updatedRetryModes = [...retryModes];
        updatedRetryModes[questionIndex] = true;
        setRetryModes(updatedRetryModes);
        setIsRetryMode(true);

        const updatedFeedbacks = [...feedbacks];
        updatedFeedbacks[questionIndex] = feedback;
        setFeedbacks(updatedFeedbacks);

        saveProgressToLocalStorage();
      } catch (error) {
        console.error("Error evaluating answer:", error);
        alert("An error occurred while evaluating your answer. Please try again.");
      } finally {
        setLoading(false);
        setFeedbackLoading(false);
      }
    }
  }, [answer, currentQuestion.id, questionIndex, feedbacks, retryModes, saveProgressToLocalStorage]);

  const handleRetry = useCallback(() => {
    setAnswer("");
    setFeedbackData(null);
    setShowFeedback(false);
    setIsRetryMode(false);
  }, []);

  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem("quizProgress"));

    if (savedProgress) {
      setQuestionIndex(savedProgress.questionIndex || 0);
      setAnswers(savedProgress.answers || []);
      setFeedbacks(savedProgress.feedbacks || []);
      setRetryModes(savedProgress.retryModes || []);

      const currentRetryMode = savedProgress.retryModes ? savedProgress.retryModes[savedProgress.questionIndex] : false;
      setIsRetryMode(currentRetryMode || false);

      setAnswer(savedProgress.answers[savedProgress.questionIndex] || "");
      setFeedbackData(savedProgress.feedbacks[savedProgress.questionIndex] || null);
      setShowFeedback(!!savedProgress.feedbacks[savedProgress.questionIndex]);
    }
  }, []);

  if (showResults) {
    return (
      <TestResults
        feedbacks={feedbacks}
        totalQuestions={questions.length}
        onReset={() => {
          setShowResults(false);
          setQuestionIndex(0);
          setAnswers([]);
          setFeedbacks([]);
          setRetryModes([]);
          setAnswer("");
          setFeedbackData(null);
          setShowFeedback(false);
          setIsRetryMode(false);
          localStorage.removeItem("quizProgress");
        }}
      />
    );
  }

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
            <Feedback feedbackData={feedbackData} getScoreColor={getScoreColor} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MCQWritingTaskUN;