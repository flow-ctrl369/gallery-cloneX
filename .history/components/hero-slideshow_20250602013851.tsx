"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { artworks } from "@/lib/data"
import { motion, AnimatePresence } from "framer-motion"

// Define which slides should use dark text (light backgrounds)
const darkTextSlides = [1, 3, 5] // Adjust these indices based on your artwork brightness

export default function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % artworks.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [])

  // Set hasAnimated to true after initial animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true)
    }, 1000) // Match this with the animation duration

    return () => clearTimeout(timer)
  }, [])

  const isDarkText = darkTextSlides.includes(currentIndex)

  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      {/* Main centered content - Moved outside AnimatePresence */}
      <motion.div
        initial={hasAnimated ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute inset-0 flex flex-col items-center justify-center p-4 z-20 text-white"
      >
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">Modern Art Gallery</h1>
          <p className="text-xl md:text-2xl text-center max-w-2xl mb-8">
            Discover extraordinary works from artists around the world
          </p>
          <Button 
            size="lg" 
            asChild
            className="bg-white/20 text-white hover:bg-white/30 border-white px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            <Link href="#gallery">Explore Gallery</Link>
          </Button>
        </div>
      </motion.div>

      {/* Slideshow content */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 1.4,
            ease: "easeInOut"
          }}
          className="absolute inset-0 z-10"
        >
          <Image
            src={artworks[currentIndex].image}
            alt={artworks[currentIndex].title}
            fill
            className="object-cover brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />

          {/* Artwork details in bottom right */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 text-white bg-black/40 backdrop-blur-sm p-4 md:p-6 rounded-lg max-w-[280px] md:max-w-md shadow-lg"
          >
            <h2 className="text-lg md:text-2xl font-semibold mb-1 md:mb-2">{artworks[currentIndex].title}</h2>
            <p className="text-sm md:text-lg mb-2 md:mb-4">by {artworks[currentIndex].artist}</p>
            <Button 
              variant="outline" 
              asChild 
              className="w-full bg-black/10 text-white hover:bg-black/20 border-white text-sm md:text-base py-2 md:py-3"
            >
              <Link href={`/artwork/${artworks[currentIndex].id}`}>View Details</Link>
            </Button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots - Moved outside AnimatePresence */}
      <motion.div
        initial={hasAnimated ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20"
      >
        {artworks.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-white w-4" 
                : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </motion.div>
    </section>
  )
} 