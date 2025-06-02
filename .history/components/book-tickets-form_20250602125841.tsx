'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, MinusCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
// Assuming you have Stripe Elements set up
// import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';

interface BookTicketsFormProps {
  exhibitionId: number;
  ticketPrice: number; // Price per ticket
}

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Assuming publishable key is needed here too

export default function BookTicketsForm({ exhibitionId, ticketPrice }: BookTicketsFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { toast } = useToast();

  // const stripe = useStripe();
  // const elements = useElements();

  const totalAmount = quantity * ticketPrice;

  // useEffect(() => {
  //   // Create PaymentIntent as soon as the page loads
  //   fetch('/api/create-payment-intent', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ items: [{ id: `exhibition-${exhibitionId}`, quantity, price: ticketPrice }] }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setClientSecret(data.clientSecret));
  // }, [exhibitionId, quantity, ticketPrice]);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // if (!stripe || !elements) {
    //   // Stripe.js has not yet loaded.
    //   setLoading(false);
    //   return;
    // }

    // const result = await stripe.confirmPayment({
    //   elements,
    //   confirmParams: {
    //     return_url: `${window.location.origin}/payment-success`, // Redirect to a success page
    //   },
    // });

    // if (result.error) {
    //   setError(result.error.message);
    //   toast({
    //     title: 'Payment Failed',
    //     description: result.error.message,
    //     variant: 'destructive',
    //   });
    // } else {
    //   // Payment succeeded
    //   // The user will be redirected to the return_url
    // }

    setLoading(false);
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0 space-y-4">
        <form id="ticket-payment-form" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
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
            />
          </div>

          <div className="text-lg font-semibold">Total: ${totalAmount.toLocaleString()}</div>

          {/* Stripe Payment Element - Uncomment and configure when ready */}
          {/* {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentElement />
            </Elements>
          )} */}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading || !clientSecret}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 