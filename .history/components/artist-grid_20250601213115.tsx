import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { artists } from "@/lib/data"

interface ArtistGridProps {
  specialty?: string
  searchQuery?: string
}

export default function ArtistGrid({ specialty, searchQuery = "" }: ArtistGridProps) {
  let filteredArtists = artists

  if (specialty && specialty !== "all") {
    filteredArtists = artists.filter((artist) => artist.specialty === specialty)
  }

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filteredArtists = filteredArtists.filter(
      (artist) =>
        artist.name.toLowerCase().includes(query) ||
        artist.specialty.toLowerCase().includes(query) ||
        artist.location.toLowerCase().includes(query) ||
        artist.biography.toLowerCase().includes(query)
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredArtists.map((artist) => (
        <Link href={`/artists/${artist.id}`} key={artist.id}>
          <Card className="overflow-hidden h-full transition-all hover:shadow-md">
            <div className="aspect-square relative">
              <Image
                src={artist.image || "/placeholder.svg"}
                alt={artist.name}
                fill
                className="object-cover transition-transform hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium line-clamp-1">{artist.name}</h3>
              <p className="text-sm text-muted-foreground">{artist.specialty}</p>
              <p className="text-xs text-muted-foreground mt-1">{artist.location}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
