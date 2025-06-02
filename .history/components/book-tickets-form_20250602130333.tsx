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
    console.log('Form submitted:', { name, email, quantity, totalAmount });
    
    if (!name || !email) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Booking Successful",
        description: "Your tickets have been booked successfully!",
      });
      
      // Reset form
      setName('');
      setEmail('');
      setQuantity(1);
    } catch (err) {
      console.error('Booking error:', err);
      setError('Failed to process booking. Please try again.');
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
    <Card className="border-none shadow-none">
      <CardContent className="p-0 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Stripe Payment Element - Uncomment and configure when ready */}
          {/* {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentElement />
            </Elements>
          )} */}

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 