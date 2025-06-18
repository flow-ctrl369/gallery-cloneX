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
import AnimatedSection from "@/components/animated-section"

export default function Home() {
  return (
    <PageTransition>
    <main className="min-h-screen">
      {/* Hero Section */}
        <HeroSlideshow />

      {/* Featured Artwork */}
      <AnimatedSection className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
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
        <FeaturedArtwork />
      </AnimatedSection>

        {/* Meet Artists Section */}
        <AnimatedSection className="py-16 px-4 md:px-8 bg-muted relative overflow-hidden" delay={0.2}>
          <ArtistCarousel />
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-wider">
              Meet Our Artists
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
              Discover the talented creators behind our extraordinary collection of artwork from around the world.
            </p>
            <Button size="lg" variant="default" asChild>
              <Link href="/artists">View All Artists</Link>
            </Button>
          </div>
        </AnimatedSection>

      {/* Gallery Section */}
      <AnimatedSection className="py-16 px-4 md:px-8 max-w-7xl mx-auto" delay={0.3}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold uppercase tracking-wider relative inline-block">
              Gallery
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
            </h2>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search artwork..." className="pl-8" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="paintings">Paintings</TabsTrigger>
            <TabsTrigger value="sculptures">Sculptures</TabsTrigger>
            <TabsTrigger value="photography">Photography</TabsTrigger>
            <TabsTrigger value="digital">Digital</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ArtworkGrid />
          </TabsContent>
          <TabsContent value="paintings">
            <ArtworkGrid category="paintings" />
          </TabsContent>
          <TabsContent value="sculptures">
            <ArtworkGrid category="sculptures" />
          </TabsContent>
          <TabsContent value="photography">
            <ArtworkGrid category="photography" />
          </TabsContent>
          <TabsContent value="digital">
            <ArtworkGrid category="digital" />
          </TabsContent>
        </Tabs>
      </AnimatedSection>

      {/* Newsletter */}
      <AnimatedSection className="py-16 px-4 md:px-8 bg-muted" delay={0.4}>
        <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 uppercase tracking-wider relative inline-block">
              Stay Updated
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
            </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive updates on new exhibitions, artists, and events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Your email address" className="flex-grow" />
            <Button>Subscribe</Button>
          </div>
        </div>
      </AnimatedSection>
    </main>
    </PageTransition>
  )
}
