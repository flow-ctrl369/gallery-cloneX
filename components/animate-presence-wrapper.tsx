"use client"

import { AnimatePresence } from "framer-motion"

interface AnimatePresenceWrapperProps {
  children: React.ReactNode
}

export default function AnimatePresenceWrapper({ children }: AnimatePresenceWrapperProps) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>
} 