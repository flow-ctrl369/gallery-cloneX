'use client';

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Heart, Share, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { artworks } from "@/lib/data"
import RelatedArtworks from "@/components/related-artworks"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PaymentForm } from "@/components/payment-form"
import { notFound } from "next/navigation"
import PageTransition from "@/components/page-transition"
import MakeOfferForm from "@/components/make-offer-form"
import { useState } from 'react';
import PurchaseInfoForm, { PurchaseInfo } from "@/components/purchase-info-form";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '@/components/checkout-form';
import { toast, useToast } from "@/components/ui/use-toast"
import { useParams } from 'next/navigation';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function ArtworkPage() {
  const params = useParams();
  const artwork = artworks.find((artwork) => artwork.id === params.id);
  const [showPayment, setShowPayment] = useState(false);
  const [purchaseInfo, setPurchaseInfo] = useState<PurchaseInfo | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (!artwork) {
    notFound();
  }

  const handlePurchaseInfoComplete = async (info: PurchaseInfo) => {
    setLoading(true);
    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: artwork.price,
          artworkId: artwork.id,
          artworkTitle: artwork.title,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      setClientSecret(data.clientSecret);
      setPurchaseInfo(info);
      setShowPayment(true);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowPayment(false);
    setClientSecret(null);
  };

  const appearance = {
    theme: 'stripe' as const,
  };

  const options = clientSecret ? {
    clientSecret,
    appearance,
  } : undefined;

  return (
    <PageTransition>
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
                <h1 className="text-3xl font-bold mb-2 uppercase tracking-wider relative inline-block">
                  {artwork.title}
                  <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
                </h1>
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
              <h2 className="font-semibold mb-2 uppercase tracking-wider relative inline-block">
                Description
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
              </h2>
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
                  <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
                    <DialogHeader className="px-6 py-4 border-b">
                      <DialogTitle className="text-center">
                        {showPayment ? 'Complete Your Purchase' : 'Purchase Information'}
                      </DialogTitle>
                    </DialogHeader>
                    
                    {!showPayment ? (
                      <div className="p-6">
                        <PurchaseInfoForm 
                          key={showPayment ? 'payment' : 'info'}
                          artworkTitle={artwork.title}
                          onComplete={handlePurchaseInfoComplete}
                          defaultValues={purchaseInfo || undefined}
                        />
                      </div>
                    ) : clientSecret ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 h-full divide-x divide-border">
                        {/* Order Summary */}
                        <div className="p-6 md:p-8 bg-muted dark:bg-gray-800 space-y-6 flex flex-col justify-between">
                          <div className="space-y-6">
                            <div>
                              <h3 className="font-bold mb-4 text-xl">Order Summary</h3>
                              <p className="text-muted-foreground text-sm">Review your purchase details before proceeding to payment.</p>
                            </div>
                            <div className="space-y-4 text-sm">
                              <div className="flex justify-between items-center pb-3 border-b">
                                <span className="text-muted-foreground">Artwork:</span>
                                <span className="font-medium text-right ml-4">{artwork.title}</span>
                              </div>
                              <div className="flex justify-between items-center pb-3 border-b">
                                <span className="text-muted-foreground">Price:</span>
                                <span className="font-medium text-right ml-4">${artwork.price.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between items-center pb-3 border-b">
                                <span className="text-muted-foreground">Name:</span>
                                <span className="font-medium text-right ml-4">{purchaseInfo?.name}</span>
                              </div>
                              <div className="flex justify-between items-center pb-3 border-b">
                                <span className="text-muted-foreground">Email:</span>
                                <span className="font-medium text-right ml-4">{purchaseInfo?.email}</span>
                              </div>
                              <div className="flex justify-between items-start pb-3">
                                <span className="text-muted-foreground">Delivery Address:</span>
                                <span className="font-medium text-right ml-4">{purchaseInfo?.address}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            onClick={handleBack}
                            className="w-full mt-8"
                          >
                            Back to Information
                          </Button>
                        </div>

                        {/* Payment Form */}
                        <div className="p-6 md:p-8 space-y-6 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold mb-4 text-xl">Payment Details</h3>
                            <p className="text-muted-foreground text-sm">Enter your payment information to complete the purchase</p>
                          </div>
                          <Elements stripe={stripePromise} options={options}>
                            <CheckoutForm 
                              artwork={artwork}
                              purchaseInfo={purchaseInfo!}
                            />
                          </Elements>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center p-6">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      Make an Offer
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Make an Offer</DialogTitle>
                    </DialogHeader>
                    <MakeOfferForm 
                      artworkId={parseInt(artwork.id)} 
                      artworkTitle={artwork.title} 
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-wider relative inline-block">
            Related Artworks
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    Make an Offer
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Make an Offer</DialogTitle>
                  </DialogHeader>
                  <MakeOfferForm 
                    artworkId={parseInt(artwork.id)} 
                    artworkTitle={artwork.title} 
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 uppercase tracking-wider relative inline-block">
            Related Artworks
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
          </h2>
          <RelatedArtworks currentId={artwork.id} category={artwork.category} />
      </section>
    </main>
    </PageTransition>
  )
}
