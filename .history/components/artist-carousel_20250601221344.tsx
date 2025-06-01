"use client"

import { artists } from "@/lib/data"
import Image from "next/image"
import { motion } from "framer-motion"

export default function ArtistCarousel() {
  // Triple the images to create a more seamless loop
  const carouselImages = [...artists, ...artists, ...artists].map((artist) => artist.image)

  return (
    <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
      {/* Gradient masks for smooth fade in/out */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-muted to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-muted to-transparent z-10" />
      
      <motion.div
        className="flex gap-4"
        animate={{
          x: [0, -50 * (carouselImages.length / 3)], // Move by one-third of the total width
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 40,
            ease: "linear",
          },
        }}
      >
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className="relative w-[300px] h-[400px] flex-shrink-0 opacity-20"
          >
            <Image
              src={image}
              alt="Artist"
              fill
              className="object-cover rounded-lg"
              sizes="300px"
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
} 