'use client'

import { motion, type HTMLMotionProps } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedSectionProps extends HTMLMotionProps<"div"> {
  children: ReactNode
  className?: string
  delay?: number
}

export default function AnimatedSection({ children, className = "", delay = 0, ...props }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
} 