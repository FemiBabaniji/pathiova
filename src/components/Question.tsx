"use client";

import React from 'react';
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type QuestionProps = {
  currentQuestion: { question: string };
  handleNext: () => void;
  handleBack: () => void;
  questionIndex: number;
  totalQuestions: number;
  loading: boolean;
};

export default function Question({
  currentQuestion,
  handleNext,
  handleBack,
  questionIndex,
  totalQuestions,
  loading,
}: QuestionProps) {
  const isLastQuestion = questionIndex === totalQuestions - 1;

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Question</h2>
      <div className="flex-grow mb-4 overflow-y-auto">
        <p className="text-base text-gray-700">
          {currentQuestion?.question}
        </p>
      </div>

      <div className="mt-auto">
        <hr className="w-full border-t border-gray-300 mb-4" />
        <div className="flex justify-between items-center">
          <Link href="/learning/writing-task-masterclass">
            <button className="p-2 text-gray-600 hover:text-gray-800" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </Link>
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              onClick={handleBack}
              disabled={questionIndex === 0 || loading}
              aria-label="Previous question"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600">{`${questionIndex + 1} / ${totalQuestions}`}</span>
            <button
              className={`p-2 ${isLastQuestion ? "text-gray-600" : "text-orange-600"} hover:text-orange-700 disabled:opacity-50`}
              onClick={handleNext}
              disabled={loading || questionIndex >= totalQuestions}
              aria-label={isLastQuestion ? "Finish" : "Next question"}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}