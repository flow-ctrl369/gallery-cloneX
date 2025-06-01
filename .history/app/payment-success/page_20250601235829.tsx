'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentSuccess() {
  const [status, setStatus] = useState<'processing' | 'succeeded' | 'failed'>('processing');
  const searchParams = useSearchParams();

  useEffect(() => {
    const payment_intent = searchParams.get('payment_intent');
    const payment_intent_client_secret = searchParams.get('payment_intent_client_secret');

    if (payment_intent && payment_intent_client_secret) {
      // Here you would typically verify the payment status with your backend
      setStatus('succeeded');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {status === 'processing' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Processing your payment...</h1>
            <p>Please wait while we confirm your payment.</p>
          </div>
        )}
        {status === 'succeeded' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
            <p className="mb-6">Thank you for your purchase.</p>
            <Button asChild>
              <Link href="/">Return to Gallery</Link>
            </Button>
          </div>
        )}
        {status === 'failed' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Payment Failed</h1>
            <p className="mb-6">There was an error processing your payment.</p>
            <Button asChild>
              <Link href="/">Return to Gallery</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 