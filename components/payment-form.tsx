"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Smartphone, Banknote, Shield, Truck, Clock } from "lucide-react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  price: number;
  artworkId: string;
}

function PaymentFormContent({ price, artworkId }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "googlepay">("card");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGooglePay = async () => {
    if (!stripe || !elements) return;

    setIsLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="card" value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "card" | "googlepay")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="card" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Card</span>
          </TabsTrigger>
          <TabsTrigger value="googlepay" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <span>Google Pay</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="card" className="space-y-4">
          <PaymentElement />
          <Button
            type="submit"
            className="w-full"
            disabled={!stripe || isLoading}
          >
            {isLoading ? "Processing..." : `Pay $${price.toFixed(2)}`}
          </Button>
        </TabsContent>

        <TabsContent value="googlepay" className="space-y-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Complete your purchase securely with Google Pay
            </p>
            <Button
              type="button"
              onClick={handleGooglePay}
              className="w-full bg-[#4285F4] hover:bg-[#357ABD] text-white h-12 relative"
              disabled={!stripe || isLoading}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {isLoading ? "Processing..." : "Pay with Google Pay"}
              </div>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </form>
  );
}

export function PaymentForm({ price, artworkId }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string>();

  const initializePayment = async () => {
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price,
          artworkId,
        }),
      });

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      toast.error("Failed to initialize payment");
    }
  };

  if (!clientSecret) {
    return (
      <Button onClick={initializePayment} className="w-full">
        Continue to Payment
      </Button>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentFormContent price={price} artworkId={artworkId} />
    </Elements>
  );
} 