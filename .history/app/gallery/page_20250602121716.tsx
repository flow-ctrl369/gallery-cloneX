'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import ArtworkGrid from "@/components/artwork-grid"
import { useState } from "react"

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          {/* Search and Filter Section - Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, artist, or medium..."
              className="pl-10 h-11 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Tabs List - Moved next to Search Input */}
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList className="h-11">
              <TabsTrigger value="all">All Works</TabsTrigger>
              <TabsTrigger value="paintings">Paintings</TabsTrigger>
              <TabsTrigger value="sculptures">Sculptures</TabsTrigger>
              <TabsTrigger value="photography">Photography</TabsTrigger>
              <TabsTrigger value="digital">Digital</TabsTrigger>
            </TabsList>
            {/* Tabs Content remains below */}
            <TabsContent value="all" className="mt-6">
              <ArtworkGrid searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="paintings" className="mt-6">
              <ArtworkGrid category="paintings" searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="sculptures" className="mt-6">
              <ArtworkGrid category="sculptures" searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="photography" className="mt-6">
              <ArtworkGrid category="photography" searchQuery={searchQuery} />
            </TabsContent>
            <TabsContent value="digital" className="mt-6">
              <ArtworkGrid category="digital" searchQuery={searchQuery} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  )
} 