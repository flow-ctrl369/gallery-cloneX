'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import ArtworkGrid from "@/components/artwork-grid"
import { useState } from "react"
import PageTransition from "@/components/page-transition"
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { PriceDisplay } from '@/components/price-display'

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <PageTransition>
      <main className="min-h-screen py-16 px-4 md:px-8">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-wider relative inline-block">
              Gallery Collection
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover our carefully curated selection of contemporary and classical artwork from emerging and established artists worldwide.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by title, artist, or medium..." 
                className="pl-10 h-11 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="max-w-7xl mx-auto">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="h-11 mb-8">
              <TabsTrigger value="all">All Works</TabsTrigger>
              <TabsTrigger value="paintings">Paintings</TabsTrigger>
              <TabsTrigger value="sculptures">Sculptures</TabsTrigger>
              <TabsTrigger value="photography">Photography</TabsTrigger>
              <TabsTrigger value="digital">Digital</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ArtworkGrid searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="paintings">
              <ArtworkGrid category="paintings" searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="sculptures">
              <ArtworkGrid category="sculptures" searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="photography">
              <ArtworkGrid category="photography" searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="digital">
              <ArtworkGrid category="digital" searchQuery={searchQuery} />
            </TabsContent>
          </Tabs>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredArtworks.map((artwork) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{artwork.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-gray-600 mb-2">{artwork.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Artist: {artwork.artist}</p>
                      <p className="text-sm text-gray-500">Year: {artwork.year}</p>
                    </div>
                    <PriceDisplay price={artwork.price} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => window.location.href = `/artwork/${artwork.id}`}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </PageTransition>
  )
} 