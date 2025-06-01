"use client"

import { artists } from "@/lib/data"
import Image from "next/image"
import { motion } from "framer-motion"

export default function ArtistCarousel() {
  // Double the images to create seamless loop
  const carouselImages = [...artists, ...artists].map((artist) => artist.image)

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="flex gap-4 absolute top-1/2 -translate-y-1/2"
        animate={{
          x: [0, -50 * carouselImages.length], // Move by the width of all images
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
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