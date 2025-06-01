import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { artists, artworks } from "@/lib/data"
import ArtworkGrid from "@/components/artwork-grid"

export default function ArtistPage({ params }: { params: { id: string } }) {
  const artist = artists.find((artist) => artist.id === params.id) || artists[0]
  const artistArtworks = artworks.filter((artwork) => artwork.artist === artist.name)

  return (
    <main className="min-h-screen py-8 px-4 md:px-8 max-w-7xl mx-auto">
      <Link href="/artists" className="inline-flex items-center gap-2 mb-8 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to artists
      </Link>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="md:col-span-1">
          <div className="relative aspect-square overflow-hidden rounded-lg mb-6">
            <Image
              src={artist.image || "/placeholder.svg"}
              alt={artist.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </div>
          <div className="flex flex-col gap-4">
            <Button className="w-full gap-2">
              <Mail className="h-4 w-4" /> Contact Artist
            </Button>
            <Button variant="outline" className="w-full">
              Follow
            </Button>
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{artist.name}</h1>
          <p className="text-xl mb-4">{artist.specialty}</p>
          <div className="inline-block bg-muted px-3 py-1 rounded-full text-sm mb-6">{artist.location}</div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Biography</h2>
            <p className="text-muted-foreground whitespace-pre-line">{artist.biography}</p>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm text-muted-foreground">Born</h3>
              <p>{artist.born}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground">Nationality</h3>
              <p>{artist.nationality}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground">Education</h3>
              <p>{artist.education}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground">Awards</h3>
              <p>{artist.awards}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Artworks by {artist.name}</h2>
        <ArtworkGrid artistId={artist.id} />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Exhibitions</h2>
        <ul className="space-y-4">
          {artist.exhibitions.map((exhibition, index) => (
            <li key={index} className="border-b pb-4">
              <p className="font-medium">{exhibition.title}</p>
              <p className="text-sm text-muted-foreground">
                {exhibition.year} • {exhibition.location}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
