'use client'

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface AchievementStarProps {
  size: "small" | "large";
  score: number;
}

// Font URL from Adobe Typekit
const fontUrl = "https://use.typekit.net/gcd4kuc.css";

function AchievementStar({ size, score }: AchievementStarProps) {
  const iconSize = size === "small" ? "w-8 h-8" : "w-40 h-40";
  const containerSize = size === "small" ? "w-24 h-24" : "w-64 h-64";
  const innerSize = size === "small" ? "w-20 h-20" : "w-60 h-60";
  const textSize = size === "small" ? "text-sm" : "text-xl";

  const containerVariants = {
    hidden: { scale: 0, rotate: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 0.6,
      },
    },
    spin: {
      rotate: 360,
      transition: {
        delay: 0.6,
        duration: 0.8,
        ease: "easeInOut",
      },
    },
    hover: {
      y: [0, -10, 0],
      transition: {
        y: {
          delay: 1.4,
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
  };

  const starVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        delay: 0.3,
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    hover: {
      rotate: [0, 10, -10, 0],
      transition: {
        rotate: {
          delay: 1.4,
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.4,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="flex flex-col items-center" style={{ fontFamily: 'circe, sans-serif' }}>
      <motion.div
        className={`relative ${containerSize} rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-orange-500`}
        variants={containerVariants}
        initial="hidden"
        animate={["visible", "spin", "hover"]}
        whileHover="hover"
      >
        <motion.div
          className={`relative z-10 ${innerSize} bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm`}
          variants={starVariants}
        >
          <Star className={`${iconSize} text-white fill-current`} />
        </motion.div>
      </motion.div>
      <motion.div
        className="text-center mt-6"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-4xl font-bold text-white mb-4">Congratulations!</h2>
        <p className={`${textSize} font-bold text-white mb-2`}>
          You've achieved an IELTS band score of {score.toFixed(1)}!
        </p>
        <p className={`${textSize} text-white`}>
          Your language skills are soaring to new heights!
        </p>
      </motion.div>
    </div>
  );
}

export default function AchievementStarShowcase() {
  // Load font
  useEffect(() => {
    const link = document.createElement("link");
    link.href = fontUrl;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-16 min-h-screen bg-transparent p-4 -mt-20">
      <AchievementStar size="large" score={8.0} />
    </div>
  );
}

