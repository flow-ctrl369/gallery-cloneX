'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import PageTransition from "@/components/page-transition";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

interface PurchaseDetails {
  id: string;
  amount: number;
  currency: string;
  status: string;
  artworkTitle?: string;
  customerName?: string;
  customerEmail?: string;
  customerAddress?: string;
}

export default function PaymentConfirmationPage() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent_id');
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paymentIntentId) {
      const fetchPaymentIntent = async () => {
        try {
          const response = await fetch(`/api/payment-intent/${paymentIntentId}`);
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch payment details');
          }

          setPurchaseDetails(data);
        } catch (err) {
          console.error('Error fetching payment intent:', err);
          setError(err instanceof Error ? err.message : 'Failed to load purchase details.');
        } finally {
          setLoading(false);
        }
      };

      fetchPaymentIntent();
    } else {
      setError('No payment intent ID found.');
      setLoading(false);
    }
  }, [paymentIntentId]);

  if (loading) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
          <h1 className="text-2xl font-bold mb-4">Loading Purchase Details...</h1>
          <p className="text-muted-foreground">Please wait while we confirm your payment.</p>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center text-red-500">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button asChild>
            <Link href="/">Return to Gallery</Link>
          </Button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">Thank you for your purchase. Your payment has been confirmed.</p>

        {purchaseDetails && (
          <Card className="w-full max-w-md mb-8">
            <CardHeader>
              <CardTitle className="text-center">Purchase Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div>
                <p className="font-semibold">Artwork:</p>
                <p className="text-muted-foreground">{purchaseDetails.artworkTitle || 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold">Amount Paid:</p>
                <p className="text-muted-foreground">${purchaseDetails.amount.toFixed(2)} {purchaseDetails.currency.toUpperCase()}</p>
              </div>
              <div>
                <p className="font-semibold">Customer Name:</p>
                <p className="text-muted-foreground">{purchaseDetails.customerName || 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold">Customer Email:</p>
                <p className="text-muted-foreground">{purchaseDetails.customerEmail || 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold">Delivery Address:</p>
                <p className="text-muted-foreground">{purchaseDetails.customerAddress || 'N/A'}</p>
              </div>
              <div className="text-sm text-muted-foreground italic pt-4 border-t">
                 A confirmation email with your purchase details has been sent or will be sent shortly.
              </div>
            </CardContent>
          </Card>
        )}

        <Button asChild>
          <Link href="/">Return to Gallery</Link>
        </Button>
      </div>
    </PageTransition>
  );
} 