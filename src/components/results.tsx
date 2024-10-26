"use client";
import Link from "next/link";
import questions from '../data/questions.json'; // Adjust the path if necessary
import { useSearchParams } from 'next/navigation';
import { ChevronRight } from "lucide-react";

const ResultsPage = () => {
  const searchParams = useSearchParams();
  let totalScore = 0;

  // Calculate the total score
  questions.forEach((question, index) => {
    const selectedOption = searchParams.get(`q${question.id}`);
    if (selectedOption !== null) {
      totalScore += question.scores[Number(selectedOption)];
    }
  });

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="mb-8 text-5xl font-bold text-center max-w-2xl px-8">
        Your Total Score: {totalScore}
      </h1>
      <div className="w-full max-w-2xl px-8 py-12 bg-white shadow-md rounded-lg text-center">
        <p className="mb-8 text-lg">
          Thank you for completing the quiz! Here is your score summary.
        </p>
        <div className="text-left">
          {questions.map((question, index) => {
            const selectedOption = searchParams.get(`q${question.id}`);
            const selectedAnswer = selectedOption !== null ? question.options[Number(selectedOption)] : "No answer";
            return (
              <div key={question.id} className="mb-4">
                <h3 className="font-semibold">{question.question}</h3>
                <p>Your Answer: <span className="font-medium text-blue-600">{selectedAnswer}</span></p>
              </div>
            );
          })}
        </div>
        <Link href="/" className="px-6 py-3 mt-8 font-semibold text-white bg-orange-500 rounded-md hover:bg-orange-600 inline-flex items-center">
          Go to Home
          <ChevronRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default ResultsPage;
