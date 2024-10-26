'use client';

import React, { useState, useEffect } from 'react';
import { Search, Gift, ShoppingCart, Menu, Globe, BookOpen, Mic, PenTool, ChevronUp, ChevronDown, Satellite } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useScore } from '@/app/context/ScoreContext';

const Navbar = () => (
  <nav className="bg-transparent border-b-2 border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-2xl font-bold hover:text-orange-600 transition-colors">
            pathova
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="text-gray-600" />
          <button className="px-4 py-2 text-orange-600 border-2 border-orange-600 rounded-full hover:bg-orange-600 hover:text-white transition-colors duration-200">
            Gift premium
          </button>
          <ShoppingCart className="text-gray-600" />
          <Menu className="text-gray-600" />
        </div>
      </div>
    </div>
  </nav>
);

const getBandColor = (score: number) => {
  if (score >= 8) return 'text-green-500';
  if (score >= 7) return 'text-blue-500';
  if (score >= 6) return 'text-yellow-500';
  if (score >= 5) return 'text-orange-500';
  return 'text-red-500';
};

const ProgressTracker = ({ currentBand }: { currentBand: number }) => {
  const bandColor = getBandColor(currentBand);
  const progressPercentage = (currentBand / 9) * 100;

  return (
    <div className="p-6 bg-transparent border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className={`text-4xl font-bold ${bandColor}`}>{currentBand}</h2>
          <p className="text-sm text-gray-600">Current IELTS Band</p>
        </div>
      </div>
      <p className="mb-4">Improve your score to reach your target band</p>
      <div className="w-full h-4 mb-4 bg-gray-200 rounded-full">
        <div
          className={`h-4 rounded-full ${bandColor.replace('text', 'bg')}`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-sm">
        <div>
          <p className="font-bold">{currentBand} / 9.0</p>
          <p className="text-gray-600">Current / Target</p>
        </div>
        <div>
          <p className="font-bold">15</p>
          <p className="text-gray-600">Practice tests taken</p>
        </div>
        <div>
          <p className="font-bold">4</p>
          <p className="text-gray-600">Skills improved</p>
        </div>
      </div>
    </div>
  );
};

const OnlineConsultation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6 bg-transparent border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Globe className="w-6 h-6 text-gray-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold mb-2">Online Consultation</h2>
            <p className="text-gray-600 mb-4">Receive your customised immigration consultant report to start your immigration journey</p>
          </div>
        </div>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-400 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <motion.div
              className="mt-4 pt-4 border-t-2 border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-2">Consultation Details:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Complete a series of multiple-choice questions designed to assess your current immigration goals and readiness</li>
                <li>Receive a personalized report providing an analysis of your strengths and areas requiring more preparation</li>
                <li>Tailored strategies for each step of the immigration process based on your specific situation</li>
                <li>Recommendations for resources, documents, and next steps to streamline your immigration journey</li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        className="w-full mt-4 py-3 px-4 text-gray-800 bg-transparent border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-colors duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Get Your Report
      </motion.button>
    </div>
  );
};

const JumpBackIn = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Jump back in</h2>
    <div className="bg-transparent border-2 border-gray-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="h-48 bg-gradient-to-b from-green-400 to-green-100">
        <div className="h-full flex items-center justify-center">
          <div className="w-24 h-24 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
            <Satellite className="w-12 h-12 text-green-800" />
          </div>
        </div>
      </div>
      <div className="p-6">
        <p className="text-green-600 font-semibold mb-2">Reading Mastery • Section 2</p>
        <h3 className="text-2xl font-bold mb-4">Flow Chart Completion</h3>
        <motion.button
          className="w-full py-3 px-4 text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue path
        </motion.button>
      </div>
    </div>
  </div>
);

const LearningPackageCard = ({ icon, title, description, color, link }: { icon: React.ReactNode, title: string, description: string, color: string, link: string }) => (
  <Link href={link} className="block p-4 bg-transparent border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex items-start mb-2">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mr-3`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
  </Link>
);

export default function Dashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'Guest';
  const { getScore } = useScore();

  const [averageScore, setAverageScore] = useState<number>(0);

  useEffect(() => {
    const writingTaskIds = [1, 2, 3, 4, 5, 6, 7];
    let totalScore = 0;
    let count = 0;

    writingTaskIds.forEach((taskId) => {
      const score = getScore(taskId);
      if (score) {
        totalScore += score;
        count++;
      }
    });

    const calculatedAverage = count > 0 ? Math.round(totalScore / count) : 0;
    setAverageScore(calculatedAverage);
  }, [getScore]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-xl font-semibold">Welcome, {userName}</h1>
              <ProgressTracker currentBand={averageScore} />
              <OnlineConsultation />
            </div>
            <div className="space-y-6">
              <div>
                <h2 className="mb-4 text-xl font-semibold">Learning Packages</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <LearningPackageCard
                    icon={<BookOpen className="w-5 h-5 text-yellow-600" />}
                    title="Listening Skills"
                    description="Hone your listening skills with variety of practice questions."
                    color="bg-yellow-100"
                    link="/learning/listening-skills"
                  />
                  <LearningPackageCard
                    icon={<BookOpen className="w-5 h-5 text-green-600" />}
                    title="Reading Mastery"
                    description="Enhance reading comprehension with targeted practice exercises."
                    color="bg-green-100"
                    link="/learning/reading-mastery"
                  />
                  <LearningPackageCard
                    icon={<PenTool className="w-5 h-5 text-purple-600" />}
                    title="Writing Task Masterclass"
                    description="Develop essay and report writing skills with expert guidance and model answers."
                    color="bg-purple-100"
                    link="/learning/writing-task-masterclass"
                  />
                  <LearningPackageCard
                    icon={<Mic className="w-5 h-5 text-red-600" />}
                    title="Speaking Confidence"
                    description="Boost speaking confidence with drills and mock interviews."
                    color="bg-red-100"
                    link="/learning/speaking-confidence"
                  />
                </div>
              </div>
              <JumpBackIn />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}