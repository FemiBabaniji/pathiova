"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuizNavigation from "@/components/QuizNavigation";
import TestResultsRead from "@/components/Test-results-read";
import MultipleChoiceQuiz from "@/components/MultipleChoiceQuiz";
import TrueFalseNotGivenQuiz from "@/components/TrueFalseNotGivenQuiz";
import YesNoNotGivenQuiz from "@/components/YesNoNotGivenQuiz";
import HeadingMatchingQuiz from "@/components/HeadingMatchingQuiz";
import MatchingPairsQuiz from "@/components/MatchingPairsQuiz";
import SentenceCompletionQuiz from "@/components/SentenceCompletionQuiz";
import ShortAnswerQuiz from "@/components/ShortAnswerQuiz";

// Importing the IELTS Intro Component
import IELTSReadingTestIntro from "@/components/IELTS-reading-test-intro";

// Font URL from Adobe Typekit
const fontUrl = "https://use.typekit.net/gcd4kuc.css";

interface MatchingPair {
  id: string;
  text: string;
}

interface Question {
  id: number;
  type: string;
  sentence?: string;
  statement?: string;
  options?: string[];
  correctAnswer: string;
  items?: { id: string; content: string }[];
  headings?: string[];
  pairs?: MatchingPair[];
  matchingOptions?: string[];
  correctPairs?: { [key: string]: string };
}

interface Passage {
  title: string;
  passage: string;
  questions: Question[];
}

