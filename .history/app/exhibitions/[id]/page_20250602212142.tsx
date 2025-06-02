"use client";

import { exhibitions } from "@/lib/exhibitions";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import PageTransition from "@/components/page-transition";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BookTicketsForm from "@/components/book-tickets-form";
import { useParams } from "next/navigation";

export default function ExhibitionPage() {
  const params = useParams();
  const exhibitionId = parseInt(params.id as string);
  const exhibition = exhibitions.find((e) => e.id === exhibitionId);

  if (!exhibition) {
    notFound();
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-8"
          asChild
        >
          <Link href="/exhibitions" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Exhibitions
        </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="relative h-[400px] lg:h-[600px] w-full">
          <Image
              src={exhibition.image}
            alt={exhibition.title}
            fill
              className="object-cover rounded-lg"
            />
        </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4 uppercase tracking-wider relative inline-block">
                {exhibition.title}
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
              </h1>
              <p className="text-muted-foreground text-lg">{exhibition.description}</p>
            </div>

              <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3" />
                  <div>
                  <p className="font-medium">Exhibition Dates</p>
                  <p className="text-muted-foreground">
                    {new Date(exhibition.startDate).toLocaleDateString()} -{" "}
                    {new Date(exhibition.endDate).toLocaleDateString()}
                  </p>
                  </div>
                </div>

              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{exhibition.location}</p>
                </div>
                </div>

              <div className="flex items-center">
                <Users className="w-5 h-5 mr-3" />
                <div>
                  <p className="font-medium">Curator</p>
                  <p className="text-muted-foreground">{exhibition.curator}</p>
                </div>
                </div>
              </div>

            <div className="pt-4">
              <h2 className="text-2xl font-bold mb-4 uppercase tracking-wider relative inline-block">
                Featured Artists
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {exhibition.featuredArtists.map((artist, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <p className="font-medium">{artist}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full">
                    Book Tickets
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Book Tickets</DialogTitle>
                  </DialogHeader>
                  <BookTicketsForm exhibitionId={exhibition.id} ticketPrice={exhibition.ticketPrice} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 uppercase tracking-wider relative inline-block">
            About the Exhibition
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
          </h2>
          <div className="prose prose-lg max-w-none">
            <p>
              This exhibition brings together a diverse collection of works that explore the theme of
              {exhibition.title.toLowerCase()}. Through various mediums and perspectives, the featured
              artists challenge conventional notions and invite viewers to engage with art in new and
              meaningful ways.
            </p>
            <p>
              The exhibition is curated by {exhibition.curator}, who has carefully selected works that
              not only showcase technical excellence but also tell compelling stories and evoke
              emotional responses. Each piece has been chosen to contribute to the overall narrative
              of the exhibition while standing strong on its own merits.
            </p>
          </div>
          </div>
      </div>
    </PageTransition>
  );
}
