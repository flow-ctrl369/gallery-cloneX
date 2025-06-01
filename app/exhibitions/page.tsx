import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import ExhibitionGrid from "@/components/exhibition-grid"

export default function ExhibitionsPage() {
  return (
    <main className="min-h-screen py-16 px-4 md:px-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Exhibitions</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experience our curated exhibitions featuring the finest contemporary art from around the world.
        </p>
      </section>

      {/* Featured Exhibition */}
      <section className="max-w-7xl mx-auto mb-16">
        <div className="relative h-[50vh] w-full overflow-hidden rounded-lg">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Featured exhibition"
            width={1920}
            height={1080}
            className="object-cover w-full h-full brightness-75"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-start justify-end p-8 text-white bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">June 15 - August 30, 2025</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Perspectives: New Horizons in Contemporary Art</h2>
            <p className="text-lg mb-4 max-w-2xl">
              An exploration of emerging voices in the global art scene, featuring works that challenge conventional
              perspectives.
            </p>
            <Button size="lg" variant="default">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Exhibitions Section */}
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold">All Exhibitions</h2>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search exhibitions..." className="pl-8" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ExhibitionGrid />
          </TabsContent>
          <TabsContent value="current">
            <ExhibitionGrid status="current" />
          </TabsContent>
          <TabsContent value="upcoming">
            <ExhibitionGrid status="upcoming" />
          </TabsContent>
          <TabsContent value="past">
            <ExhibitionGrid status="past" />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}

import Image from "next/image"
