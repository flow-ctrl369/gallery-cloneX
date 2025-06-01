'use client';

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Heart, Share } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { artworks } from "@/lib/data"
import RelatedArtworks from "@/components/related-artworks"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import PaymentForm from "@/components/payment-form"

export default function ArtworkPage({ params }: { params: { id: string } }) {
  const artwork = artworks.find((art) => art.id === params.id) || artworks[0]

  return (
    <main className="min-h-screen py-8 px-4 md:px-8 max-w-7xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-2 mb-8 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to gallery
      </Link>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={artwork.image || "/placeholder.svg"}
            alt={artwork.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{artwork.title}</h1>
              <p className="text-xl mb-4">{artwork.artist}</p>
              <div className="inline-block bg-muted px-3 py-1 rounded-full text-sm mb-6">{artwork.category}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Add to favorites</span>
              </Button>
              <Button variant="outline" size="icon">
                <Share className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground">{artwork.description}</p>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm text-muted-foreground">Year</h3>
              <p>{artwork.year}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground">Dimensions</h3>
              <p>{artwork.dimensions}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground">Medium</h3>
              <p>{artwork.medium}</p>
            </div>
            <div>
              <h3 className="text-sm text-muted-foreground">Location</h3>
              <p>{artwork.location}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl font-bold">${artwork.price.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{artwork.availability}</div>
            </div>
            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex-1">Purchase</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Complete Your Purchase</DialogTitle>
                  </DialogHeader>
                  <PaymentForm amount={artwork.price} artworkId={artwork.id} />
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="flex-1">
                Make an Offer
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Related Artworks</h2>
        <RelatedArtworks currentId={params.id} category={artwork.category} />
      </section>
    </main>
  )
}
