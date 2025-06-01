'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import ArtworkGrid from "@/components/artwork-grid"
import { useState } from "react"
import PageTransition from "@/components/page-transition"

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <PageTransition>
      <main className="flex-1 py-8 px-4 md:px-8 max-w-7xl mx-auto">
        <section className="mb-16">
          <h1 className="text-4xl font-bold mb-4">Gallery</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Explore our collection of contemporary artworks from talented artists around the world.
          </p>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search artwork..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        <section>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="paintings">Paintings</TabsTrigger>
              <TabsTrigger value="sculptures">Sculptures</TabsTrigger>
              <TabsTrigger value="photography">Photography</TabsTrigger>
              <TabsTrigger value="digital">Digital</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ArtworkGrid searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="paintings">
              <ArtworkGrid category="Paintings" searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="sculptures">
              <ArtworkGrid category="Sculptures" searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="photography">
              <ArtworkGrid category="Photography" searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="digital">
              <ArtworkGrid category="Digital" searchQuery={searchQuery} />
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </PageTransition>
  )
} 