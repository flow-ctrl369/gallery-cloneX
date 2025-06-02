import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export default function UpcomingExhibitions() {
  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold uppercase tracking-wider relative inline-block">
          Upcoming Exhibitions
          <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
        </h2>
        <Button variant="ghost" className="gap-2" asChild>
          <Link href="/exhibitions">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example exhibition cards - replace with actual data */}
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video relative">
              <Image
                src={`https://images.unsplash.com/photo-${1500000000000 + i}?w=800&h=600&fit=crop`}
                alt="Exhibition"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium">Exhibition Title {i}</h3>
              <p className="text-sm text-muted-foreground">Date: Coming Soon</p>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link href={`/exhibitions/${i}`}>Learn More</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
} 