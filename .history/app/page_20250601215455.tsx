import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Search, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ArtworkGrid from "@/components/artwork-grid"
import FeaturedArtwork from "@/components/featured-artwork"
import { Input } from "@/components/ui/input"
import PageTransition from "@/components/page-transition"
import { featuredArtworks } from "@/lib/data"

export default function Home() {
  return (
    <PageTransition>
      <main className="flex-1">
        <section className="relative h-[80vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="/placeholder.svg?height=1080&width=1920"
              alt="Gallery background"
              fill
              className="object-cover brightness-50"
              priority
            />
          </div>
          <div className="container relative z-10 text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Extraordinary Art
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">
              Explore our curated collection of contemporary artworks from talented artists around the world.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg">
                <Link href="/gallery">
                  Explore Gallery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                <Link href="/artists">Meet Artists</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Featured Artworks</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredArtworks.map((artwork) => (
                <Link
                  key={artwork.id}
                  href={`/artwork/${artwork.id}`}
                  className="group"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                    <Image
                      src={artwork.image}
                      alt={artwork.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-semibold mb-1">{artwork.title}</h3>
                  <p className="text-muted-foreground">{artwork.artist}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Latest Artworks</h2>
            <ArtworkGrid />
          </div>
        </section>
      </main>
    </PageTransition>
  )
}
