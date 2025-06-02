'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import PageTransition from "@/components/page-transition";
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { artworks, artists } from '@/lib/data';
import { sendPurchaseEmails } from '@/lib/email';

interface PurchaseDetails {
  id: string;
  amount: number;
  currency: string;
  status: string;
  artworkTitle: string;
  artworkId: string;
  buyerEmail: string;
  buyerName: string;
}

export default function PaymentConfirmationPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const payment_intent = searchParams.get('payment_intent');
    const payment_intent_client_secret = searchParams.get('payment_intent_client_secret');
    const redirect_status = searchParams.get('redirect_status');

    if (!payment_intent || !payment_intent_client_secret) {
      setStatus('error');
      setError('Payment details not found. Missing payment_intent_id.');
      return;
    }

    // Here you would typically verify the payment with your backend
    // For now, we'll simulate a successful payment
    if (redirect_status === 'succeeded') {
      setStatus('success');
      
      // Get the artwork details from localStorage (set during purchase)
      const purchaseDetails = localStorage.getItem('purchaseDetails');
      if (purchaseDetails) {
        const { artworkId, buyerEmail, buyerName } = JSON.parse(purchaseDetails) as PurchaseDetails;
        const artwork = artworks.find(a => a.id === artworkId);
        const artist = artists.find(a => a.name === artwork?.artist);

        if (artwork && artist) {
          // Send confirmation emails
          sendPurchaseEmails({
            buyerEmail,
            buyerName,
            artworkTitle: artwork.title,
            artistName: artist.name,
            artistEmail: artist.email || 'flipperzeronz@gmail.com', // Fallback to gallery email if artist email not available
            price: artwork.price,
            purchaseDate: new Date().toLocaleDateString(),
            transactionId: payment_intent
          }).catch(console.error);

          // Clear purchase details from localStorage
          localStorage.removeItem('purchaseDetails');
        }
      }
    } else {
      setStatus('error');
      setError('Payment failed or was cancelled.');
    }
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
          {/* Add a loading spinner or message here */}
          <p>Loading purchase details...</p>
        </div>
      </PageTransition>
    );
  }

  if (status === 'error') {
    return (
      <PageTransition>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center text-red-500">
          <XCircle className="w-16 h-16 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Payment Failed or Cancelled</h1>
          <p className="mb-8">{error}</p>
          <Button asChild variant="destructive">
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
        <p className="text-muted-foreground mb-8">Thank you for your purchase. You will receive a confirmation email shortly.</p>
        
        <Button asChild>
          <Link href="/">Return to Gallery</Link>
        </Button>
      </div>
    </PageTransition>
  );
} 