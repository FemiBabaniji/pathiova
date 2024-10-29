"use client"

import React, { useEffect } from "react"
import { motion, useAnimationControls } from "framer-motion"

interface AnimatedCircleProps {
  size?: "small" | "large";
  position?: "corner" | "center";
}

function AnimatedCircle({ size = "large", position = "center" }: AnimatedCircleProps) {
  const circleSize = size === "small" ? "w-32 h-32" : "w-52 h-52"
  const innerCircleSize = size === "small" ? "w-28 h-28" : "w-48 h-48"
  const eyeSize = size === "small" ? "w-5 h-8" : "w-8 h-12"
  const pupilSize = size === "small" ? "w-1/2 h-1/2" : "w-1/2 h-1/2"

  const leftEyeControls = useAnimationControls()
  const rightEyeControls = useAnimationControls()
  const leftPupilControls = useAnimationControls()
  const rightPupilControls = useAnimationControls()
  const circleControls = useAnimationControls()

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

  const floatVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }

  const peekVariants = {
    initial: { x: '100%' },
    peek: {
      x: '0%',
      transition: { duration: 1, ease: "easeOut" }
    },
    hide: {
      x: '100%',
      transition: { duration: 1, ease: "easeIn" }
    }
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

  const peekAnimation = async () => {
    await circleControls.start('peek')
    await new Promise(resolve => setTimeout(resolve, 2000))
    await circleControls.start('hide')
  }

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      blinkAnimation()
    }, 3000)

    const lookUpInterval = setInterval(() => {
      lookUpAnimation()
    }, 5000)

    if (position === 'corner') {
      const peekInterval = setInterval(() => {
        peekAnimation()
      }, 10000)

      return () => {
        clearInterval(blinkInterval)
        clearInterval(lookUpInterval)
        clearInterval(peekInterval)
      }
    }

    return () => {
      clearInterval(blinkInterval)
      clearInterval(lookUpInterval)
    }
  }, [position])

  const containerClass = position === 'corner' 
    ? 'fixed bottom-0 right-0 mb-4 mr-4' 
    : 'relative'

  return (
    <motion.div 
      className={`${containerClass} ${circleSize} rounded-full flex items-center justify-center cursor-pointer overflow-hidden`}
      variants={position === 'corner' ? peekVariants : floatVariants}
      initial="initial"
      animate={position === 'corner' ? circleControls : "animate"}
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

export default AnimatedCircle