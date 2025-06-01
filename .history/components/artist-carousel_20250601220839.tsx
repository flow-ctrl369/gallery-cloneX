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
    const duration = 30000 // 30 seconds for one complete cycle

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      // Calculate the transform position based on progress
      const translateX = -(progress / duration) * (carousel.scrollWidth / 2)
      
      // Reset when we reach the end of the first set of images
      if (translateX <= -carousel.scrollWidth / 2) {
        startTime = timestamp
        carousel.style.transform = 'translateX(0)'
      } else {
        carousel.style.transform = `translateX(${translateX}px)`
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
    <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
      <div
        ref={carouselRef}
        className="flex gap-8 absolute"
        style={{ 
          willChange: "transform",
          transform: "translateZ(0)",
          transition: "transform 0.1s linear"
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
              priority={index < 4}
            />
          </div>
        ))}
      </div>
    </div>
  )
} 