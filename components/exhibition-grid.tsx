import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { exhibitions } from "@/lib/data"

interface ExhibitionGridProps {
  status?: "current" | "upcoming" | "past"
}

export default function ExhibitionGrid({ status }: ExhibitionGridProps) {
  const currentDate = new Date()

  const filteredExhibitions = status
    ? exhibitions.filter((exhibition) => {
        const startDate = new Date(exhibition.startDate)
        const endDate = new Date(exhibition.endDate)

        switch (status) {
          case "current":
            return startDate <= currentDate && endDate >= currentDate
          case "upcoming":
            return startDate > currentDate
          case "past":
            return endDate < currentDate
          default:
            return true
        }
      })
    : exhibitions

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredExhibitions.map((exhibition) => (
        <Link href={`/exhibitions/${exhibition.id}`} key={exhibition.id}>
          <Card className="overflow-hidden h-full transition-all hover:shadow-md">
            <div className="aspect-[3/2] relative">
              <Image
                src={exhibition.image || "/placeholder.svg"}
                alt={exhibition.title}
                fill
                className="object-cover transition-transform hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{exhibition.dateRange}</span>
              </div>
              <h3 className="font-medium line-clamp-1">{exhibition.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{exhibition.subtitle}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
