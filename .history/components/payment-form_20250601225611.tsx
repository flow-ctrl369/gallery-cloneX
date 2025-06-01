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
        <div className="text-sm text-destructive mt-2">
          {error}
        </div>
      )}
      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? "Processing..." : `Pay $${price.toLocaleString()}`}
      </Button>
    </form>
  )
}

export default function PaymentForm({ price, artworkId }: PaymentFormProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "google">("stripe")

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
      // Here you would typically handle the form submission
      // For now, we'll just simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push(`/payment-success?artworkId=${artworkId}`)
    } catch (error) {
      console.error("Payment error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGooglePaySuccess = async (paymentData: any) => {
    try {
      // Here you would typically process the Google Pay payment
      // For now, we'll just simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push(`/payment-success?artworkId=${artworkId}`)
    } catch (error) {
      console.error("Google Pay error:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
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
                  <Input placeholder="your.email@example.com" type="email" {...field} />
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
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            type="button"
            variant={paymentMethod === "stripe" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setPaymentMethod("stripe")}
          >
            Credit Card
          </Button>
          <Button
            type="button"
            variant={paymentMethod === "google" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setPaymentMethod("google")}
          >
            Google Pay
          </Button>
        </div>

        {paymentMethod === "stripe" ? (
          <Elements stripe={stripePromise} options={{
            mode: "payment",
            amount: price * 100, // Convert to cents
            currency: "usd",
            appearance: {
              theme: "stripe",
            },
          }}>
            <StripePaymentForm price={price} artworkId={artworkId} />
          </Elements>
        ) : (
          <div className="w-full flex justify-center">
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
                      allowedCardNetworks: ["MASTERCARD", "VISA"],
                    },
                    tokenizationSpecification: {
                      type: "PAYMENT_GATEWAY",
                      parameters: {
                        gateway: "stripe",
                        "stripe:version": "2020-08-27",
                        "stripe:publishableKey": process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
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
              buttonType="buy"
              buttonColor="black"
              buttonLocale="en"
            />
          </div>
        )}
      </div>
    </div>
  )
} 