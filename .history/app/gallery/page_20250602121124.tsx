'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import ArtworkGrid from "@/components/artwork-grid"
import { useState } from "react"
import { motion } from "framer-motion"

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <main className="min-h-screen py-16 px-4 md:px-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto mb-16">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-wider relative inline-block"
          >
            Gallery Collection
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Discover our carefully curated selection of contemporary and classical artwork from emerging and established artists worldwide.
          </motion.p>
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
    </main>
  )
} 