"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import Link from 'next/link';
import { Book, ChevronRight, Menu, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useScore } from "@/app/context/ScoreContext";

const Navbar = () => (
  <nav className="bg-transparent border-b-2 border-gray-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-2xl font-bold">
            pathova
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <button aria-label="Open menu">
            <Menu className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  </nav>
);

const getProgressColor = (score) => {
  if (score >= 7) return 'bg-green-500';
  if (score >= 6) return 'bg-green-400';
  if (score >= 5) return 'bg-green-300';
  if (score >= 4) return 'bg-green-200';
  return 'bg-green-100';
};

export default function Component() {
  const { getScore, refetchScores, stars } = useScore();
  const [ieltsSections, setIeltsSections] = useState([
    {
      title: "Practice Exams",
      description: "Take practice exams to sharpen your skills for the IELTS Writing test.",
      items: [
        { testId: 'PE1', title: "Practice Exam 1", description: "Complete a full IELTS Writing practice exam.", link: "/practice/exam1", score: 0 },
        { testId: 'PE2', title: "Practice Exam 2", description: "Another full IELTS Writing practice exam.", link: "/practice/exam2", score: 0 },
        { testId: 'PE3', title: "Practice Exam 3", description: "Third full IELTS Writing practice exam.", link: "/practice/exam3", score: 0 },
      ],
    },
    {
      title: "Section 1: Everyday Topics",
      description: "Practice reading everyday texts and extracting key information.",
      items: [
        { testId: 'ER1', title: "Practice Test 1", description: "Select the correct option based on the passage.", link: "/formalt2/ER1", score: 0 },
        { testId: 'ER2', title: "Practice Test 2", description: "Identify if the statement is true, false, or not given.", link: "/formalt2/ER2", score: 0 },
        { testId: 'ER3', title: "Practice Test 3", description: "Match information to the appropriate paragraph.", link: "/formalt2/ER3", score: 0 },
      ],
    },
    {
      title: "Section 2: Work-related Topics",
      description: "Read work-related documents such as contracts or job descriptions.",
      items: [
        { testId: 'WR1', title: "Practice Test 1", description: "Complete sentences using words from the text.", link: "/formalt2/WR1", score: 0 },
        { testId: 'WR2', title: "Practice Test 2", description: "Answer questions using words from the passage.", link: "/formalt2/WR2", score: 0 },
        { testId: 'WR3', title: "Practice Test 3", description: "Complete summaries using words from the text.", link: "/formalt2/WR3", score: 0 }
      ],
    },
    {
      title: "Section 3: General Interest Topics",
      description: "Tackle longer and more complex texts on general interest topics.",
      items: [
        { testId: 'GI1', title: "Practice Test 1", description: "Complete flow-charts using information from the text.", link: "/formalt2/GI1", score: 0 },
        { testId: 'GI2', title: "Practice Test 2", description: "Select multiple correct options for a question.", link: "/formalt2/GI2", score: 0 },
        { testId: 'GI3', title: "Practice Test 3", description: "Label diagrams using words from the passage.", link: "/formalt2/GI3", score: 0 }
      ],
    },
  ]);

  const updateScores = useCallback(async () => {
    await refetchScores();
    const updatedSections = ieltsSections.map(section => ({
      ...section,
      items: section.items.map(item => {
        const score = getScore(item.testId);
        console.log(`Score fetched for testId: ${item.testId} is ${score}`);
        return { ...item, score: score !== undefined ? Math.round(Number(score)) : undefined };
      })
    }));

    setIeltsSections(prevSections => {
      const isChanged = JSON.stringify(prevSections) !== JSON.stringify(updatedSections);
      if (isChanged) {
        console.log("Updating sections with new scores", updatedSections);
        return updatedSections;
      } else {
        console.log("No change detected, skipping state update.");
        return prevSections;
      }
    });
  }, [getScore, ieltsSections, refetchScores]);

  useEffect(() => {
    updateScores();

    const handleTestResultsCalculated = () => {
      updateScores();
    };

    window.addEventListener('testResultsCalculated', handleTestResultsCalculated);

    return () => {
      window.removeEventListener('testResultsCalculated', handleTestResultsCalculated);
    };
  }, [updateScores]);

  const averageScore = ieltsSections.reduce((total, section) => {
    const sectionScores = section.items
      .map(item => Math.round(item.score) || 0)
      .filter(score => score > 0);
    const sectionTotal = sectionScores.reduce((sum, score) => sum + score, 0);
    const sectionCount = sectionScores.length;
    return {
      total: total.total + sectionTotal,
      count: total.count + sectionCount
    };
  }, { total: 0, count: 0 });

  const finalAverageScore = averageScore.count > 0 ? averageScore.total / averageScore.count : 0;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4 mt-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 md:sticky md:top-4 md:self-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {finalAverageScore > 0 ? Math.round(finalAverageScore) : 'N/A'}
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
                    className="flex items-center bg-yellow-100 px-3 py-1 rounded-full"
                  >
                    <Star className="w-5 h-5 text-yellow-500 mr-1" />
                    <span className="text-yellow-700 font-semibold">{stars}</span>
                  </motion.div>
                </div>
                <div className="text-sm font-medium text-green-500 mb-2">IELTS READING · GENERAL TRAINING</div>
                <CardTitle className="text-3xl font-bold">IELTS Reading Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-base">
                    <span>Average IELTS Score</span>
                    <span className="font-medium">{finalAverageScore > 0 ? finalAverageScore.toFixed(1) : 'N/A'} / 9.0</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(finalAverageScore)}`} 
                      style={{ width: `${(finalAverageScore / 9) * 100}%` }}
                      role="progressbar"
                      aria-valuenow={finalAverageScore}
                      aria-valuemin={0}
                      aria-valuemax={9}
                    ></div>
                  </div>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  Master the IELTS Reading test with our comprehensive practice materials.
                </p>
                <div className="flex items-center text-base text-muted-foreground">
                  <Book className="w-6 h-6 mr-2" aria-hidden="true" />
                  <span>40 Practice Tests</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full rounded-md p-4">
            {ieltsSections.map((section, pathIndex) => (
              <LearningPathSection
                key={section.title}
                title={section.title}
                items={section.items}
                pathIndex={pathIndex}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}

function LearningPathSection({ title, items, pathIndex }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: pathIndex * 0.2 }}
      className="mb-8"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {title}
      </h3>
      <div className="space-y-4 relative">
        {items.map((item, index) => (
          <LearningPathItem
            key={item.title}
            score={item.score}
            title={item.title}
            description={item.description}
            link={item.link}
            delay={0.4 + index * 0.1}
            showConnector={index !== 0}
            index={index}
            totalItems={items.length}
          />
        ))}
      </div>
    </motion.div>
  );
}

function LearningPathItem({ score, title, description, link, delay, showConnector, index, totalItems }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  const displayScore = score !== undefined && score !== null
    ? (typeof score === 'number' ? Math.round(score) : score)
    : 'N/A';

  console.log(`LearningPathItem - testId: ${title}, score: ${score}, displayScore: ${displayScore}`);

  useEffect(() => {
    if (isInView) {
      controls.start({
        backgroundColor: [
          "rgba(220, 252, 231, 0.3)",
          "rgba(220, 252, 231, 1)",
          "rgba(220, 252, 231, 0.3)",
        ],
        scale: [1, 1.05, 1],
        transition: {
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: index * 0.5,
        },
      });
    }
  }, [isInView, controls, index]);

  const content = (
    <>
      <div className="flex items-center space-x-4 flex-grow">
        <div className="relative">
          {showConnector && (
            <motion.div 
              className="absolute left-1/2 -top-8 w-1 h-8 bg-green-100 transform -translate-x-1/2"
              initial={{ height: 0 }}
              animate={{ height: 32 }}
              transition={{ duration: 0.5, delay }}
            />
          )}
          <motion.div 
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
            animate={controls}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <span className="text-lg font-semibold text-green-700">
              {typeof displayScore === 'number' ? displayScore : displayScore}
            </span>
          </motion.div>
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="text-lg text-gray-800 truncate">{title}</h4>
          <p className="text-sm text-gray-700 truncate">{description}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-green-400 flex-shrink-0" aria-hidden="true" />
    </>
  );

  return (
    <motion.div
      ref={ref}
      className="flex items-center justify-between space-x-4 p-4 rounded-lg cursor-pointer transition-all duration-300  hover:bg-green-50 w-full"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        scale: 1.03,
        translateX: 5,
        translateY: 5,
        boxShadow: "0 10px 20px -5px rgba(0, 0, 0, 0.1)",
      }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {link ? (
        <Link href={link} className="flex items-center justify-between w-full" aria-label={`Go to ${title}`}>
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  );
}