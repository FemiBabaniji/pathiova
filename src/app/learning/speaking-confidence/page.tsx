'use client'

import React, { useState, useEffect, useRef } from "react"
import { Book, ChevronRight, Menu, Mic, MicOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, useInView, useAnimation } from "framer-motion"
import Link from "next/link"
import { useScore } from "@/app/context/ScoreContext"

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
)

const getProgressColor = (score: number) => {
  if (score >= 8) return "bg-green-500"
  if (score >= 7) return "bg-blue-500"
  if (score >= 6) return "bg-yellow-500"
  if (score >= 5) return "bg-orange-500"
  return "bg-pink-500"
}

export default function SpeakingConfidencePage() {
  const { getScore } = useScore()
  const [ieltsSections, setIeltsSections] = useState([
    {
      title: "Practice Exams",
      description: "Take practice exams to sharpen your skills for the IELTS Speaking test.",
      items: [
        { testId: 5, title: "Practice Exam 1", description: "Complete a full IELTS Speaking practice exam.", link: "/practice/speaking/exam1" },
        { testId: 6, title: "Practice Exam 2", description: "Another full IELTS Speaking practice exam.", link: "/practice/speaking/exam2" },
        { testId: 7, title: "Practice Exam 3", description: "Third full IELTS Speaking practice exam.", link: "/practice/speaking/exam3" },
        { testId: 8, title: "Practice Exam 4", description: "Fourth full IELTS Speaking practice exam.", link: "/practice/speaking/exam4" },
      ],
    },
    {
      title: "Part 1: Introduction and Interview",
      description: "Practice answering general questions about yourself and familiar topics.",
      items: [
        { testId: 1, title: "Personal Information", description: "Practice introducing yourself and answering personal questions.", link: "/formalt3/PI"},
        { testId: 2, title: "Work and Study", description: "Discuss your work or studies in a casual interview format.", link: "/speaking/part1/work-study" },
        { testId: 3, title: "Hobbies and Interests", description: "Talk about your hobbies and things you enjoy doing.", link: "/speaking/part1/hobbies" },
      ],
    },
    {
      title: "Part 2: Individual Long Turn",
      description: "Practice speaking at length on a given topic.",
      items: [
        { testId: 9, title: "Describing a Person", description: "Speak about a person you admire or know well.", link: "/speaking/part2/person" },
        { testId: 10, title: "Describing a Place", description: "Describe a place you've visited or would like to visit.", link: "/speaking/part2/place" },
        { testId: 11, title: "Describing an Event", description: "Talk about a memorable event in your life.", link: "/speaking/part2/event" },
      ],
    },
    {
      title: "Part 3: Two-way Discussion",
      description: "Practice engaging in a more in-depth discussion on abstract topics.",
      items: [
        { testId: 12, title: "Social Issues", description: "Discuss various social issues and their impacts.", link: "/speaking/part3/social" },
        { testId: 13, title: "Technology and Society", description: "Explore the role of technology in modern society.", link: "/speaking/part3/technology" },
        { testId: 14, title: "Environment and Sustainability", description: "Discuss environmental challenges and sustainable solutions.", link: "/speaking/part3/environment" },
      ],
    },
  ])

  useEffect(() => {
    const updatedSections = ieltsSections.map((section) => ({
      ...section,
      items: section.items.map((item) => ({
        ...item,
        score: getScore(item.testId) || "-",
      })),
    }))
    setIeltsSections(updatedSections)
  }, [getScore])

  const calculateAverageScore = () => {
    let totalScore = 0
    let count = 0

    ieltsSections.forEach((section) => {
      section.items.forEach((item) => {
        const score = getScore(item.testId)
        if (score && score !== "-") {
          totalScore += score
          count++
        }
      })
    })

    return count > 0 ? (totalScore / count).toFixed(1) : 0
  }

  const averageScore = parseFloat(calculateAverageScore())

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto p-4 mt-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 md:sticky md:top-4 md:self-start">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}>
                  <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {averageScore}
                  </div>
                </motion.div>
                <div className="text-sm font-medium text-pink-600 mb-2">IELTS SPEAKING</div>
                <CardTitle className="text-3xl font-bold">IELTS Speaking Practice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className={`h-2.5 rounded-full ${getProgressColor(averageScore)}`} 
                      style={{ width: `${(averageScore / 9) * 100}%` }}
                      role="progressbar"
                      aria-valuenow={averageScore}
                      aria-valuemin={0}
                      aria-valuemax={9}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-500 text-right">
                    Overall Progress: {averageScore} / 9
                  </div>
                </div>
                <p className="text-lg text-muted-foreground mb-6">Master the IELTS Speaking test with our comprehensive practice materials.</p>
                <div className="flex items-center text-base text-muted-foreground">
                  <Mic className="w-6 h-6 mr-2" />
                  14 Practice Tests
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div className="md:w-1/2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <div className="w-full rounded-md p-4">
            {ieltsSections.map((section, pathIndex) => (
              <LearningPathSection key={section.title} title={section.title} items={section.items} pathIndex={pathIndex} />
            ))}
          </div>
        </motion.div>
      </main>
    </>
  )
}

function LearningPathSection({ title, items, pathIndex }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.5, delay: pathIndex * 0.2 }} className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="space-y-4 relative">
        {items.map((item, index) => (
          <LearningPathItem key={item.title} score={item.score} title={item.title} description={item.description} link={item.link} delay={0.4 + index * 0.1} showConnector={index !== 0} index={index} totalItems={items.length} />
        ))}
      </div>
    </motion.div>
  )
}

function LearningPathItem({ score, title, description, link, delay, showConnector, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start({
        backgroundColor: ["rgba(249, 168, 212, 0.3)", "rgba(249, 168, 212, 1)", "rgba(249, 168, 212, 0.3)"],
        scale: [1, 1.05, 1],
        transition: {
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: index * 0.5,
        },
      })
    }
  }, [isInView, controls, index])

  const content = (
    <>
      <div className="flex items-center space-x-4 flex-grow">
        <div className="relative">
          {showConnector && (
            <motion.div className="absolute left-1/2 -top-8 w-1 h-8 bg-pink-200 transform -translate-x-1/2" initial={{ height: 0 }} animate={{ height: 32 }} transition={{ duration: 0.5, delay }} />
          )}
          <motion.div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 relative z-10" animate={controls} whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
            <span className="text-lg font-semibold text-pink-700">{score || "-"}</span>
          </motion.div>
        </div>
        <div className="flex-grow min-w-0">
          <h4 className="text-lg text-gray-800 truncate">{title}</h4>
          <p className="text-sm text-gray-700 truncate">{description}</p>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-pink-500 flex-shrink-0" />
    </>
  )

  return (
    <motion.div
      ref={ref}
      className="flex items-center justify-between space-x-4 p-4 rounded-lg cursor-pointer transition-all duration-300 hover:bg-pink-100 w-full"
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
    >
      {link ? (
        <Link href={link} className="flex items-center justify-between w-full">
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  )
}