'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { artworks } from '@/lib/data';

interface CheckoutFormProps {
  artworkId: string;
  clientSecret: string;
  buyerEmail: string;
  buyerName: string;
}

export default function CheckoutForm({ artworkId, clientSecret, buyerEmail, buyerName }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            email: buyerEmail,
            name: buyerName,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'An error occurred during payment.');
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Store purchase details in localStorage
        const artwork = artworks.find(a => a.id === artworkId);
        if (artwork) {
          localStorage.setItem('purchaseDetails', JSON.stringify({
            artworkId,
            artworkTitle: artwork.title,
            buyerEmail,
            buyerName,
            amount: artwork.price,
            currency: 'NZD'
          }));
        }

        // Redirect to success page
        router.push(`/payment-confirmation?payment_intent=${paymentIntent.id}&payment_intent_client_secret=${clientSecret}&redirect_status=succeeded`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 border rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
      </div>
      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full"
      >
        {processing ? 'Processing...' : 'Complete Purchase'}
      </Button>
    </form>
  );
} 