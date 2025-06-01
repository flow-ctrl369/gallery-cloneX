"use client";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js"
import { AlertCircle, CreditCard, Loader2, Lock, ArrowLeft, ArrowRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  address_line1: z.string().min(1, "Street address is required"),
  address_city: z.string().min(1, "City is required"),
  address_state: z.string().min(1, "State/Province is required"),
  address_zip: z.string().min(1, "ZIP/Postal Code is required"),
  address_country: z.string().min(1, "Country is required"),
})

interface PaymentFormProps {
  price: number
  artworkId: string
}

interface StripePaymentFormProps {
  options: any; // Options for Stripe elements
  error: string | null; // Error from parent component
  setError: (error: string | null) => void; // Function to set error in parent
}

function StripePaymentForm({ options, error, setError }: StripePaymentFormProps) {
  const elements = useElements()

  // Clear Stripe element errors when formError in parent changes
  useEffect(() => {
    if (error === null && elements) {
      const cardNumberElement = elements.getElement(CardNumberElement)
      const cardExpiryElement = elements.getElement(CardExpiryElement)
      const cardCvcElement = elements.getElement(CardCvcElement)
      cardNumberElement?.clear()
      cardExpiryElement?.clear()
      cardCvcElement?.clear()
    }
  }, [error, elements])

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="card-number">Card number</Label>
        <CardNumberElement
          id="card-number"
          options={options}
          className="border rounded-md p-2.5 mt-1"
          onChange={() => setError(null)} // Clear parent error on change
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="card-expiry">Expiration</Label>
          <CardExpiryElement
            id="card-expiry"
            options={options}
            className="border rounded-md p-2.5 mt-1"
            onChange={() => setError(null)} // Clear parent error on change
          />
        </div>
        <div>
          <Label htmlFor="card-cvc">CVC</Label>
          <CardCvcElement
            id="card-cvc"
            options={options}
            className="border rounded-md p-2.5 mt-1"
            onChange={() => setError(null)} // Clear parent error on change
          />
        </div>
      </div>
    </div>
  )
}

