import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { artworks, artists } from "@/lib/data"
import { Instagram, Twitter, Globe } from "lucide-react"

interface ArtworkGridProps {
  category?: string
  artistId?: string
  searchQuery?: string
}

export default function ArtworkGrid({ category, artistId, searchQuery = "" }: ArtworkGridProps) {
  let filteredArtworks = artworks

  if (artistId) {
    const artist = artists.find((a) => a.id === artistId)
    if (artist) {
      filteredArtworks = artworks.filter((artwork) => artwork.artist === artist.name)
    }
  } else if (category && category !== "all") {
    filteredArtworks = artworks.filter((artwork) => artwork.category.toLowerCase() === category.toLowerCase())
  }

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filteredArtworks = filteredArtworks.filter(
      (artwork) =>
        artwork.title.toLowerCase().includes(query) ||
        artwork.artist.toLowerCase().includes(query) ||
        artwork.description.toLowerCase().includes(query) ||
        artwork.category.toLowerCase().includes(query)
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredArtworks.map((artwork) => (
        <Link href={`/artwork/${artwork.id}`} key={artwork.id}>
          <Card className="overflow-hidden h-full transition-all hover:shadow-md">
            <div className="aspect-square relative">
              <Image
                src={artwork.image || "/placeholder.svg"}
                alt={artwork.title}
                fill
                className="object-cover transition-transform hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium line-clamp-1">{artwork.title}</h3>
              <p className="text-sm text-muted-foreground">{artwork.artist}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">${artwork.price.toLocaleString()}</span>
                <span className="text-xs bg-muted px-2 py-1 rounded-full">{artwork.category}</span>
              </div>
              {/* Add Social Media Icons */}
              {
                (() => {
                  const artist = artists.find((a) => a.name === artwork.artist);
                  if (artist && artist.socialMedia) {
                    const { instagram, twitter, website } = artist.socialMedia;
                    return (
                      <div className="flex gap-2 mt-4">
                        {instagram && (
                          <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                        {twitter && (
                          <a href={twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
                        {website && (
                          <a href={website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                            <Globe className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    );
                  }
                  return null;
                })()
              }
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
