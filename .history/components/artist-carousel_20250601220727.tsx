"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { artists } from "@/lib/data"

export default function ArtistCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    let animationFrame: number
    let startTime: number | null = null
    const duration = 50000 // 50 seconds for one complete cycle

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      // Calculate the scroll position based on progress
      const scrollPosition = (progress / duration) * carousel.scrollWidth
      
      // Reset when we reach the end of the first set of images
      if (scrollPosition >= carousel.scrollWidth / 2) {
        startTime = timestamp
        carousel.scrollLeft = 0
      } else {
        carousel.scrollLeft = scrollPosition
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  // Double the images to create seamless loop
  const carouselImages = [...artists, ...artists].map((artist) => artist.image)

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        ref={carouselRef}
        className="flex gap-8 absolute top-1/2 -translate-y-1/2 whitespace-nowrap"
        style={{ 
          width: "max-content",
          willChange: "transform",
          transform: "translateZ(0)"
        }}
      >
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className="relative w-[300px] h-[400px] flex-shrink-0 opacity-20 transition-opacity duration-300 hover:opacity-30"
          >
            <Image
              src={image}
              alt="Artist"
              fill
              className="object-cover rounded-lg"
              sizes="300px"
              priority={index < 4} // Prioritize loading first few images
            />
          </div>
        ))}
      </div>
    </div>
  )
} 