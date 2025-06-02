import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import ArtworkGrid from "./artwork-grid"

export default function FeaturedArtworks() {
  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold uppercase tracking-wider relative inline-block">
          Featured Artwork
          <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
        </h2>
        <Button variant="ghost" className="gap-2" asChild>
          <Link href="/gallery">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <ArtworkGrid />
    </section>
  )
} 