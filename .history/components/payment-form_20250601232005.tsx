"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import GooglePayButton from "@google-pay/button-react"
import { AlertCircle, CreditCard, Loader2, Lock, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().optional(),
})

interface PaymentFormProps {
  price: number
  artworkId: string
}

function StripePaymentForm({ price, artworkId }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?artworkId=${artworkId}`,
        },
      })

      if (submitError) {
        setError(submitError.message || "An error occurred")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-sm">Error</AlertTitle>
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
      <Button
        type="submit"
        className="w-full h-10"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Pay ${price.toLocaleString()}
          </div>
        )}
      </Button>
    </form>
  )
}

export default function PaymentForm({ price, artworkId }: PaymentFormProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isFormLoading, setIsFormLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "google">("stripe")
  const [googlePayError, setGooglePayError] = useState<string | null>(null)
  const [isGooglePayReady, setIsGooglePayReady] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push(`/payment-success?artworkId=${artworkId}`)
    } catch (error) {
      console.error("Payment error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGooglePaySuccess = async (paymentData: any) => {
    setIsProcessing(true)
    setGooglePayError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push(`/payment-success?artworkId=${artworkId}`)
    } catch (error) {
      console.error("Google Pay error:", error)
      setGooglePayError("Failed to process payment. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGooglePayError = (error: any) => {
    console.error("Google Pay error:", error)
    setGooglePayError("Failed to initialize Google Pay. Please try another payment method.")
  }

  const handleGooglePayReady = () => {
    setIsGooglePayReady(true)
    setGooglePayError(null)
  }

  const handleGooglePayCancel = () => {
    setGooglePayError(null)
  }

  const handleGooglePayClick = () => {
    setGooglePayError(null)
  }

  useState(() => {
    const timer = setTimeout(() => {
      setIsFormLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  })

  if (isFormLoading) {
    return (
      <div className="h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading payment form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isProcessing && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Processing your payment...</p>
            </div>
          </div>
        )}
        
        <div className={cn("space-y-6", isProcessing && "opacity-50 pointer-events-none")}>
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Please provide your details for the purchase.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} disabled={isProcessing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" type="email" {...field} disabled={isProcessing} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any special requests or notes..."
                            className="resize-none min-h-[100px]"
                            {...field}
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className={cn("space-y-6", isProcessing && "opacity-50 pointer-events-none")}>
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Complete your purchase securely</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>${price.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant={paymentMethod === "stripe" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setPaymentMethod("stripe")}
                    disabled={isProcessing}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Credit Card
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === "google" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setPaymentMethod("google")}
                    disabled={isProcessing}
                  >
                    Google Pay
                  </Button>
                </div>

                {paymentMethod === "stripe" ? (
                  <Elements stripe={stripePromise} options={{
                    mode: "payment",
                    amount: price * 100,
                    currency: "usd",
                    appearance: {
                      theme: "stripe",
                    },
                  }}>
                    <StripePaymentForm price={price} artworkId={artworkId} />
                  </Elements>
                ) : (
                  <div className="space-y-4">
                    {googlePayError && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle className="text-sm">Error</AlertTitle>
                        <AlertDescription className="text-sm">{googlePayError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="w-full flex justify-center">
                      {isProcessing ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing payment...
                        </div>
                      ) : (
                        <GooglePayButton
                          environment="TEST"
                          paymentRequest={{
                            apiVersion: 2,
                            apiVersionMinor: 0,
                            allowedPaymentMethods: [
                              {
                                type: "CARD",
                                parameters: {
                                  allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                                  allowedCardNetworks: ["MASTERCARD", "VISA", "AMEX", "DISCOVER"],
                                },
                                tokenizationSpecification: {
                                  type: "PAYMENT_GATEWAY",
                                  parameters: {
                                    gateway: "stripe",
                                    "stripe:version": "2020-08-27",
                                    "stripe:publishableKey": process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
                                  },
                                },
                              },
                            ],
                            merchantInfo: {
                              merchantId: "12345678901234567890",
                              merchantName: "Art Gallery",
                            },
                            transactionInfo: {
                              totalPriceStatus: "FINAL",
                              totalPriceLabel: "Total",
                              totalPrice: price.toString(),
                              currencyCode: "USD",
                              countryCode: "US",
                            },
                          }}
                          onLoadPaymentData={handleGooglePaySuccess}
                          onError={handleGooglePayError}
                          onReadyToPayChange={handleGooglePayReady}
                          onCancel={handleGooglePayCancel}
                          onClick={handleGooglePayClick}
                          buttonType="buy"
                          buttonColor="black"
                          buttonLocale="en"
                          buttonSizeMode="fill"
                          existingPaymentMethodRequired={false}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <p>Your payment is secured by Stripe. We never store your card details.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 