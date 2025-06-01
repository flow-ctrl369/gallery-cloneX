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

function StripePaymentForm({ price, artworkId }: PaymentFormProps) {
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

  return (
     <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Donate with Stripe Payment Element</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Payment Method Options - Simplified for Card */} 
                    <div className="grid grid-cols-3 gap-4">
                        <div className="border-2 border-primary rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer">
                            <CreditCard className="h-6 w-6 mb-1" />
                            <span className="text-sm font-medium">Card</span>
                        </div>
                         {/* Add other payment methods here if needed */}
                         <div className="border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 mb-1"><path d="M17.65 5.38L12 10.73L6.35 5.38C5.57 4.6 4.3 4.6 3.52 5.38C2.74 6.16 2.74 7.43 3.52 8.21L12 16.24L20.48 8.21C21.26 7.43 21.26 6.16 20.48 5.38C19.7 4.6 18.43 4.6 17.65 5.38Z" /><path d="M3.52 15.79L12 23.79L20.48 15.79C21.26 15.01 21.26 13.74 20.48 12.96C19.7 12.18 18.43 12.18 17.65 12.96L12 18.31L6.35 12.96C5.57 12.18 4.3 12.18 3.52 12.96C2.74 13.74 2.74 15.01 3.52 15.79Z" /></svg>
                            <span className="text-sm font-medium">Cash App Pay</span>
                        </div>
                         <div className="border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer text-muted-foreground">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 mb-1"><path d="M21 3H3C1.89 3 1 3.89 1 5V19C1 20.11 1.89 21 3 21H21C22.11 21 23 20.11 23 19V5C23 3.89 22.11 3 21 3ZM21 19H3V5H21V19ZM11 15H7V17H11V15ZM11 11H7V13H11V11ZM15 15H13V17H15V15ZM15 11H13V13H15V11ZM19 15H17V17H19V15ZM19 11H17V13H19V11Z" /></svg>
                           <span className="text-sm font-medium">US bank account</span>
                        </div>
                    </div>

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

                        <div>
                            <Label htmlFor="card-number">Card number</Label>
                            <CardNumberElement id="card-number" options={options} className="border rounded-md p-2.5 mt-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="card-expiry">Expiration</Label>
                                <CardExpiryElement id="card-expiry" options={options} className="border rounded-md p-2.5 mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="card-cvc">CVC</Label>
                                <CardCvcElement id="card-cvc" options={options} className="border rounded-md p-2.5 mt-1" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="address_line1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Street Address</FormLabel>
                                        <FormControl><Input placeholder="Street Address" {...field} disabled={isProcessing} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address_city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl><Input placeholder="City" {...field} disabled={isProcessing} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="address_state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State/Province</FormLabel>
                                        <FormControl><Input placeholder="State/Province" {...field} disabled={isProcessing} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address_zip"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ZIP/Postal Code</FormLabel>
                                        <FormControl><Input placeholder="ZIP/Postal Code" {...field} disabled={isProcessing} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="address_country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl><Input placeholder="Country" {...field} disabled={isProcessing} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                </CardContent>
                <CardFooter>
                     <Button
                        type="submit"
                        className="w-full h-11"
                        disabled={!stripe || isProcessing || !clientSecret}
                    >
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
                </CardFooter>
            </Card>
        </form>
     </Form>
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

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setFormError(null); // Clear previous errors
      return;
    }

    // Handle payment submission for Step 2
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
    const elements = stripe?.elements();

    if (!stripe || !elements) {
      setFormError("Stripe has not loaded properly. Please try again.");
      return;
    }

     const cardElement = elements.getElement(CardNumberElement);

    if (!cardElement) {
        setFormError("Card input not found.");
        return;
    }

    setIsProcessing(true);
    setFormError(null);

    try {
       // Assuming clientSecret is fetched in StripePaymentForm or passed down
       // For this example, we'll simulate success/failure or rely on StripePaymentForm's internal handling
       // In a real app, you would confirm the payment intent here using clientSecret and collected details

       // Simulate payment confirmation
       const clientSecret = "simulate_client_secret"; // Replace with actual fetched client secret

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
        });

        if (confirmError) {
            setFormError(confirmError.message || "An error occurred during payment.");
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
             router.push(
                `/payment-success?payment_intent=${paymentIntent.id}&payment_intent_client_secret=${paymentIntent.client_secret}`
             );
        } else {
            setFormError("Payment failed or was not successful.");
        }

    } catch (error) {
      setFormError("An unexpected error occurred during payment.");
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

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
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {currentStep === 1 ? (
                <div className="space-y-4">
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
                          <Input
                            placeholder="your.email@example.com"
                            type="email"
                            {...field}
                            disabled={isProcessing}
                          />
                        </FormControl>
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
                          <FormControl>
                            <Input placeholder="Street Address" {...field} disabled={isProcessing} />
                          </FormControl>
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
                            <FormControl>
                              <Input placeholder="City" {...field} disabled={isProcessing} />
                            </FormControl>
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
                            <FormControl>
                              <Input placeholder="State/Province" {...field} disabled={isProcessing} />
                            </FormControl>
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
                                <FormControl>
                                <Input placeholder="ZIP/Postal Code" {...field} disabled={isProcessing} />
                                </FormControl>
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
                                <FormControl>
                                {/* Consider replacing with a select for countries */}
                                <Input placeholder="Country" {...field} disabled={isProcessing} />
                                </FormControl>
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
                    <StripePaymentForm price={price} artworkId={artworkId} />
                  </Elements>
                </div>
              )}

              <div className="flex gap-4 pt-2">
                {currentStep === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10 text-base font-medium"
                    onClick={() => setCurrentStep(1)}
                    disabled={isProcessing}
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    <span>Back to Details</span>
                  </Button>
                )}
                <Button
                  type="submit"
                  className={cn(
                    "flex-1 h-10 text-base font-medium",
                    currentStep === 1 ? "w-full" : ""
                  )}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {currentStep === 1 ? (
                        <>
                          <span>Continue to Payment</span>
                          <ArrowRight className="h-5 w-5" />
                        </>
                      ) : (
                        <>
                          <Lock className="h-5 w-5" />
                          <span>Purchase Now</span>
                        </>
                      )}
                    </div>
                  )}
                </Button>
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