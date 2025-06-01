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
  price: number
  artworkId: string
  billingDetails: z.infer<typeof formSchema>
}

function StripePaymentForm({ price, artworkId, billingDetails }: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: price * 100 }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [price]);

  const options = {
    style: {
        base: {
            fontSize: '16px',
            color: 'hsl(var(--foreground))',
            '::placeholder': { color: 'hsl(var(--muted-foreground))' },
        },
        invalid: { color: 'hsl(var(--destructive))' },
    },
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardNumberElement);

    if (!cardElement) {
        setError("Card input not found.");
        setIsProcessing(false);
        return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingDetails.name,
            email: billingDetails.email,
            address: {
              line1: billingDetails.address_line1,
              city: billingDetails.address_city,
              state: billingDetails.address_state,
              postal_code: billingDetails.address_zip,
              country: billingDetails.address_country,
            },
          },
        },
      }
    );

    if (confirmError) {
      setError(confirmError.message || "An error occurred");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      router.push(
        `/payment-success?payment_intent=${paymentIntent.id}&payment_intent_client_secret=${paymentIntent.client_secret}`
      );
    } else {
        // Handle other payment intents statuses like processing, requires_action, etc.
        // For now, treat anything not succeeded as a potential issue.
         setError("Payment failed or was not successful.");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="card-number">Card number</Label>
        <CardNumberElement
          id="card-number"
          options={options}
          className="border rounded-md p-2.5 mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="card-expiry">Expiration</Label>
          <CardExpiryElement
            id="card-expiry"
            options={options}
            className="border rounded-md p-2.5 mt-1"
          />
        </div>
        <div>
          <Label htmlFor="card-cvc">CVC</Label>
          <CardCvcElement
            id="card-cvc"
            options={options}
            className="border rounded-md p-2.5 mt-1"
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
       <Button type="submit" className="w-full h-11" disabled={!stripe || isProcessing || !clientSecret}>
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Purchase Now
                </div>
              )}
        </Button>
    </form>
  );
}

export default function PaymentForm({ price, artworkId }: PaymentFormProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formError, setFormError] = useState<string | null>(null);

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
  });

  const handleNextStep = async () => {
      const isValid = await form.trigger(['name', 'email', 'address_line1', 'address_city', 'address_state', 'address_zip', 'address_country']);
      if (isValid) {
          setCurrentStep(2);
          setFormError(null); // Clear previous errors on step change
      } else {
           setFormError("Please fill in all required details.");
      }
  }

  const handleBackStep = () => {
      setCurrentStep(1);
      setFormError(null); // Clear errors on step change
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
            <div>
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
                  <Elements
                    stripe={stripePromise}
                    options={{
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
                    }}
                  >
                    <StripePaymentForm price={price} artworkId={artworkId} billingDetails={form.getValues()} />
                  </Elements>
                </div>
              )}
            </div>
          </Form>
        </CardContent>
        <CardFooter className="flex gap-4 pt-2">
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
        </CardFooter>
      </Card>
    </div>
  )
} 