"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { artworks } from "@/lib/data"
import ErrorBoundary from "@/components/error-boundary"
import LoadingSpinner from "@/components/loading-spinner"
import { Suspense } from "react"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const artworkId = searchParams.get("artworkId")
  const artwork = artworks.find((art) => art.id === artworkId)

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Payment Successful!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase{artwork ? ` of "${artwork.title}"` : ""}. We'll contact you shortly with shipping details.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/gallery">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

export default function PaymentSuccessPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner size={32} />}>
        <PaymentSuccessContent />
      </Suspense>
    </ErrorBoundary>
  )
} 