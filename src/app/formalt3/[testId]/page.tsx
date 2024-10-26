'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, CheckCircle, Loader2, RefreshCw, Pause } from 'lucide-react';
import QuizNavigation from '@/components/QuizNavigation';
import FeedbackSpeaking from '@/components/FeedbackSpeaking';

interface Question {
  id: number;
  text: string;
  part: number;
}

interface QuestionsData {
  testId: string;
  title: string;
  questions: Question[];
}

interface Scores {
  fluencyAndCoherence: number;
  lexicalResource: number;
  grammaticalRangeAndAccuracy: number;
  pronunciation: number;
  overallBandScore: number;
}

export default function SpeakingPracticePage({ params }: { params: { testId: string } }) {
  const [questionsData, setQuestionsData] = useState<QuestionsData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [scores, setScores] = useState<Scores | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRetryMode, setIsRetryMode] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const { testId } = params;
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadData();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testId]);

  const loadData = async () => {
    try {
      console.log(`Loading questions for testId: ${testId}`);
      const questionsModule = await import(`@/data/SPEAKING-QUESTIONS/${testId}.json`);
      const data = questionsModule.default as QuestionsData;
      console.log('Questions loaded:', data);
      setQuestionsData(data);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError("Failed to load questions from JSON file.");
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      console.log('Starting recording...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      chunks.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
          console.log('Data chunk recorded:', event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/wav' });
        console.log('Audio Blob Size:', blob.size);
        console.log('Audio Blob Type:', blob.type);

        if (blob.size > 0) {
          setAudioBlob(blob);
          const audioURL = URL.createObjectURL(blob);
          setAudioURL(audioURL);
          console.log('Audio Blob URL:', audioURL);
        } else {
          console.error('Audio Blob is empty! No audio recorded.');
        }
        chunks.current = [];
        console.log('Recording stopped. Blob created:', blob);
      };

      recorder.start();
      console.log('Recording started.');

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      console.log('Recording stopped.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      setIsPaused(true);
      console.log('Recording paused.');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      setIsPaused(false);
      console.log('Recording resumed.');
    }
  };

  const handleStartRecording = useCallback(() => {
    startRecording();
    setFeedback('');
    setScores(null);
    setIsRetryMode(false);
    setError(null);
  }, [startRecording, setFeedback, setScores, setIsRetryMode, setError]);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      console.log('Recording stopped.');
    }
  }, [mediaRecorder]);

  const handlePauseRecording = useCallback(() => {
    if (isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  }, [isPaused, resumeRecording, pauseRecording]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmitRecording = useCallback(async () => {
    if (!audioBlob || !questionsData) {
      setError('No recording available. Please record your answer before submitting.');
      console.error('No audio blob or questions data available');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log('Submitting recording for transcription...');
      console.log('Audio Blob:', audioBlob);

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const transcriptionResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const transcriptionData = await transcriptionResponse.json();
      console.log('Full transcription response:', transcriptionData);

      if (!transcriptionResponse.ok) {
        console.error('Transcription failed with status:', transcriptionResponse.status);
        throw new Error(`Failed to transcribe audio: ${transcriptionData.error || 'Unknown error'}`);
      }


      console.log('Sending transcription to feedback generation API...');
      const feedbackResponse = await fetch('/api/generate-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questionsData.questions[currentQuestionIndex].text,
          transcribedAnswer: transcriptionData.transcription,
        }),
      });

      const feedbackData = await feedbackResponse.json();
      console.log('Full feedback response:', feedbackData);

      if (!feedbackResponse.ok) {
        console.error('Feedback generation failed with status:', feedbackResponse.status);
        throw new Error(`Failed to generate feedback: ${feedbackData.error || 'Unknown error'}`);
      }

      setFeedback(feedbackData.feedback);
      setScores(feedbackData.scores);
      console.log('Feedback received:', feedbackData.feedback);
      console.log('Scores received:', feedbackData.scores);

    } catch (error) {
      console.error('Error processing recording or generating feedback:', error);
      setError('An error occurred while processing your recording or generating feedback. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRetryMode(true);
    }
  }, [audioBlob, questionsData, currentQuestionIndex]);

  const handleRetry = useCallback(() => {
    setAudioBlob(null);
    setAudioURL(null);
    setFeedback('');
    setScores(null);
    setIsRetryMode(false);
    setError(null);
    setRecordingTime(0);
    console.log('Retrying...');
  }, []);

  const handleNext = useCallback(() => {
    if (questionsData && currentQuestionIndex < questionsData.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      handleRetry();
      console.log('Next question');
    }
  }, [currentQuestionIndex, questionsData, handleRetry]);

  const handleBack = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      handleRetry();
      console.log('Previous question');
    }
  }, [currentQuestionIndex, handleRetry]);

  const handleFinish = useCallback(() => {
    console.log('Quiz finished');
  }, []);

  if (loading) {
    return <div>Loading...</div>;
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

  if (!questionsData || questionsData.questions.length === 0) {
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

  const currentQuestion = questionsData.questions[currentQuestionIndex];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <QuizNavigation
        questionIndex={currentQuestionIndex}
        totalQuestions={questionsData.questions.length}
        onBack={handleBack}
        onNext={handleNext}
        onFinish={handleFinish}
      />

      <main className="flex-1 container mx-auto px-4 py-8 mt-24">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-2/3 p-6 border-r border-gray-200">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl font-bold">Speaking Task - Part {currentQuestion.part}</CardTitle>
                </CardHeader>
                <div className="mt-4 space-y-4">
                  <p className="text-lg">{currentQuestion.text}</p>
                  <div className="w-full h-px bg-gray-200 my-4"></div>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-48 h-48">
                      <div className="absolute inset-0 rounded-full bg-pink-100 flex items-center justify-center">
                        <Mic className={`h-24 w-24 ${isRecording ? 'text-pink-500' : 'text-gray-400'}`} />
                      </div>
                      {isRecording && (
                        <div className="absolute inset-0 rounded-full border-4 border-pink-500 animate-ping"></div>
                      )}
                    </div>
                    <div className="text-4xl font-bold text-gray-700">{formatTime(recordingTime)}</div>
                    <div className="flex space-x-4">
                      <Button
                        className={`py-3 px-6 text-lg rounded-full ${
                          isRecording
                            ? "bg-pink-500 hover:bg-pink-600 text-white"
                            : "bg-white border border-pink-300 text-pink-500 hover:bg-pink-50"
                        }`}
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="mr-2 h-6 w-6" /> Stop
                          </>
                        ) : (
                          <>
                            <Mic className="mr-2 h-6 w-6" /> Start
                          </>
                        )}
                      </Button>
                      {isRecording && (
                        <Button
                          className="py-3 px-6 text-lg rounded-full bg-white border border-pink-300 text-pink-500 hover:bg-pink-50"
                          onClick={handlePauseRecording}
                        >
                          {isPaused ? (
                            <>
                              <Mic className="mr-2 h-6 w-6" /> Resume
                            </>
                          ) : (
                            <>
                              <Pause className="mr-2 h-6 w-6" />Pause
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                    {audioURL && (
                      <div className="mt-6 w-full">
                        <h3 className="text-lg font-semibold mb-2">Playback  Recording</h3>
                        <audio
                          controls
                          src={audioURL}
                          className="w-full"
                          onPlay={() => console.log('Audio started playing')}
                          onError={(e) => console.error('Audio playback error:', e)}
                        ></audio>
                      </div>
                    )}
                    {audioURL && (
                      <div>
                        <a href={audioURL} download="recording.wav" className="text-blue-500 hover:underline">
                          Download Recording
                        </a>
                      </div>
                    )}
                  </div>
                  {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>
              </div>
              <div className="w-full md:w-1/3 p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl font-bold">Feedback</CardTitle>
                </CardHeader>
                {feedback && scores ? (
                  <FeedbackSpeaking feedback={feedback} scores={scores} />
                ) : (
                  <p className="mt-4 text-lg text-gray-500">Record your answer and click "Submit Recording" to receive feedback.</p>
                )}
                <Button
                  className="flex items-center justify-center w-full mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
                  onClick={isRetryMode ? handleRetry : handleSubmitRecording}
                  disabled={isLoading || isRecording || !audioBlob}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isRetryMode ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2" /> Retry
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" /> Submit Recording
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}