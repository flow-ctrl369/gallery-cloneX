'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, MinusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface BookTicketsFormProps {
  exhibitionId: number;
  ticketPrice: number;
}

function CheckoutForm({ exhibitionId, ticketPrice, name, email, quantity, totalAmount }: BookTicketsFormProps & { name: string; email: string; quantity: number; totalAmount: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Create payment intent and booking
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exhibitionId,
          name,
          email,
          quantity,
          totalAmount,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Confirm the payment
      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      // Send confirmation email
      await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: data.bookingId }),
      });

      toast({
        title: "Booking Successful",
        description: "Your tickets have been booked successfully!",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process booking');
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={loading || !stripe}>
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          'Confirm Booking'
        )}
      </Button>
    </form>
  );
}

export default function BookTicketsForm({ exhibitionId, ticketPrice }: BookTicketsFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const totalAmount = quantity * ticketPrice;

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exhibitionId,
        name,
        email,
        quantity,
        totalAmount,
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [exhibitionId, quantity, ticketPrice, name, email]);

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              type="button"
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center"
              min={1}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleQuantityChange(1)}
              type="button"
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="text-lg font-semibold">Total: ${totalAmount.toLocaleString()}</div>

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              exhibitionId={exhibitionId}
              ticketPrice={ticketPrice}
              name={name}
              email={email}
              quantity={quantity}
              totalAmount={totalAmount}
            />
          </Elements>
        )}
      </CardContent>
    </Card>
  );
} 