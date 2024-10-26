'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import NavbarQuiz from "@/components/navbarquiz";
import questionsData from "../data/questionsread1MCQ.json";

function MCQread() {
  const [selectedAnswers, setSelectedAnswers] = useState<Array<string | null>>(Array(questionsData.sections.reduce((acc, section) => acc + section.questions.length, 0)).fill(null));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const totalQuestions = questionsData.sections.reduce(
    (acc, section) => acc + section.questions.length,
    0
  );

  const currentSectionIndex = questionsData.sections.findIndex((section, idx) => {
    const questionsInPreviousSections = questionsData.sections
      .slice(0, idx)
      .reduce((acc, section) => acc + section.questions.length, 0);
    return currentQuestionIndex < questionsInPreviousSections + section.questions.length;
  });

  const currentSection = questionsData.sections[currentSectionIndex];
  const currentQuestionInSectionIndex =
    currentQuestionIndex -
    questionsData.sections
      .slice(0, currentSectionIndex)
      .reduce((acc, section) => acc + section.questions.length, 0);
  const currentQuestion = currentSection.questions[currentQuestionInSectionIndex];

  const handleNext = () => {
    if (selectedAnswers[currentQuestionIndex]) {
      if (selectedAnswers[currentQuestionIndex] === currentQuestion.correct_answer) {
        setScore((prevScore) => prevScore + 1);
      }

      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setIsQuizComplete(true);
      }
    } else {
      alert("Please select an answer before proceeding.");
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleAnswerSelect = (option: string) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentQuestionIndex] = option;
    setSelectedAnswers(updatedAnswers);
  };

  if (isQuizComplete) {
    const correctAnswers = selectedAnswers.filter((answer, index) => {
      const sectionIndex = questionsData.sections.findIndex((section, idx) => {
        const questionsInPreviousSections = questionsData.sections
          .slice(0, idx)
          .reduce((acc, section) => acc + section.questions.length, 0);
        return index < questionsInPreviousSections + section.questions.length;
      });
      const questionIndexInSection = index - questionsData.sections
        .slice(0, sectionIndex)
        .reduce((acc, section) => acc + section.questions.length, 0);
      const correctAnswer = questionsData.sections[sectionIndex].questions[questionIndexInSection].correct_answer;
      return answer === correctAnswer;
    });

    const percentageCorrect = (correctAnswers.length / totalQuestions) * 100;

    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Card className="w-full max-w-2xl">
          <CardContent className="text-center p-6">
            <h1 className="text-2xl font-bold mb-4">Test Complete!</h1>
            <p className="text-lg mb-6">
              Your final score is: {correctAnswers.length} out of {totalQuestions} ({percentageCorrect.toFixed(2)}%)
            </p>
            <Button onClick={() => window.location.reload()}>Restart Test</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10">
        <NavbarQuiz
          onClose={() => window.close()}
          onPrevious={handlePrevious}
          onNext={handleNext}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={totalQuestions}
          passages={questionsData.sections.map((section) => section.questions.length)}
        />
      </div>
      <div className="flex-grow container mx-auto px-4 pt-20">
        <Card className="w-full max-w-7xl mx-auto bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-3/5">
                <div className="rounded-md overflow-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                  <div className="space-y-4">
                    <p className="text-lg font-semibold mb-4 bg-white px-4 py-2 rounded-md">
                      {currentQuestion.question}
                    </p>
                    <div className="bg-white p-6 rounded-md border border-gray-200">
                      <p className="text-sm leading-relaxed">{currentSection.passage}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-2/5 space-y-6">
                <div className="bg-orange-50 p-4 rounded-md">
                  <p className="text-sm font-semibold text-orange-800">Select one option.</p>
                </div>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-3 rounded-md cursor-pointer transition-all duration-200 
                        border ${selectedAnswers[currentQuestionIndex] === option 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-300 hover:border-orange-500 hover:bg-orange-50'}`}
                      onClick={() => handleAnswerSelect(option)}
                    >
                      <Label className="text-sm cursor-pointer flex-grow">{option}</Label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2"
                  >
                    ← Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!selectedAnswers[currentQuestionIndex]}
                    className="bg-orange-500 text-white hover:bg-orange-600 
                      disabled:bg-orange-300 disabled:cursor-not-allowed px-4 py-2"
                  >
                    {currentQuestionIndex === totalQuestions - 1 ? "Finish" : "Next →"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MCQread;