import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Search } from "lucide-react"
import Link from "next/link"
import ArtworkGrid from "@/components/artwork-grid"
import FeaturedArtwork from "@/components/featured-artwork"
import { Input } from "@/components/ui/input"
import ArtistCarousel from "@/components/artist-carousel"
import PageTransition from "@/components/page-transition"
import HeroSlideshow from "@/components/hero-slideshow"
import FeaturedArtworks from "@/components/featured-artworks"
import UpcomingExhibitions from "@/components/upcoming-exhibitions"

export default function Home() {
  return (
    <PageTransition>
      <main className="flex-1">
        <HeroSlideshow />
        <div className="container mx-auto px-4 py-12 space-y-16">
          <FeaturedArtworks />
          <UpcomingExhibitions />
        </div>
      </main>
    </PageTransition>
  )
}