export default function PaymentForm({ price, artworkId }: PaymentFormProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formError, setFormError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const stripe = useStripe()
  const elements = useElements() // Get elements from the outer Elements provider

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      address_line1: "",
      address_city: "",
      address_state: "",
      address_zip: "",
      address_country: "United States",
    },
  })

  // Fetch client secret when moving to step 2
  useEffect(() => {
    if (currentStep === 2 && price > 0 && !clientSecret) {
      setIsProcessing(true)
      setFormError(null) // Clear previous errors
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price * 100 }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret)
          setIsProcessing(false)
        })
        .catch((err) => {
          setFormError("Failed to load payment options. Please try again.")
          setIsProcessing(false)
          console.error("Failed to fetch client secret:", err)
        })
    }
  }, [currentStep, price, clientSecret])

  const handleNextStep = async () => {
    const isValid = await form.trigger(['name', 'email', 'address_line1', 'address_city', 'address_state', 'address_zip', 'address_country'])
    if (isValid) {
      setCurrentStep(2)
      setFormError(null) // Clear previous errors on step change
    } else {
      setFormError("Please fill in all required details.")
    }
  }

  const handleBackStep = () => {
    setCurrentStep(1)
    setFormError(null) // Clear errors on step change
  }

  const handlePaymentSubmit = async () => {
    if (!stripe || !elements || !clientSecret) {
      // Stripe.js has not yet loaded or client secret is missing.
      setFormError("Payment processing is not ready. Please try again.")
      return
    }

    setIsProcessing(true)
    setFormError(null) // Clear previous errors

    const cardElement = elements.getElement(CardNumberElement)

    if (!cardElement) {
      setFormError("Card input not found.")
      setIsProcessing(false)
      return
    }

    const values = form.getValues() // Get the latest form values

    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: values.name,
          email: values.email,
          address: {
            line1: values.address_line1,
            city: values.address_city,
            state: values.address_state,
            postal_code: values.address_zip,
            country: values.address_country,
          },
        },
      },
    })

    if (confirmError) {
      setFormError(confirmError.message || "An error occurred during payment.")
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      router.push(
        `/payment-success?payment_intent=${paymentIntent.id}&payment_intent_client_secret=${paymentIntent.client_secret}`
      )
    } else {
      // Handle other payment intents statuses like processing, requires_action, etc.
      // For now, treat anything not succeeded as a potential issue.
      setFormError("Payment failed or was not successful.")
    }

    setIsProcessing(false)
  }

  return (
    <div className="container max-w-lg mx-auto px-4 py-8">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl font-semibold">
              Complete Your Purchase
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                    currentStep === 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  1
                </div>
                <span
                  className={cn(
                    "text-sm",
                    currentStep === 1 ? "text-primary font-medium" : "text-muted-foreground"
                  )}
                >
                  Details
                </span>
              </div>
              <div className="w-8 h-[1px] bg-border" />
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                    currentStep === 2
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  2
                </div>
                <span
                  className={cn(
                    "text-sm",
                    currentStep === 2 ? "text-primary font-medium" : "text-muted-foreground"
                  )}
                >
                  Payment
                </span>
              </div>
            </div>
          </div>
          <CardDescription>
            {currentStep === 1
              ? "Enter your contact and delivery information"
              : "Complete your payment securely"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePaymentSubmit)} className="space-y-6">
              {currentStep === 1 ? (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input placeholder="Your name" {...field} disabled={isProcessing} /></FormControl>
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
                        <FormControl><Input placeholder="your.email@example.com" type="email" {...field} disabled={isProcessing} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label>Delivery Address</Label>
                    <FormField
                      control={form.control}
                      name="address_line1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Street Address</FormLabel>
                          <FormControl><Input placeholder="Street Address" {...field} disabled={isProcessing} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="address_city"
                        render={({ field }) => (
                          <FormItem>
                             <FormLabel className="sr-only">City</FormLabel>
                            <FormControl><Input placeholder="City" {...field} disabled={isProcessing} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="address_state"
                        render={({ field }) => (
                          <FormItem>
                             <FormLabel className="sr-only">State/Province</FormLabel>
                            <FormControl><Input placeholder="State/Province" {...field} disabled={isProcessing} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="address_zip"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">ZIP/Postal Code</FormLabel>
                                <FormControl><Input placeholder="ZIP/Postal Code" {...field} disabled={isProcessing} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address_country"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="sr-only">Country</FormLabel>
                                <FormControl><Input placeholder="Country" {...field} disabled={isProcessing} /></FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                     </div>
                  </div>
                ) : (
                  <div className="space-y-4">
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
                    <StripePaymentForm options={{
                       style: {
                         base: {
                           fontSize: "16px",
                           color: "hsl(var(--foreground))",
                           "::placeholder": { color: "hsl(var(--muted-foreground))" },
                         },
                         invalid: { color: "hsl(var(--destructive))" },
                       },
                     }} error={formError} setError={setFormError} />
                  </div>
                )}

              <div className="flex gap-4 pt-2">
                {currentStep === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10 text-base font-medium"
                    onClick={handleBackStep}
                    disabled={isProcessing}
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    <span>Back to Details</span>
                  </Button>
                )}
                {currentStep === 1 && (
                   <Button
                     type="button"
                     className="w-full h-10 text-base font-medium"
                     onClick={handleNextStep}
                     disabled={isProcessing}
                   >
                      <span>Continue to Payment</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                )}
                 {currentStep === 2 && (
                    <Button
                       type="submit"
                       className="flex-1 h-10 text-base font-medium"
                       disabled={isProcessing || !clientSecret}
                     >
                       {isProcessing ? (
                         <div className="flex items-center gap-2">
                           <Loader2 className="h-5 w-5 animate-spin" />
                           Processing...
                         </div>
                       ) : (
                         <div className="flex items-center gap-2">
                           <Lock className="h-5 w-5" />
                           <span>Purchase Now</span>
                         </div>
                       )}
                     </Button>
                 )}
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-3 border-t">
          <CreditCard className="h-4 w-4" />
          <p className="font-medium">Secure payment powered by Stripe</p>
        </CardFooter>
      </Card>
    </div>
  )
} 