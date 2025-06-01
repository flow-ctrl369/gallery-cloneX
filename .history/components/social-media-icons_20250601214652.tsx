"use client"

import { Instagram, Twitter, Globe } from "lucide-react"
import Link from "next/link"

interface SocialMediaIconsProps {
  socialMedia: {
    instagram?: string
    twitter?: string
    website?: string
  }
}

export default function SocialMediaIcons({ socialMedia }: SocialMediaIconsProps) {
  return (
    <div className="flex gap-4 justify-center">
      {socialMedia.instagram && (
        <Link
          href={socialMedia.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Instagram"
        >
          <Instagram className="h-5 w-5" />
        </Link>
      )}
      {socialMedia.twitter && (
        <Link
          href={socialMedia.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Twitter"
        >
          <Twitter className="h-5 w-5" />
        </Link>
      )}
      {socialMedia.website && (
        <Link
          href={socialMedia.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Website"
        >
          <Globe className="h-5 w-5" />
        </Link>
      )}
    </div>
  )
} 