export default function DynamicQuiz({ params }: { params: { testId: string } }) {
  const [passages, setPassages] = useState<Passage[]>([]);
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string | { [key: string]: string } }>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isPracticeExam, setIsPracticeExam] = useState(false);
  const [showIntro, setShowIntro] = useState(true);  // <-- State to show intro page initially

  const { testId } = params;

  // Key for localStorage
  const localStorageKey = `quiz-${testId}-progress`;

  // Load the font
  useEffect(() => {
    const link = document.createElement("link");
    link.href = fontUrl;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const quizModule = await import(`@/data/READING-QUESTIONS/${testId}.json`);
        const quizData = quizModule.default;

        if (quizData && Array.isArray(quizData.passages)) {
          const parsedPassages = quizData.passages.map((passage: any) => ({
            ...passage,
            questions: passage.questions.map((question: any) => ({
              id: question.id,
              type: question.type,
              sentence: question.sentence || question.statement,
              options: question.options,
              correctAnswer: question.correctAnswer,
              items: question.items,
              headings: question.headings,
              pairs: question.pairs,
              matchingOptions: question.matchingOptions,
              correctPairs: question.correctPairs,
            })),
          }));

          setPassages(parsedPassages);
          if (quizData.isPracticeExam) {
            setIsPracticeExam(true);
            setTimeRemaining(quizData.timeLimit || 3600);
          }

          // Load progress from local storage
          const savedProgress = localStorage.getItem(localStorageKey);
          if (savedProgress) {
            const { savedAnswers, savedPassageIndex, savedQuestionIndex } = JSON.parse(savedProgress);
            setUserAnswers(savedAnswers || {});
            setCurrentPassageIndex(savedPassageIndex || 0);
            setCurrentQuestionIndex(savedQuestionIndex || 0);
          }
        } else {
          setError("Invalid data structure in the imported JSON file.");
        }
      } catch (err) {
        setError("Failed to load passages from JSON file.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [testId]);

  // Function to handle the "Continue" button on the intro page
  const handleStartQuiz = () => {
    setShowIntro(false); // Set intro state to false to show the quiz
  };

  const currentPassage = passages[currentPassageIndex];
  const currentQuestion = currentPassage?.questions[currentQuestionIndex];
  const totalQuestions = passages.reduce((acc, passage) => acc + passage.questions.length, 0);
  const currentQuestionNumber = passages.slice(0, currentPassageIndex).reduce((acc, passage) => acc + passage.questions.length, 0) + currentQuestionIndex + 1;

  const handleAnswerSubmit = (answer: string | { [key: string]: string }) => {
    const updatedAnswers = { ...userAnswers, [currentQuestion.id]: answer };
    setUserAnswers(updatedAnswers);

    // Save progress to localStorage
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        savedAnswers: updatedAnswers,
        savedPassageIndex: currentPassageIndex,
        savedQuestionIndex: currentQuestionIndex,
      })
    );
  };

  const handleNavigation = (direction: "next" | "back") => {
    let newPassageIndex = currentPassageIndex;
    let newQuestionIndex = currentQuestionIndex;

    if (direction === "back") {
      if (currentQuestionIndex > 0) {
        newQuestionIndex = currentQuestionIndex - 1;
      } else if (currentPassageIndex > 0) {
        newPassageIndex = currentPassageIndex - 1;
        newQuestionIndex = passages[currentPassageIndex - 1].questions.length - 1;
      }
    } else {
      if (currentQuestionIndex < currentPassage.questions.length - 1) {
        newQuestionIndex = currentQuestionIndex + 1;
      } else if (currentPassageIndex < passages.length - 1) {
        newPassageIndex = currentPassageIndex + 1;
        newQuestionIndex = 0;
      } else {
        setIsQuizComplete(true);
      }
    }

    // Update the state with new indices
    setCurrentPassageIndex(newPassageIndex);
    setCurrentQuestionIndex(newQuestionIndex);

    // Save progress to localStorage
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        savedAnswers: userAnswers,
        savedPassageIndex: newPassageIndex,
        savedQuestionIndex: newQuestionIndex,
      })
    );
  };

  const handleReset = () => {
    setIsQuizComplete(false);
    setCurrentPassageIndex(0);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    localStorage.removeItem(localStorageKey);
  };

  const renderQuizComponent = () => {
    if (!currentQuestion) return null;

    const commonProps = {
      questionData: {
        passage: currentPassage.passage,
        questions: [currentQuestion],
      },
      currentQuestionIndex: 0,
      onAnswerSubmit: handleAnswerSubmit,
      onNavigate: handleNavigation,
      userAnswer: userAnswers[currentQuestion.id],
    };

    switch (currentQuestion.type.toLowerCase()) {
      case "multiple choice":
        return <MultipleChoiceQuiz {...commonProps} />;
      case "true/false/not given":
        return <TrueFalseNotGivenQuiz {...commonProps} />;
      case "yes/no/not given":
        return <YesNoNotGivenQuiz {...commonProps} />;
      case "heading matching":
        return <HeadingMatchingQuiz {...commonProps} />;
      case "matching pairs":
        return <MatchingPairsQuiz {...commonProps} />;
      case "sentence completion":
        return <SentenceCompletionQuiz {...commonProps} />;
      case "short answer":
        return <ShortAnswerQuiz {...commonProps} />;
      default:
        return <div>Unsupported question type: {currentQuestion.type}</div>;
    }
  };

  // Render the intro page initially if `showIntro` is true
  if (showIntro) {
    return (
      <IELTSReadingTestIntro
        section="Reading"
        onContinue={handleStartQuiz} // Start the quiz when "Continue" is clicked
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-2xl">
          <CardContent className="text-center p-6">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-lg mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (passages.length === 0 || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-2xl">
          <CardContent className="text-center p-6">
            <h1 className="text-2xl font-bold mb-4">No questions available</h1>
            <p className="text-lg mb-6">Please check the question data and try again.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isQuizComplete) {
  const allQuestions = passages.flatMap((passage) => passage.questions);
  const feedbacks = allQuestions.map((question) => {
    const userAnswer = userAnswers[question.id];
    const correctAnswer = question.correctAnswer;

    // Check if userAnswer is an object (e.g., for heading matching or matching pairs)
    const isCorrect =
      typeof userAnswer === "object"
        ? JSON.stringify(userAnswer) === JSON.stringify(correctAnswer)
        : userAnswer === correctAnswer;

    return {
      answer: typeof userAnswer === "object" ? JSON.stringify(userAnswer, null, 2) : userAnswer,
      correctAnswer: typeof correctAnswer === "object" ? JSON.stringify(correctAnswer, null, 2) : correctAnswer,
      isCorrect,
      feedback: `You answered: ${
        typeof userAnswer === "object" ? JSON.stringify(userAnswer, null, 2) : userAnswer
      }`,
    };
  });

  return (
    <TestResultsRead
      feedbacks={feedbacks}
      totalQuestions={totalQuestions}
      onReset={handleReset}
      sendAverageScore={(score: number) => {
        console.log(`Average Score: ${score}`);
      }}
      testId={testId}
    />
  );
}


  return (
    <div className="flex flex-col min-h-screen bg-white" style={{ fontFamily: 'circe, sans-serif' }}>
      <QuizNavigation
        questionIndex={currentQuestionNumber - 1}
        totalQuestions={totalQuestions}
        onBack={() => handleNavigation("back")}
        onNext={() => handleNavigation("next")}
        onFinish={() => setIsQuizComplete(true)}
        timeRemaining={timeRemaining}
        isPracticeExam={isPracticeExam}
      />
      <main className="flex-1 container mx-auto px-4 py-8 mt-28">
        <Card className="w-full max-w-7xl mx-auto bg-transparent border-none">
          <CardContent className="p-6">
            <h1 className="text-5xl font-light mb-10 mt-8">{currentPassage.title}</h1>
            {renderQuizComponent()}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
