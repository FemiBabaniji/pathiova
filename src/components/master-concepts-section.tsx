"use client"

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

const features = [
  {
    title: "Effective, hands-on learning",
    description: "Visual, interactive lessons make concepts feel intuitive — so even complex ideas just click. Our real-time feedback and simple explanations make learning efficient.",
    image: "/placeholder.svg?height=300&width=400",
    alt: "Graph showing learning curve"
  },
  {
    title: "Learn at your level",
    description: "Students and professionals alike can hone dormant skills or learn new ones. Progress through lessons and challenges tailored to your level. Designed for ages 13 to 113.",
    image: "/placeholder.svg?height=300&width=400",
    alt: "Adjustable robot figure representing personalized learning"
  },
  {
    title: "Guided bite-sized lessons",
    description: "We make it easy to stay on track, see your progress, and build your problem-solving skills one concept at a time.",
    image: "/placeholder.svg?height=300&width=400",
    alt: "Mobile and desktop screens showing lesson progress"
  },
  {
    title: "Stay motivated",
    description: "Form a real learning habit with fun content that's always well-paced, game-like progress tracking, and friendly reminders.",
    image: "/placeholder.svg?height=300&width=400",
    alt: "Calendar with progress tracking"
  }
]

export default function MasterConceptsSection() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const featuresRef = useRef<(HTMLDivElement | null)[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveFeature(Number(entry.target.id))
          }
        })
      },
      { threshold: 0.5 }
    )

    featuresRef.current.forEach((feature) => {
      if (feature) observer.observe(feature)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
        const totalScrollableHeight = scrollHeight - clientHeight
        const progress = (scrollTop / totalScrollableHeight) * 100
        setScrollProgress(progress)
      }
    }

    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-8 sm:px-16 lg:px-24">
        <div className="flex flex-col md:flex-row min-h-[700px]">
          <div className="md:w-3/5 flex justify-center items-center relative order-2 md:order-1">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200">
              <div 
                className="w-1 bg-orange-500 transition-all duration-300"
                style={{
                  height: `${scrollProgress}%`,
                }}
              />
            </div>
            <div 
              ref={scrollContainerRef}
              className="w-full max-w-md overflow-y-auto max-h-[600px] py-12 pl-8 custom-scrollbar"
            >
              {features.map((feature, index) => (
                <div
                  key={index}
                  id={index.toString()}
                  ref={(el) => (featuresRef.current[index] = el)}
                  className={`mb-16 transition-all duration-300 ${
                    activeFeature === index ? 'scale-105' : 'scale-100'
                  }`}
                >
                  <div className="max-w-sm mx-auto text-center"> {/* Center content here */}
                    <h3 className="text-xl font-normal mb-4 text-black">{feature.title}</h3>
                    <p className="text-gray-600 mb-6">{feature.description}</p>
                    <div className="flex justify-center">
                      <Image
                        src={feature.image}
                        alt={feature.alt}
                        width={350}
                        height={263}
                        className="rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-2/5 flex flex-col justify-center items-start order-1 md:order-2">
            <div className="max-w-md py-12 pl-8">
              <h2 className="text-4xl font-bold mb-6 text-orange-500 text-left">
                Master concepts in 15 minutes a day
              </h2>
              <p className="text-lg text-gray-600 mb-8 text-left">
                Whether you're a complete beginner or ready to dive into advanced IELTS techniques, IELTS Mastery makes it easy to level up fast with fun, bite-sized lessons.
              </p>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  )
}
