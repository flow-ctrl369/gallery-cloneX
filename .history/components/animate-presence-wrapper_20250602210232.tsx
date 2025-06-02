"use client"

import { AnimatePresence } from "framer-motion"
import PageTransition from './page-transition'

interface AnimatePresenceWrapperProps {
  children: React.ReactNode
}

export default function AnimatePresenceWrapper({ children }: AnimatePresenceWrapperProps) {
  return <AnimatePresence mode="wait">
    <PageTransition>{children}</PageTransition>
  </AnimatePresence>
} 