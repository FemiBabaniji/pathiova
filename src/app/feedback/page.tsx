"use client";  // Ensure this component runs on the client-side

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation"; // Import the useRouter hook for navigation
import axios from "axios";
import questions from "../data/questionswritingtask1.json"; // Ensure the path to your questions file is correct

const MCQWritingTaskUN = () => {
  const [questionIndex, setQuestionIndex] = useState(0); // Current question index
  const [answer, setAnswer] = useState(""); // Current answer text
  const [answers, setAnswers] = useState<string[]>([]); // Array of all submitted answers
  const [loading, setLoading] = useState(false); // Loading state for API requests
  const router = useRouter(); // Router for navigation

  // Memoized current question
  const currentQuestion = useMemo(() => {
    return questions[questionIndex];
  }, [questionIndex]);

  // Handle the "Next" button click
  const handleNext = useCallback(async () => {
    if (answer.trim() !== "") {
      setLoading(true); // Set loading state to true when submitting the answer

      try {
        // Call the API to get feedback for the current answer
        const { data } = await axios.post("/api/evaluate-answer", { answer });

        // Navigate to the feedback page with query params
        router.push({
          pathname: "/feedback", // Navigate to the feedback page
          query: {
            answer: encodeURIComponent(answer), // Ensure proper encoding
            feedback: encodeURIComponent(data.feedback), // Ensure proper encoding
            score: `${answers.length + 1}/${questions.length}`, // Example score calculation
            totalQuestions: questions.length, // Total number of questions
          },
        });
      } catch (error) {
        console.error("Error evaluating answer:", error);
        alert("An error occurred while evaluating your answer. Please try again.");
      } finally {
        setLoading(false); // Set loading state back to false after the request
      }
    }
  }, [answer, answers, questionIndex, router]);

  // Handle the "Back" button click
  const handleBack = useCallback(() => {
    if (questionIndex > 0) {
      setQuestionIndex((prevIndex) => prevIndex - 1);
      setAnswers((prev) => prev.slice(0, -1));
      setAnswer(answers[questionIndex - 1] || ""); // Restore the previous answer
    }
  }, [questionIndex, answers]);

  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Left Side for Text Input */}
      <div className="flex flex-col flex-grow px-10 py-6">
        <div className="w-full h-full border rounded-md bg-white shadow-sm overflow-y-auto">
          <div className="p-8">
            <textarea
              className="w-full h-[70vh] p-4 border-b border-gray-200 text-lg text-gray-800 focus:outline-none"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type or paste (⌘+V) your text here or upload a document."
              disabled={loading} // Disable input while loading
            />
          </div>
        </div>
      </div>

      {/* Right Sidebar for Question and Suggestions */}
      <div className="w-[25%] h-[70%] bg-white border-l border-gray-200 shadow-sm mr-10 mt-10 rounded-lg">
        <div className="flex flex-col items-start p-6 h-full overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Question</h2>
          <div className="mb-6">
            <h3 className="text-xl font-medium text-gray-700">
              {currentQuestion?.question}
            </h3>
            <p className="mt-2 text-gray-600">
              {currentQuestion?.description || "Provide a detailed response to the question on the left."}
            </p>
          </div>

          <div className="flex justify-between w-full mt-6">
            {/* Back Button */}
            <button
              className="px-6 py-2 font-semibold border border-gray-500 rounded-md text-gray-500 hover:bg-gray-100"
              onClick={handleBack}
              disabled={questionIndex === 0 || loading} // Disable during loading
            >
              Back
            </button>

            {/* Next Button */}
            <button
              className="px-6 py-2 font-semibold text-white bg-orange-600 rounded-md hover:bg-orange-700"
              onClick={handleNext}
              disabled={answer.trim() === "" || loading} // Disable if answer is empty or loading
            >
              {loading ? "Submitting..." : "Next"}
            </button>
          </div>

          <hr className="w-full border-t border-gray-300 my-4" />
          <div className="flex-grow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Tips & Suggestions</h2>
            <p className="text-sm text-gray-600 mb-2">
              • Break your response into clear, logical paragraphs.
            </p>
            <p className="text-sm text-gray-600 mb-2">
              • Use examples to support your arguments.
            </p>
            <p className="text-sm text-gray-600 mb-2">
              • Stay on topic and address all parts of the question.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCQWritingTaskUN;
