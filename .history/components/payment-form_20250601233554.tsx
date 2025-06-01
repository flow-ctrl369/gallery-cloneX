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
import { AlertCircle, CreditCard, Loader2, Lock, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

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
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

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
    setFormError(null)
    setFormSuccess(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setFormSuccess("Payment processed successfully!")
      router.push(`/payment-success?artworkId=${artworkId}`)
    } catch (error) {
      setFormError("Failed to process payment. Please try again.")
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
          <p className="text-muted-foreground font-medium">Loading payment form...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-6 space-y-1">
          <div className="flex items-center justify-between mb-6">
            <CardTitle className="text-2xl font-semibold tracking-tight">Complete Your Purchase</CardTitle>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  currentStep === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  1
                </div>
                <span className={cn(
                  "text-sm font-medium tracking-wide",
                  currentStep === 1 ? "text-primary" : "text-muted-foreground"
                )}>Details</span>
              </div>
              <div className="w-12 h-[1px] bg-border" />
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  currentStep === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  2
                </div>
                <span className={cn(
                  "text-sm font-medium tracking-wide",
                  currentStep === 2 ? "text-primary" : "text-muted-foreground"
                )}>Payment</span>
              </div>
            </div>
          </div>
          <CardDescription className="text-base text-muted-foreground">
            {currentStep === 1 
              ? "Enter your contact information" 
              : "Complete your payment securely"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {formError && (
            <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-medium">Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          {formSuccess && (
            <Alert className="animate-in fade-in slide-in-from-top-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="font-medium text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">{formSuccess}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {currentStep === 1 ? (
                <>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your name" 
                              className="h-11 text-base" 
                              {...field} 
                              disabled={isProcessing} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="your.email@example.com" 
                              type="email" 
                              className="h-11 text-base" 
                              {...field} 
                              disabled={isProcessing} 
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Message (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any special requests or notes..."
                              className="resize-none min-h-[100px] text-base"
                              {...field}
                              disabled={isProcessing}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-medium"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Continue to Payment</span>
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Subtotal</span>
                      <span className="font-medium">${price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Shipping</span>
                      <span className="font-medium">Free</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Tax</span>
                      <span className="font-medium">Calculated at checkout</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold text-lg">${price.toLocaleString()}</span>
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
                    className="w-full h-12 text-base font-medium"
                    onClick={() => setCurrentStep(1)}
                    disabled={isProcessing}
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    <span>Back to Details</span>
                  </Button>
                </>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4 border-t">
          <CreditCard className="h-4 w-4" />
          <p className="font-medium">Secure payment powered by Stripe</p>
        </CardFooter>
      </Card>
    </div>
  )
} 