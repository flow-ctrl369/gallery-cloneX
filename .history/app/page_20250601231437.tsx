import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ArtworkGrid from "@/components/artwork-grid"
import FeaturedArtwork from "@/components/featured-artwork"
import { Input } from "@/components/ui/input"
import ArtistCarousel from "@/components/artist-carousel"
import PageTransition from "@/components/page-transition"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <PageTransition>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[70vh] w-full overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1920&h=1080&fit=crop"
            alt="Featured artwork"
            width={1920}
            height={1080}
            className="object-cover w-full h-full brightness-75"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">Modern Art Gallery</h1>
            <p className="text-xl md:text-2xl text-center max-w-2xl mb-8">
              Discover extraordinary works from artists around the world
            </p>
            <Button size="lg" asChild>
              <Link href="#gallery">Explore Gallery</Link>
            </Button>
          </div>
        </section>

        {/* Featured Artwork */}
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Artwork</h2>
            <Button variant="ghost" className="gap-2">
              View all <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <FeaturedArtwork />
        </section>

        {/* Meet Artists Section */}
        <section className="py-16 px-4 md:px-8 bg-muted relative overflow-hidden">
          <ArtistCarousel />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-7xl mx-auto text-center relative z-10"
          >
            <h2 className="text-3xl font-bold mb-4">Meet Our Artists</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-muted-foreground">
              Discover the talented creators behind our extraordinary collection of artwork from around the world.
            </p>
            <Button size="lg" variant="default" asChild>
              <Link href="/artists">View All Artists</Link>
            </Button>
          </motion.div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold">Gallery</h2>
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
        </section>

        {/* Newsletter */}
        <section className="py-16 px-4 md:px-8 bg-muted">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-7xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive updates on new exhibitions, artists, and events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="Your email address" className="flex-grow" />
              <Button>Subscribe</Button>
            </div>
          </motion.div>
        </section>
      </main>
    </PageTransition>
  )
}
