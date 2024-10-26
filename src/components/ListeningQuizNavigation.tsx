import React from 'react';
import { X, ChevronLeft, ChevronRight, Zap, Play, Pause } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface ListeningQuizNavigationProps {
  questionIndex: number;
  totalQuestions: number;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
  audioProgress: number;
  audioDuration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (value: number[]) => void;
}

export default function ListeningQuizNavigation({
  questionIndex,
  totalQuestions,
  onBack,
  onNext,
  onFinish,
  audioProgress,
  audioDuration,
  isPlaying,
  onPlayPause,
  onSeek
}: ListeningQuizNavigationProps) {
  
  const handleGoBack = () => {
    window.history.back();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col">
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            className="text-gray-800 hover:text-gray-600"
            onClick={handleGoBack}
            aria-label="Go back"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="flex-1 mx-8">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300 ease-in-out"
                style={{
                  width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
                }}
                role="progressbar"
                aria-valuenow={(questionIndex + 1)}
                aria-valuemin={0}
                aria-valuemax={totalQuestions}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onBack}
              disabled={questionIndex === 0}
              aria-label="Previous question"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="text-xl font-semibold">
              {questionIndex + 1} / {totalQuestions}
            </span>
            <Zap className="w-6 h-6 text-yellow-400" aria-hidden="true" />
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={questionIndex === totalQuestions - 1 ? onFinish : onNext}
              aria-label={questionIndex === totalQuestions - 1 ? "Finish quiz" : "Next question"}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="mt-24 mb-6 max-w-3xl mx-auto w-full">
        <div className="bg-gray-100 p-4 rounded-lg">
          <Button
            onClick={onPlayPause}
            variant="outline"
            size="lg"
            className="w-full mb-4 flex items-center justify-center space-x-2"
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? (
              <>
                <Pause className="h-6 w-6" />
                <span>Pause Audio</span>
              </>
            ) : (
              <>
                <Play className="h-6 w-6" />
                <span>Play Audio</span>
              </>
            )}
          </Button>
          <Slider
            value={[audioProgress]}
            onValueChange={onSeek}
            max={100}
            step={0.1}
            className="w-full"
            aria-label="Audio progress"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{formatTime(audioProgress * audioDuration / 100)}</span>
            <span>{formatTime(audioDuration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}