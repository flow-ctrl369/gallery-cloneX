'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import PageTransition from "@/components/page-transition";
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

interface PurchaseDetails {
  id: string;
  amount: number;
  currency: string;
  status: string;
  artworkTitle: string;
  artworkId: string;
}

export default function PaymentConfirmationPage() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const redirectStatus = searchParams.get('redirect_status'); // Get redirect status

  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Log the full search parameters on page load
    console.log('Payment Confirmation Page Loaded. Search params:', window.location.search);
    console.log('payment_intent_id from searchParams:', paymentIntentId);
    console.log('redirect_status from searchParams:', redirectStatus);

    const fetchPaymentDetails = async () => {
      if (!paymentIntentId) {
        setError('Payment details not found. Missing payment_intent_id.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/get-payment-details?payment_intent_id=${paymentIntentId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch payment details');
        }

        setPurchaseDetails(data);
      } catch (err) {
        console.error('Error fetching payment details:', err);
        setError('Failed to load purchase details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paymentIntentId, redirectStatus]); // Add redirectStatus to dependency array

  if (loading) {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
          {/* Add a loading spinner or message here */}
          <p>Loading purchase details...</p>
        </div>
      </PageTransition>
    );
  }

  // Handle cases where redirect_status is not 'succeeded' or payment_intent_id is missing
  if (redirectStatus !== 'succeeded' || error || !purchaseDetails || !paymentIntentId) {
    const errorMessage = error 
      ? error
      : !paymentIntentId 
        ? 'Payment details not found. Missing payment_intent_id.'
        : 'There was an issue processing your payment.';

    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center text-red-500">
          <XCircle className="w-16 h-16 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Payment Failed or Cancelled</h1>
          <p className="mb-8">{errorMessage}</p>
          <Button asChild variant="destructive">
            <Link href="/">Return to Gallery</Link>
          </Button>
        </div>
      </PageTransition>
    );
  }

  // Display successful payment details
  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">Thank you for your purchase. Your payment has been confirmed.</p>
        
        {purchaseDetails && (
          <Card className="w-full max-w-md mb-8">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Order Details</h2>
              <div className="space-y-2 text-sm text-left">
                <p><strong>Artwork:</strong> {purchaseDetails.artworkTitle}</p>
                <p><strong>Amount:</strong> {purchaseDetails.amount.toFixed(2)} {purchaseDetails.currency}</p>
                <p><strong>Payment ID:</strong> {purchaseDetails.id}</p>
                {/* Add more details here if needed, e.g., delivery address from metadata */}
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