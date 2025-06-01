import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, MapPin, Share } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { exhibitions, artworks, artists } from "@/lib/data"

export default function ExhibitionPage({ params }: { params: { id: string } }) {
  const exhibition = exhibitions.find((exhibition) => exhibition.id === params.id) || exhibitions[0]
  const exhibitionArtworks = artworks.filter((artwork) => exhibition.artworkIds.includes(artwork.id)).slice(0, 8)

  const exhibitionArtists = artists.filter((artist) =>
    exhibitionArtworks.some((artwork) => artwork.artist === artist.name),
  )

  return (
    <main className="min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/exhibitions" className="inline-flex items-center gap-2 mb-8 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to exhibitions
        </Link>

        {/* Hero Section */}
        <div className="relative h-[50vh] w-full overflow-hidden rounded-lg mb-12">
          <Image
            src={exhibition.image || "/placeholder.svg"}
            alt={exhibition.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-start justify-end p-8 text-white bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{exhibition.dateRange}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{exhibition.title}</h1>
            <p className="text-lg mb-4 max-w-2xl">{exhibition.subtitle}</p>
          </div>
        </div>

        {/* Exhibition Details */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">About the Exhibition</h2>
            <p className="text-muted-foreground whitespace-pre-line mb-6">{exhibition.description}</p>

            <h2 className="text-2xl font-bold mb-4">Curator's Note</h2>
            <p className="text-muted-foreground whitespace-pre-line mb-6">{exhibition.curatorNote}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {exhibitionArtists.slice(0, 4).map((artist) => (
                <Link href={`/artists/${artist.id}`} key={artist.id} className="group">
                  <div className="relative aspect-square overflow-hidden rounded-full mb-2">
                    <Image
                      src={artist.image || "/placeholder.svg"}
                      alt={artist.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <p className="text-center font-medium">{artist.name}</p>
                  <p className="text-center text-sm text-muted-foreground">{artist.specialty}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-muted rounded-lg p-6">
              <h3 className="font-semibold mb-4">Exhibition Details</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Dates</p>
                    <p className="text-muted-foreground">{exhibition.dateRange}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-muted-foreground">{exhibition.hours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{exhibition.location}</p>
                    <p className="text-muted-foreground">{exhibition.address}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="font-medium">Admission</p>
                  <p className="text-muted-foreground">{exhibition.admission}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button className="w-full">Get Tickets</Button>
                <Button variant="outline" className="w-full gap-2">
                  <Share className="h-4 w-4" /> Share Exhibition
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Artworks */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Featured Artworks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {exhibitionArtworks.map((artwork) => (
              <Link href={`/artwork/${artwork.id}`} key={artwork.id}>
                <div className="group">
                  <div className="aspect-square relative overflow-hidden rounded-lg mb-3">
                    <Image
                      src={artwork.image || "/placeholder.svg"}
                      alt={artwork.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  <h3 className="font-medium line-clamp-1">{artwork.title}</h3>
                  <p className="text-sm text-muted-foreground">{artwork.artist}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button variant="outline" size="lg">
              View All Artworks
            </Button>
          </div>
        </section>
      </div>
    </main>
  )
}
