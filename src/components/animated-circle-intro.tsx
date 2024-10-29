"use client"

import React, { useState, useEffect } from "react"
import { motion, useAnimationControls, AnimatePresence } from "framer-motion"

function AnimatedCircle({ size = "large" }: { size?: "small" | "large" }) {
  const circleSize = size === "small" ? "w-32 h-32" : "w-52 h-52"
  const innerCircleSize = size === "small" ? "w-28 h-28" : "w-48 h-48"
  const eyeSize = size === "small" ? "w-5 h-8" : "w-8 h-12"
  const pupilSize = size === "small" ? "w-1/2 h-1/2" : "w-1/2 h-1/2"

  const leftEyeControls = useAnimationControls()
  const rightEyeControls = useAnimationControls()
  const leftPupilControls = useAnimationControls()
  const rightPupilControls = useAnimationControls()

  const popOutVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const pulseVariants = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5,
      },
    },
  }

  const rotateVariants = {
    initial: { rotate: 0, opacity: 0 },
    animate: {
      rotate: 360,
      opacity: 1,
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "linear",
        delay: 0.5,
      },
    },
  }

  const blinkAnimation = async () => {
    await Promise.all([
      leftEyeControls.start({ scaleY: 0.1, transition: { duration: 0.1 } }),
      rightEyeControls.start({ scaleY: 0.1, transition: { duration: 0.1 } })
    ])
    await Promise.all([
      leftEyeControls.start({ scaleY: 1, transition: { duration: 0.1 } }),
      rightEyeControls.start({ scaleY: 1, transition: { duration: 0.1 } })
    ])
  }

  const lookUpAnimation = async () => {
    await Promise.all([
      leftPupilControls.start({ y: -4, transition: { duration: 0.2 } }),
      rightPupilControls.start({ y: -4, transition: { duration: 0.2 } })
    ])
    await new Promise(resolve => setTimeout(resolve, 1000))
    await Promise.all([
      leftPupilControls.start({ y: 0, transition: { duration: 0.2 } }),
      rightPupilControls.start({ y: 0, transition: { duration: 0.2 } })
    ])
  }

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      blinkAnimation()
    }, 3000)

    const lookUpInterval = setInterval(() => {
      lookUpAnimation()
    }, 5000)

    return () => {
      clearInterval(blinkInterval)
      clearInterval(lookUpInterval)
    }
  }, [])

  return (
    <motion.div 
      className={`relative ${circleSize} rounded-full flex items-center justify-center cursor-pointer`}
      variants={popOutVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className={`absolute ${circleSize} rounded-full bg-orange-500`}
        variants={pulseVariants}
        initial="initial"
        animate="animate"
      />
      <motion.div
        className={`absolute ${innerCircleSize} rounded-full border-4 border-white/30`}
        variants={rotateVariants}
        initial="initial"
        animate="animate"
      />
      <motion.div
        className={`${innerCircleSize} rounded-full bg-orange-600/50 backdrop-blur-sm flex items-center justify-center`}
      >
        <div className="relative w-full h-full">
          <motion.div
            className={`absolute ${eyeSize} bg-white rounded-full flex items-center justify-center`}
            style={{ top: '33%', left: '30%' }}
            animate={leftEyeControls}
          >
            <motion.div 
              className={`${pupilSize} bg-black rounded-full`}
              animate={leftPupilControls}
            />
          </motion.div>
          <motion.div
            className={`absolute ${eyeSize} bg-white rounded-full flex items-center justify-center`}
            style={{ top: '33%', right: '30%' }}
            animate={rightEyeControls}
          >
            <motion.div 
              className={`${pupilSize} bg-black rounded-full`}
              animate={rightPupilControls}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function AnimatedCircleIntro() {
  const [speechIndex, setSpeechIndex] = useState(0)
  const speeches = [
    <>
      Hey there!<br /> Nice to meet you!
    </>,
    "Let's take a moment to understand your goals to help you along your path"
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setSpeechIndex(1)
    }, 3000) // Change speech after 3 seconds

    return () => clearTimeout(timer)
  }, [])

  const speechBubbleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5,
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  }

  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }

  const raiseVariants = {
    initial: { y: 0 },
    animate: {
      y: -100,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4 overflow-hidden">
      <motion.div 
        className="flex flex-col items-center justify-center w-full"
        variants={raiseVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="flex flex-col items-center"
          variants={floatVariants}
          animate="animate"
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={speechIndex}
              className="mb-8 bg-blue-500/5 border-2 border-blue-500/20 rounded-2xl p-4 shadow-lg max-w-[300px] relative"
              variants={speechBubbleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="text-base font-bold text-gray-800 text-center">
                {speeches[speechIndex]}
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-blue-500/20"></div>
            </motion.div>
          </AnimatePresence>
          <AnimatedCircle size="large" />
        </motion.div>
      </motion.div>
    </div>
  )
}