import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { artworks, artists } from "@/lib/data"

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
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.5" y1="6.5" y2="6.5"/></svg>
                          </a>
                        )}
                        {twitter && (
                          <a href={twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17-18 11.5 2.2.1 4.4-.6 6-2 2.9-2.1 6.1-5.9 6-9.8-.1-1.4-1.2-2.5-2.5-2.7m-2 12v7m6-3H9"/></svg>
                          </a>
                        )}
                        {website && (
                          <a href={website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
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
