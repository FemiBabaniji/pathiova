'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronRight, BookOpen, Mic, PenTool, Menu, Globe, GraduationCap, Headphones } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useScore } from '@/app/context/ScoreContext';

const fontUrl = "https://use.typekit.net/gcd4kuc.css";

const Navbar = () => (
  <nav className="bg-white border-b-2 border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-2xl font-bold hover:text-orange-600 transition-colors">
            pathova
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="text-gray-600" />
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

const WelcomeBanner = ({ userName, currentBand }: { userName: string; currentBand: number }) => {
  const bandColor = getBandColor(currentBand);
  const progressPercentage = (currentBand / 9) * 100;

  return (
    <div className="bg-gradient-to-b from-[#fdf6e9] to-[#f7e8cb] p-8 rounded-3xl mb-8 shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="w-full md:w-1/2 mb-6 md:mb-0">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome back, {userName}!</h2>
          <p className="text-xl text-gray-700 mb-6">
            Premium users are <span className="text-[#b8860b] font-semibold">6x</span> more likely to reach their path
          </p>
          <button className="bg-[#7ac142] text-white font-semibold py-3 px-8 rounded-full text-lg hover:bg-[#68a639] transition-colors duration-300">
            Learn more
          </button>
        </div>
        <div className="w-full md:w-1/2 md:pl-8">
          <div className="bg-transparent p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-800">Current IELTS Band</h3>
              <p className={`text-5xl font-bold ${bandColor}`}>{currentBand.toFixed(1)}</p>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Progress to Band 9.0</span>
                <span className="text-sm font-medium text-gray-600">{progressPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${bandColor.replace('text', 'bg')}`}
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExpandableSection = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6 bg-transparent border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            {icon}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
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
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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

const LearningResources = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-6 bg-transparent border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-gray-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold mb-2">Learning Resources</h2>
            <p className="text-gray-600 mb-4">Access a wide range of IELTS preparation materials to boost your skills</p>
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
              <div className="grid grid-cols-2 gap-4">
                <ResourceSection
                  icon={<BookOpen className="w-6 h-6 text-white" />}
                  title="Reading"
                  items={['Practice Tests', 'Strategies', 'Vocabulary']}
                  color="bg-blue-500"
                />
                <ResourceSection
                  icon={<Mic className="w-6 h-6 text-white" />}
                  title="Speaking"
                  items={['Mock Interviews', 'Pronunciation', 'Fluency']}
                  color="bg-green-500"
                />
                <ResourceSection
                  icon={<PenTool className="w-6 h-6 text-white" />}
                  title="Writing"
                  items={['Essay Templates', 'Grammar', 'Task 1 & 2']}
                  color="bg-purple-500"
                />
                <ResourceSection
                  icon={<Headphones className="w-6 h-6 text-white" />}
                  title="Listening"
                  items={['Audio Samples', 'Note-taking', 'Comprehension']}
                  color="bg-yellow-500"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        className="w-full mt-4 py-3 px-4 text-gray-800 bg-transparent border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-colors duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Explore Resources
      </motion.button>
    </div>
  );
};

const ResourceSection = ({ icon, title, items, color }: { icon: React.ReactNode; title: string; items: string[]; color: string }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-start">
    <div className={`${color} rounded-full p-2 mb-2`}>
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <ul className="text-sm text-gray-600 space-y-1">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);



const LearningPackageCard = ({ icon, title, subtitle, color, link }: { icon: React.ReactNode; title: string; subtitle: string; color: string; link: string }) => (
  <Link href={link} className="block">
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-200">
      <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
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

    const calculatedAverage = count > 0 ? totalScore / count : 0;
    setAverageScore(calculatedAverage);
  }, [getScore]);

  useEffect(() => {
    const link = document.createElement("link")
    link.href = fontUrl
    link.rel = "stylesheet"
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'circe, sans-serif' }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeBanner userName={userName} currentBand={averageScore} />
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2 space-y-8">
            <OnlineConsultation />
            <LearningResources />
          </div>
          <div className="w-full lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">IELTS Learning Packages</h2>
              <div className="grid grid-cols-2 gap-4">
                <LearningPackageCard
                  icon={<BookOpen className="w-8 h-8 text-white" />}
                  title="Listening Skills"
                  subtitle="IELTS"
                  color="bg-yellow-500"
                  link="/learning/listening-skills"
                />
                <LearningPackageCard
                  icon={<BookOpen className="w-8 h-8 text-white" />}
                  title="Reading Mastery"
                  subtitle="IELTS "
                  color="bg-green-500"
                  link="/learning/reading-mastery"
                />
                <LearningPackageCard
                  icon={<PenTool className="w-8 h-8 text-white" />}
                  title="Writing Task"
                  subtitle="IELTS "
                  color="bg-purple-500"
                  link="/learning/writing-task-masterclass"
                />
                <LearningPackageCard
                  icon={<Mic className="w-8 h-8 text-white" />}
                  title="Speaking Confidence"
                  subtitle="IELTS"
                  color="bg-pink-500"
                  link="/learning/speaking-confidence"
                />
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}