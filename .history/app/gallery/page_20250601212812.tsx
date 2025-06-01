import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import ArtworkGrid from "@/components/artwork-grid"

export default function GalleryPage() {
  return (
    <main className="min-h-screen py-16 px-4 md:px-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Gallery</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore our curated collection of extraordinary artwork from talented artists around the world.
        </p>
      </section>

      {/* Gallery Section */}
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold">Artwork Collection</h2>
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
    </main>
  )
} 