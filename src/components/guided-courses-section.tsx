"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"

const categories = [
  "Reading Practice",
  "Writing Preparation",
  "Listening Skills",
  "Speaking Practice",
  "Full-Length Tests"
]

const courses = {
  "Reading Practice": [
    "Skimming and Scanning Techniques",
    "Academic Passage Analysis",
    "True/False/Not Given Questions",
    "Matching Headings",
    "Summary Completion",
  ],
  "Writing Preparation": [
    "Task 1: Data Interpretation",
    "Task 2: Essay Structure",
    "Academic Vocabulary Building",
    "Coherence and Cohesion",
    "Grammar for IELTS Writing",
  ],
  "Listening Skills": [
    "Note-taking Strategies",
    "Multiple Choice Questions",
    "Map and Diagram Labelling",
    "Sentence Completion",
    "Recognizing Signpost Words",
  ],
  "Speaking Practice": [
    "Part 1: Introduction and Interview",
    "Part 2: Cue Card Preparation",
    "Part 3: Discussion Skills",
    "Pronunciation Improvement",
    "Expanding Vocabulary Range",
  ],
  "Full-Length Tests": [
    "Academic Reading Full Test",
    "Academic Writing Full Test",
    "Listening Full Test",
    "Speaking Full Test Simulation",
    "Computer-Delivered IELTS Practice",
  ]
}

const sectionDescriptions = {
  "Reading Practice": "Improve your reading skills with interactive passages and question types similar to the IELTS exam. Get instant feedback to boost your comprehension and speed.",
  "Writing Preparation": "Learn how to structure your essays and letters for the writing section. Our real-time feedback helps you improve your grammar, coherence, and argument development.",
  "Listening Skills": "Practice listening to various accents and speech rates with our dynamic listening exercises, preparing you for real exam conditions.",
  "Speaking Practice": "Build your confidence for the speaking section with simulated speaking tasks and AI feedback on pronunciation, fluency, and vocabulary usage.",
  "Full-Length Tests": "Experience full-length IELTS practice tests under timed conditions to simulate the real exam environment and improve your overall performance.",
}

export default function GuidedCoursesSection() {
  const [activeCategory, setActiveCategory] = useState("Reading Practice")

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12">Master Every Section of the IELTS Exam</h2>
        
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <div
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  activeCategory === category
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {category}
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4">{activeCategory}</h3>
            <p className="mb-6 text-gray-600">{sectionDescriptions[activeCategory as keyof typeof sectionDescriptions]}</p>
            <h4 className="font-semibold mb-4">Courses in this section:</h4>
            <ul className="space-y-2">
              {courses[activeCategory as keyof typeof courses]?.map((course) => (
                <li key={course} className="text-gray-800">
                  {course}
                </li>
              ))}
            </ul>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt={`${activeCategory} preview`}
                width={600}
                height={400}
                className="w-full h-auto object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{activeCategory}</h3>
                <p className="text-sm text-gray-600">
                  Interactive preview for {activeCategory.toLowerCase()} courses.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}