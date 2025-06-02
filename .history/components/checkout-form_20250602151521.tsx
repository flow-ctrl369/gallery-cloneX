'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { PurchaseInfo } from './purchase-info-form';

interface CheckoutFormProps {
  artwork: {
    id: string;
    title: string;
    price: number;
  };
  purchaseInfo: PurchaseInfo;
}

export default function CheckoutForm({ artwork, purchaseInfo }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-confirmation`,
          payment_method_data: {
            billing_details: {
              name: purchaseInfo.name,
              email: purchaseInfo.email,
              address: {
                line1: purchaseInfo.address,
              },
            },
          },
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message || 'An error occurred during payment.',
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Payment error:', err);
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0 space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Complete Your Purchase</h2>
          <p className="text-muted-foreground">Artwork: {artwork.title}</p>
          <p className="text-lg font-semibold">Total: ${artwork.price.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <PaymentElement />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!stripe || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay $${artwork.price.toFixed(2)}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 