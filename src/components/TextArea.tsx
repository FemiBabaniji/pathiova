"use client";

import React from 'react';

type TextAreaProps = {
  answer: string;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
};

export default function TextArea({ answer, setAnswer, loading }: TextAreaProps) {
  return (
    <div className="w-full border rounded-md bg-gray border-none">
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-3">Your Response</h2>
        <textarea
          className=" w-full h-[40vh] p-8 border border-gray-300 rounded text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-transparent"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Provide your response to the question..."
          disabled={loading}
        />
      </div>
    </div>
  );
}