"use client"

import React, { useEffect } from "react"
import { motion, useAnimationControls } from "framer-motion"

interface AnimatedCircleProps {
  size?: "small" | "large"
}

function AnimatedCircle({ size = "large" }: AnimatedCircleProps) {
  const circleSize = size === "small" ? "w-32 h-32" : "w-52 h-52"
  const innerCircleSize = size === "small" ? "w-28 h-28" : "w-48 h-48"
  const eyeSize = size === "small" ? "w-5 h-8" : "w-8 h-12"
  const pupilSize = size === "small" ? "w-2.5 h-4" : "w-4 h-6"

  const leftEyeControls = useAnimationControls()
  const rightEyeControls = useAnimationControls()

  const pulseVariants = {
    initial: { scale: 0, opacity: 0 },
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

  const speechBubbleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1,
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

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      blinkAnimation()
    }, 3000)

    return () => clearInterval(blinkInterval)
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center">
      <motion.div 
        className="mb-16 bg-blue-500/40 border-2 border-blue-500 rounded-2xl p-4 shadow-lg max-w-xs w-full"
        variants={speechBubbleVariants}
        initial="initial"
        animate="animate"
      >
        <div className="text-base font-medium text-white text-center">
          Hey there! 👋 I'm Koji, your friendly IELTS guide. Ready to boost your skills? Let's chat about your goals and find the perfect study path for you!
        </div>
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-blue-500"></div>
      </motion.div>

      <motion.div 
        className={`relative ${circleSize} rounded-full flex items-center justify-center`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="relative w-full h-full">
            {/* Eyes positioned with fixed pixel values to prevent movement */}
            <motion.div
              className={`absolute ${eyeSize} bg-white rounded-full`}
              style={{ top: '45%', left: '35%' }}  // Fix position of left eye
              animate={leftEyeControls}
            >
              <motion.div 
                className={`${pupilSize} bg-black rounded-full`}
                animate={{
                  y: [-1, 1, -1],
                  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              />
            </motion.div>
            <motion.div
              className={`absolute ${eyeSize} bg-white rounded-full`}
              style={{ top: '45%', right: '35%' }} // Fix position of right eye
              animate={rightEyeControls}
            >
              <motion.div 
                className={`${pupilSize} bg-black rounded-full`}
                animate={{
                  y: [-1, 1, -1],
                  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function Component() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-20">
      <AnimatedCircle />
    </div>
  )
}
