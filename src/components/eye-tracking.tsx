"use client"

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

export default function Home() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouseX, mouseY])

  const springConfig = { stiffness: 300, damping: 30, mass: 0.5 }
  const eyeX = useSpring(useTransform(mouseX, [0, window.innerWidth], [-5, 5]), springConfig)
  const eyeY = useSpring(useTransform(mouseY, [0, window.innerHeight], [-2, 2]), springConfig)

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="flex gap-8">
        <Eye eyeX={eyeX} eyeY={eyeY} />
        <Eye eyeX={eyeX} eyeY={eyeY} />
      </div>
    </main>
  )
}

function Eye({ eyeX, eyeY }) {
  return (
    <motion.div
      style={{
        width: '80px',
        height: '120px',
        borderRadius: '50%',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{
          width: '40px',
          height: '60px',
          borderRadius: '50%',
          background: 'black',
          x: eyeX,
          y: eyeY,
        }}
      />
    </motion.div>
  )
}