"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, X, CheckCircle, RefreshCw, Loader2, Zap } from "lucide-react";
import Link from "next/link";
import { useScore } from "@/app/context/ScoreContext"; // Use score context

import Feedback from "@/components/Feedback";
import TextArea from "@/components/TextArea";
import TestResults from "@/components/test-results";
import LoadingSpinner from "@/components/LoadingSpinner";

// Extract testId from params in the dynamic route
export default function MCQWritingTaskUN({ params }: { params: { testId: string } }) {
  const { testId } = params; // Extract testId from params
  const { updateScore, getScore } = useScore(); // Use score context

  const [questions, setQuestions] = useState([]);
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
  const [questionsLoading, setQuestionsLoading] = useState(true);

  // Debugging: Log testId to ensure it's captured correctly
  console.log("TestId in MCQWritingTaskUN:", testId);

  // Function to handle receiving the average score
  const handleReceiveTestResults = (averageScore: number) => {
    console.log(`Average Score received: ${averageScore}`);
    if (testId) {
      updateScore(testId.toString(), averageScore); // Update the score in context using testId
      console.log(`Test ID ${testId} score updated:`, averageScore);
    } else {
      console.error("testId is undefined!");
    }
  };

  // Fetch the questions for this test
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!testId) {
        console.error("testId is undefined, cannot fetch questions.");
        return;
      }

      try {
        setQuestionsLoading(true);
        const { data } = await axios.get(`/api/tests/${testId}`);
        console.log("Questions fetched:", data);
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching test questions:", error);
      } finally {
        setQuestionsLoading(false);
      }
    };
    fetchQuestions();
  }, [testId]);

  const currentQuestion = useMemo(() => {
    console.log("Current question index:", questionIndex);
    return questions[questionIndex];
  }, [questionIndex, questions]);

  const getScoreColor = useCallback((score: number) => {
    if (score < 5) return "bg-red-500";
    if (score >= 5 && score <= 6.5) return "bg-yellow-500";
    return "bg-green-500";
  }, []);

  const saveProgressToLocalStorage = useCallback(() => {
    const progress = { questionIndex, answers, feedbacks, retryModes };
    console.log("Saving progress to localStorage:", progress);
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
    if (answer.trim() !== "" && currentQuestion) {
      setFeedbackLoading(true);
      try {
        const { data } = await axios.post(
          "/api/evaluate-answer",
          { answer, questionId: currentQuestion.id },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("Feedback received:", data);
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
        setFeedbackLoading(false);
      }
    }
  }, [answer, currentQuestion, questionIndex, feedbacks, retryModes, saveProgressToLocalStorage]);

  const handleRetry = useCallback(() => {
    setAnswer("");
    setFeedbackData(null);
    setShowFeedback(false);
    setIsRetryMode(false);
  }, []);

  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem("quizProgress"));
    console.log("Restoring saved progress:", savedProgress);
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

  const handleFinishTest = useCallback(() => {
    console.log("Finishing the test.");
    setShowResults(true);
    localStorage.removeItem("quizProgress");
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
        sendAverageScore={handleReceiveTestResults} // Pass the average score handler
        testId={testId} // Pass the dynamic testId prop
      />
    );
  }

  if (questionsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/learning/reading-mastery" className="text-gray-800 hover:text-gray-600">
            <X className="w-8 h-8" />
          </Link>

          <div className="flex-1 mx-8">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300 ease-in-out"
                style={{
                  width: `${((questionIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={handleBack}
              disabled={questionIndex === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-xl font-semibold">
              {questionIndex + 1} / {questions.length}
            </span>
            <Zap className="w-6 h-6 text-yellow-400" />
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={questionIndex === questions.length - 1 ? handleFinishTest : handleNext}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 mt-24">
        <div className="bg-white shadow-md rounded-2xl overflow-hidden">
          <div className="flex">
            <div className="w-2/3 p-6 border-r border-gray-200">
              <TextArea answer={answer} setAnswer={setAnswer} loading={feedbackLoading} />
            </div>
            <div className="w-1/3 p-6">
              <h2 className="text-lg font-semibold mb-4">Question</h2>
              <p className="text-sm text-gray-600 mb-4">
                {currentQuestion?.question}
              </p>
              <hr className="w-full border-t border-gray-300 mb-4" />
              <button
                className="flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                onClick={isRetryMode ? handleRetry : handleMarkAnswer}
                disabled={feedbackLoading}
              >
                {feedbackLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    {isRetryMode ? <RefreshCw className="w-5 h-5 mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                    {isRetryMode ? "Retry" : "Mark Answer"}
                  </>
                )}
              </button>
              {showFeedback && feedbackData && (
                <div className="mt-4">
                  <Feedback feedbackData={feedbackData} getScoreColor={getScoreColor} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
