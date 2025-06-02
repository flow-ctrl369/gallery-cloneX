'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import PageTransition from "@/components/page-transition";

export default function PaymentConfirmationPage() {
  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">Thank you for your purchase. Your payment has been confirmed.</p>
        <Button asChild>
          <Link href="/">Return to Gallery</Link>
        </Button>
      </div>
    </PageTransition>
  );
} 