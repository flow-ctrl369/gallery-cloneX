"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import PageTransition from '@/components/page-transition';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const paymentIntent = searchParams.get('payment_intent');
  const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');

  useEffect(() => {
    // You could verify the payment status here if needed
    console.log('Payment completed:', { paymentIntent, paymentIntentClientSecret });
  }, [paymentIntent, paymentIntentClientSecret]);

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-6 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your tickets have been booked successfully.
              A confirmation email has been sent to your email address.
            </p>
            <div className="pt-4">
              <Button asChild>
                <Link href="/exhibitions">Back to Exhibitions</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
} 