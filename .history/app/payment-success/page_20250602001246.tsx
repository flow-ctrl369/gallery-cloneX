"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Package, Truck } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<"success" | "processing" | "error">("processing");

  useEffect(() => {
    const payment_intent = searchParams.get("payment_intent");
    const payment_intent_client_secret = searchParams.get("payment_intent_client_secret");
    const redirect_status = searchParams.get("redirect_status");

    if (redirect_status === "succeeded") {
      setPaymentStatus("success");
    } else if (redirect_status === "processing") {
      setPaymentStatus("processing");
    } else {
      setPaymentStatus("error");
    }
  }, [searchParams]);

  return (
    <div className="container max-w-2xl py-12">
      <Card className="border-2 border-green-500">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {paymentStatus === "success" && (
              <>
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                <h1 className="text-3xl font-bold">Payment Successful!</h1>
                <p className="text-muted-foreground">
                  Thank you for your purchase. Your artwork will be carefully packaged and shipped within 3-5 business days.
                </p>
              </>
            )}

            {paymentStatus === "processing" && (
              <>
                <Package className="w-16 h-16 text-yellow-500 mx-auto animate-bounce" />
                <h1 className="text-3xl font-bold">Processing Payment</h1>
                <p className="text-muted-foreground">
                  Your payment is being processed. This may take a few moments. Please don't close this page.
                </p>
              </>
            )}

            {paymentStatus === "error" && (
              <>
                <Truck className="w-16 h-16 text-red-500 mx-auto" />
                <h1 className="text-3xl font-bold">Payment Failed</h1>
                <p className="text-muted-foreground">
                  We couldn't process your payment. Please try again or contact our support team.
                </p>
              </>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Careful Packaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Quality Guaranteed</span>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/">
                  <Button variant="outline" className="mr-4">
                    Return Home
                  </Button>
                </Link>
                <Link href="/gallery">
                  <Button>
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 