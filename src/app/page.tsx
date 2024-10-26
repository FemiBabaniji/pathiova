"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import MasterConceptsSection from "@/components/master-concepts-section"
import GuidedCoursesSection from "@/components/guided-courses-section"
import SignInButton from "@/components/SignInButton"
import GetStartedButton from "@/components/GetStartedButton"

function Navbar({ visible }: { visible: boolean }) {
  return (
    <nav className={`fixed top-0 left-0 right-0 bg-white shadow-sm z-50 transition-transform duration-300 ${
      visible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="font-bold text-xl">
              IELTS Mastery
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <SignInButton
              text="Log in"
              className="bg-white border border-gray-300 text-black py-2 px-4 rounded shadow hover:bg-gray-100 text-center"
            />
            <GetStartedButton
              text="Get started"
              className="bg-orange-500 border border-orange-500 text-white py-2 px-4 rounded shadow hover:bg-orange-600 hover:border-orange-600 text-center"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function LandingPage() {
  const [showNav, setShowNav] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar visible={showNav} />

      <main className="flex-grow">
        <div className="min-h-screen flex flex-col">
          <section className="flex-grow flex items-center bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="md:w-3/5">
                    <h1 className="text-6xl font-bold mb-6">
                      Achieve Your <span className="text-orange-500">IELTS Band</span>
                    </h1>
                    <p className="text-2xl mb-8">
                      Prepare for the IELTS exam with interactive lessons, real-time feedback, and dynamic practice sessions.
                    </p>
                    <GetStartedButton
                      text="Get started"
                      className="bg-orange-500 border border-orange-500 text-white py-4 px-8 rounded shadow hover:bg-orange-600 hover:border-orange-600 text-center"
                    />
                  </div>
                  <div className="md:w-2/5 relative h-[400px]">
                    <Image
                      src="/placeholder.svg?height=400&width=400"
                      alt="IELTS preparation illustration"
                      layout="fill"
                      objectFit="contain"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gray-100 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center flex-wrap gap-4">
                {[
                  { name: "Reading", icon: "📘" },
                  { name: "Writing", icon: "✍️" },
                  { name: "Listening", icon: "🎧" },
                  { name: "Speaking", icon: "💬" },
                  { name: "Practice Exams", icon: "📝" },
                ].map((subject) => (
                  <div key={subject.name} className="flex items-center space-x-2">
                    <span className="text-2xl" aria-hidden="true">{subject.icon}</span>
                    <span className="font-medium">{subject.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <MasterConceptsSection />

        <GuidedCoursesSection />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <section className="py-20 text-center">
            <h2 className="text-3xl font-bold mb-8">Join Thousands of IELTS Students Worldwide</h2>
            <div className="flex justify-center space-x-8 mb-8">
              <div>
                <p className="font-bold text-4xl">4.9/5</p>
                <p className="text-sm">App Store Rating</p>
              </div>
              <div>
                <p className="font-bold text-4xl">60K+</p>
                <p className="text-sm">Enrolled Students</p>
              </div>
            </div>
            <p className="mb-8 max-w-2xl mx-auto text-lg">
              Our courses are created by IELTS experts, language instructors, and examiners to help you achieve your target band score. Learn from the best to master the test.
            </p>
            <GetStartedButton
              text="Get started"
              className="bg-orange-500 border border-orange-500 text-white py-4 px-8 rounded shadow hover:bg-orange-600 hover:border-orange-600 text-center"
            />
          </section>
        </div>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Students Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah L.",
                  score: "Band 8.5",
                  testimonial: "IELTS Mastery helped me achieve my dream score. The practice tests were spot-on!"
                },
                {
                  name: "Ahmed K.",
                  score: "Band 7.0",
                  testimonial: "The speaking modules boosted my confidence. I felt well-prepared on exam day."
                },
                {
                  name: "Maria G.",
                  score: "Band 8.0",
                  testimonial: "The writing feedback was invaluable. It helped me improve my essay structure significantly."
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-gray-600 mb-4">"{testimonial.testimonial}"</p>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">Achieved {testimonial.score}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
