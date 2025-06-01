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
import { AlertCircle, CreditCard, Loader2, Lock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  country: z.string().min(1, "Country is required"),
  zip: z.string().min(1, "ZIP is required"),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      country: "United States",
      zip: "",
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!stripe || !elements || !clientSecret) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
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

    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: cardElement,
            billing_details: {
                name: values.name,
                email: values.email,
                address: {
                    country: values.country,
                    postal_code: values.zip,
                }
            },
        },
    });

    if (confirmError) {
        setError(confirmError.message || "An error occurred");
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        router.push(`/payment-success?payment_intent=${paymentIntent.id}&payment_intent_client_secret=${paymentIntent.client_secret}`);
    } else {
         setError("Payment failed or was not successful.");
    }

    setIsProcessing(false);
  };

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

                        <div>
                            <Label htmlFor="card-number">Card number</Label>
                            <CardNumberElement id="card-number" options={options} className="border rounded-md p-2 mt-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="card-expiry">Expiration</Label>
                                <CardExpiryElement id="card-expiry" options={options} className="border rounded-md p-2 mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="card-cvc">CVC</Label>
                                <CardCvcElement id="card-cvc" options={options} className="border rounded-md p-2 mt-1" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input placeholder="United States" {...field} disabled={isProcessing} /> {/* Replace with select if needed */}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="zip"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>ZIP</FormLabel>
                                        <FormControl>
                                            <Input placeholder="12345" {...field} disabled={isProcessing} />
                                        </FormControl>
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
                                Donate Now {/* Updated button text */}
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
  return (
    <div className="container max-w-md mx-auto px-4 py-8">
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
    </div>
  )
} 