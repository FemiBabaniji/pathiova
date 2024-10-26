import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Link from 'next/link'; // Import Link from Next.js

interface NavbarProps {
  onPrevious: () => void;
  onNext: () => void;
  currentQuestion: number;
  totalQuestions: number;
  passages: number[];
}

export default function Navbar({
  onPrevious,
  onNext,
  currentQuestion,
  totalQuestions,
  passages
}: NavbarProps) {
  const totalWidth = passages.reduce((sum, passage) => sum + passage, 0);

  // Calculate which segment the current question belongs to
  let currentSegment = 0;
  let questionsBeforeCurrentSegment = 0;
  for (let i = 0; i < passages.length; i++) {
    if (currentQuestion > questionsBeforeCurrentSegment + passages[i]) {
      questionsBeforeCurrentSegment += passages[i];
      currentSegment++;
    } else {
      break;
    }
  }

  return (
    <nav className="bg-white p-4 flex items-center justify-between shadow-md">
      <Link href="/learning/reading-mastery"> {/* Replace with the target path */}
        <a className="p-2">
          <X className="w-6 h-6" />
        </a>
      </Link>
      <div className="flex-1 mx-4">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden flex">
          {passages.map((passageQuestions, index) => (
            <div
              key={index}
              className="h-full transition-all duration-300 ease-in-out"
              style={{
                width: `${(passageQuestions / totalWidth) * 100}%`,
                backgroundColor: index < currentSegment ? '#FFA500' : // Completed segments
                                 index === currentSegment ? '#FFA500' : // Current segment
                                 '#E5E7EB', // Future segments
                opacity: index === currentSegment ? 
                  ((currentQuestion - questionsBeforeCurrentSegment) / passageQuestions) : 
                  index < currentSegment ? 1 : 0.3
              }}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center">
        <button className="p-2" onClick={onPrevious}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className="p-2" onClick={onNext}>
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      <span className="ml-4">{currentQuestion}/{totalQuestions}</span>
    </nav>
  );
}
