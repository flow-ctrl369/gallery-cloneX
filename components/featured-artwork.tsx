import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { featuredArtworks } from "@/lib/data"

export default function FeaturedArtwork() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredArtworks.map((artwork) => (
        <Card key={artwork.id} className="overflow-hidden">
          <div className="aspect-[4/3] relative">
            <Image
              src={artwork.image || "/placeholder.svg"}
              alt={artwork.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-2">{artwork.title}</h3>
            <p className="text-muted-foreground mb-2">{artwork.artist}</p>
            <p className="line-clamp-3 mb-4 text-sm">{artwork.description}</p>
            <Button asChild variant="outline" className="w-full gap-2">
              <Link href={`/artwork/${artwork.id}`}>
                View Details <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
