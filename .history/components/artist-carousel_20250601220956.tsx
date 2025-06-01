"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { artists } from "@/lib/data"

export default function ArtistCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    const scrollWidth = carousel.scrollWidth
    const clientWidth = carousel.clientWidth
    let scrollLeft = 0

    const animate = () => {
      scrollLeft += 0.5 // Adjust speed here
      if (scrollLeft >= scrollWidth / 2) {
        scrollLeft = 0
      }
      carousel.scrollLeft = scrollLeft
      requestAnimationFrame(animate)
    }

    const animation = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animation)
    }
  }, [])

  // Double the images to create seamless loop
  const carouselImages = [...artists, ...artists].map((artist) => artist.image)

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        ref={carouselRef}
        className="flex gap-4 absolute top-1/2 -translate-y-1/2"
        style={{ width: "max-content" }}
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
      </div>
    </div>
  )
} 