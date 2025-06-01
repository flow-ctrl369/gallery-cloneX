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
import { AlertCircle, CreditCard, Loader2, Lock, ArrowLeft, ArrowRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button
        type="submit"
        className="w-full h-11"
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
  const [currentStep, setCurrentStep] = useState(1)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (currentStep === 1) {
      setCurrentStep(2)
      return
    }
    
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

  useState(() => {
    const timer = setTimeout(() => {
      setIsFormLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  })

  if (isFormLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading payment form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-4">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-2">
            <CardTitle>Complete Your Purchase</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={currentStep === 1 ? "text-primary font-medium" : ""}>Step 1: Details</span>
              <span>/</span>
              <span className={currentStep === 2 ? "text-primary font-medium" : ""}>Step 2: Payment</span>
            </div>
          </div>
          <CardDescription>
            {currentStep === 1 
              ? "Enter your contact information" 
              : "Complete your payment securely"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {currentStep === 1 ? (
                <>
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
                            className="resize-none min-h-[80px]"
                            {...field}
                            disabled={isProcessing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    <span>Continue to Payment</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
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
                    <Separator className="my-1.5" />
                    <div className="flex items-center justify-between font-semibold">
                      <span>Total</span>
                      <span>${price.toLocaleString()}</span>
                    </div>
                  </div>

                  <Elements stripe={stripePromise} options={{
                    mode: "payment",
                    amount: price * 100,
                    currency: "usd",
                    appearance: {
                      theme: "stripe",
                      variables: {
                        colorPrimary: "hsl(var(--primary))",
                        colorBackground: "hsl(var(--background))",
                        colorText: "hsl(var(--foreground))",
                        colorDanger: "hsl(var(--destructive))",
                        fontFamily: "var(--font-sans)",
                        spacingUnit: "4px",
                        borderRadius: "8px",
                      },
                    },
                  }}>
                    <StripePaymentForm price={price} artworkId={artworkId} />
                  </Elements>

                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span>Back to Details</span>
                  </Button>
                </>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
          <CreditCard className="h-4 w-4" />
          <p>Secure payment powered by Stripe</p>
        </CardFooter>
      </Card>
    </div>
  )
} 