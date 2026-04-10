'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function AmbientBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Primary Orb */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-400/20 dark:bg-primary-600/10 rounded-full blur-[120px]"
      />

      {/* Secondary Orb */}
      <motion.div
        animate={{
          x: [0, -150, 100, 0],
          y: [0, 150, -100, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-[150px]"
      />

      {/* Tertiary Orb */}
      <motion.div
        animate={{
          x: [0, 80, -120, 0],
          y: [0, 120, 80, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-slate-300/20 dark:bg-slate-800/10 rounded-full blur-[100px]"
      />
    </div>
  )
}
