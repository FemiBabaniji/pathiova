"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import SignInButton from "@/components/SignInButton";
import GetStartedButton from "@/components/GetStartedButton";
import GuidedCoursesSection from "@/components/guided-courses-section";
import { Flag } from "lucide-react";

const fontUrl = "https://use.typekit.net/gcd4kuc.css";

function Header() {
  return (
    <header className="bg-white py-2 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-5xl mt-8">
          pathova
        </Link>
        <SignInButton>Login</SignInButton>
      </div>
    </header>
  );
}

function Navbar({ visible }: { visible: boolean }) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 bg-white shadow-sm z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16">
          <GetStartedButton>Get Started</GetStartedButton>
        </div>
      </div>
    </nav>
  );
}

function Eye({ eyeX, eyeY, left, top }) {
  return (
    <motion.div
      style={{
        width: "40px",
        height: "60px",
        borderRadius: "50%",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "absolute",
        left: `${left}%`,
        top: `${top}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.div
        style={{
          width: "20px",
          height: "30px",
          borderRadius: "50%",
          background: "black",
          x: eyeX,
          y: eyeY,
        }}
      />
    </motion.div>
  );
}

export default function LandingPage() {
  const [showNav, setShowNav] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = fontUrl;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const handleScroll = () => {
      setShowNav(window.scrollY > 100);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.head.removeChild(link);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const springConfig = { stiffness: 300, damping: 30, mass: 0.5 };
  const eyeX = useSpring(useTransform(mouseX, [0, 400], [-5, 5]), springConfig);
  const eyeY = useSpring(useTransform(mouseY, [0, 400], [-2, 2]), springConfig);

  return (
    <div className="flex flex-col min-h-screen" style={{ fontFamily: "circe, sans-serif" }}>
      <Header />
      <Navbar visible={showNav} />

      <main className="flex-grow">
        <div className="min-h-screen flex flex-col">
          <section className="flex-grow flex items-center bg-white pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div ref={containerRef} className="md:w-1/2 relative h-[600px] order-1 md:order-none">
                    <div className="relative w-full h-full">
                      <Image
                        src="/pathova.png"
                        alt="Pantova"
                        layout="fill"
                        objectFit="contain"
                        priority
                      />
                      <Eye eyeX={eyeX} eyeY={eyeY} left={30} top={20} />
                      <Eye eyeX={eyeX} eyeY={eyeY} left={40} top={20} />
                    </div>
                  </div>
                  <div className="md:w-1/2 pl-8 text-left order-2 md:order-none">
                    <div className="flex justify-between items-center mb-4">
                      {[
                        { country: "Canada", code: "CA" },
                        { country: "Australia", code: "AU" },
                        { country: "UK", code: "GB" },
                        { country: "USA", code: "US" },
                        { country: "New Zealand", code: "NZ" },
                      ].map((item, index, array) => (
                        <React.Fragment key={item.country}>
                          <div className="flex items-center">
                            <Flag className="w-5 h-5 mr-1" />
                            <span className="text-sm font-medium">{item.country}</span>
                          </div>
                          {index < array.length - 1 && (
                            <span className="h-4 w-px bg-gray-300 mx-2"></span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="text-orange-500 font-semibold mb-2 text-3xl mb-20 mt-5">IELTS EXAM PREP</p>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 -mt-10">
                      Learn Smarter,
                      <br />
                      not Harder.
                    </h1>
                    <p className="text-gray-600 mb-6 text-2xl">
                      Follow a gamified path to unlock your
                      <br />
                      future with interactive learning.
                    </p>
                    <div className="flex justify-start">
                      <GetStartedButton className="text-xl mt-8">
                        Get Started
                      </GetStartedButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center flex-wrap gap-4">
                {["Writing", "Reading", "Speaking", "Listening"].map((category) => (
                  <div key={category} className="p-4">
                    <h2 className="text-xl font-semibold">{category}</h2>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="py-12 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-24 mb-24">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12">
                  <h2 className="text-5xl font-bold mb-4 text-orange-500">
                    Results.
                    <br />
                    Not the runaround.
                  </h2>
                  <p className="text-gray-600">
                    Learning with us is all about practice, not just boring study guides. Our gamified lessons focus on doing,
                    with IELTS exams at the core of your learning experience with free resources to give you knowledge.
                  </p>
                </div>
                <div className="md:w-1/2 mt-8 md:mt-0">
                  <div className="bg-orange-100 rounded-lg p-6">
                    <div className="h-64 bg-orange-200 rounded-lg"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row-reverse items-center">
                <div className="md:w-1/2 md:pl-12">
                  <h2 className="text-5xl font-bold mb-4 text-orange-500">
                    Instant Feedback.
                    <br />
                    Immediate Improvement.
                  </h2>
                  <p className="text-gray-600">
                    No waiting, no guessing—just clear, actionable steps to help you improve with every attempt. Our
                    cutting-edge AI-powered software lets you practice speaking and writing directly to the system, giving
                    real time feedback.
                  </p>
                </div>
                <div className="md:w-1/2 mt-8 md:mt-0">
                  <div className="bg-blue-100 rounded-lg p-6">
                    <div className="h-64 bg-blue-200 rounded-lg"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center mt-24">
                <div className="md:w-1/2 md:pr-12">
                  <h2 className="text-5xl font-bold mb-4 text-orange-500">
                    Supporting your
                    <br />
                    Every Step.
                  </h2>
                  <p className="text-gray-600">
                    Preparing for IELTS is just one part of your journey toward studying, working, or building a
                    new life abroad. We provide the tools you need to excel in the exam, while also guiding
                    you through the complexities of the process.
                  </p>
                </div>
                <div className="md:w-1/2 mt-8 md:mt-0">
                  <div className="bg-green-100 rounded-lg p-6">
                    <div className="h-64 bg-green-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
            <GetStartedButton className="text-xl">Get started</GetStartedButton>
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
                  testimonial: "IELTS Mastery helped me achieve my dream score. The practice tests were spot-on!",
                },
                {
                  name: "Ahmed K.",
                  score: "Band 7.0",
                  testimonial: "The speaking modules boosted my confidence. I felt well-prepared on exam day.",
                },
                {
                  name: "Maria G.",
                  score: "Band 8.0",
                  testimonial: "The writing feedback was invaluable. It helped me improve my essay structure significantly.",
                },
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
  );
}
