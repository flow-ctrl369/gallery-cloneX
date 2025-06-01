'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import ArtistGrid from "@/components/artist-grid"
import { useState } from "react"

export default function ArtistsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <main className="min-h-screen py-16 px-4 md:px-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-wider relative inline-block">
          Our Artists
          <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover the talented creators behind our extraordinary collection of artwork from around the world.
        </p>
      </section>

      {/* Artists Section */}
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold uppercase tracking-wider relative inline-block">
            Featured Artists
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
          </h2>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="painters">Painters</TabsTrigger>
            <TabsTrigger value="sculptors">Sculptors</TabsTrigger>
            <TabsTrigger value="photographers">Photographers</TabsTrigger>
            <TabsTrigger value="digital">Digital Artists</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ArtistGrid searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="painters">
            <ArtistGrid specialty="Painter" searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="sculptors">
            <ArtistGrid specialty="Sculptor" searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="photographers">
            <ArtistGrid specialty="Photographer" searchQuery={searchQuery} />
          </TabsContent>
          <TabsContent value="digital">
            <ArtistGrid specialty="Digital Artist" searchQuery={searchQuery} />
          </TabsContent>
        </Tabs>

        <div className="relative w-full md:w-64 mx-auto mt-8">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search artists..." 
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>
    </main>
  )
}
