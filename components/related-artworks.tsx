import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { artworks } from "@/lib/data"

interface RelatedArtworksProps {
  currentId: string
  category: string
}

export default function RelatedArtworks({ currentId, category }: RelatedArtworksProps) {
  const relatedArtworks = artworks
    .filter((artwork) => artwork.id !== currentId && artwork.category === category)
    .slice(0, 4)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {relatedArtworks.map((artwork) => (
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
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
