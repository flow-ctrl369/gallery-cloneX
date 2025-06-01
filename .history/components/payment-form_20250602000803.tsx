"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Smartphone, Banknote, Shield, Truck, Clock } from "lucide-react";

interface PaymentFormProps {
  price: number;
  artworkId: string;
}

export default function PaymentForm({ price, artworkId }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const { toast } = useToast();

  const validateCardNumber = (number: string) => {
    return /^\d{16}$/.test(number.replace(/\s/g, ""));
  };

  const validateExpiry = (expiry: string) => {
    return /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiry);
  };

  const validateCVC = (cvc: string) => {
    return /^\d{3,4}$/.test(cvc);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const cardNumber = form["card-number"]?.value;
    const expiry = form["expiry"]?.value;
    const cvc = form["cvc"]?.value;

    if (paymentMethod === "card") {
      if (!validateCardNumber(cardNumber)) {
        toast({
          title: "Invalid Card Number",
          description: "Please enter a valid 16-digit card number.",
          variant: "destructive",
        });
        return;
      }

      if (!validateExpiry(expiry)) {
        toast({
          title: "Invalid Expiry Date",
          description: "Please enter a valid expiry date in MM/YY format.",
          variant: "destructive",
        });
        return;
      }

      if (!validateCVC(cvc)) {
        toast({
          title: "Invalid CVC",
          description: "Please enter a valid 3 or 4 digit CVC.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast({
        title: "Purchase Successful! 🎨",
        description: "Your artwork will be carefully packaged and shipped within 3-5 business days. You'll receive a tracking number via email.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "We couldn't process your payment. Please check your details and try again, or contact our support team.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="card" value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="card" className="flex items-center gap-2 py-3">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Card</span>
          </TabsTrigger>
          <TabsTrigger value="googlepay" className="flex items-center gap-2 py-3">
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Google Pay</span>
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center gap-2 py-3">
            <Banknote className="h-4 w-4" />
            <span className="hidden sm:inline">Bank</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="card" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <Input
              id="card-number"
              placeholder="1234 5678 9012 3456"
              disabled={isLoading}
              required
              maxLength={19}
              onChange={(e) => {
                const value = e.target.value.replace(/\s/g, "");
                const formatted = value.replace(/(\d{4})/g, "$1 ").trim();
                e.target.value = formatted;
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                disabled={isLoading}
                required
                maxLength={5}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length >= 2) {
                    e.target.value = `${value.slice(0, 2)}/${value.slice(2)}`;
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                disabled={isLoading}
                required
                maxLength={4}
                type="password"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="googlepay" className="space-y-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Complete your purchase securely with Google Pay
            </p>
            <Button 
              type="submit" 
              className="w-full bg-[#4285F4] hover:bg-[#357ABD] text-white h-12 relative"
              disabled={isLoading}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {isLoading ? "Processing..." : "Pay with Google Pay"}
              </div>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="bank" className="space-y-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              Please use the following bank details to complete your transfer:
            </p>
            <div className="bg-muted p-4 rounded-lg text-left space-y-2">
              <p><strong>Bank:</strong> Art Gallery Bank</p>
              <p><strong>Account Name:</strong> Modern Art Gallery</p>
              <p><strong>Account Number:</strong> 1234 5678 9012 3456</p>
              <p><strong>Reference:</strong> {artworkId}</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Artwork Price</span>
            <span>${price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Tax</span>
            <span>${(price * 0.1).toFixed(2)}</span>
          </div>
          <div className="border-t pt-4 flex justify-between items-center">
            <span className="font-semibold">Total Amount</span>
            <span className="text-lg font-bold">${(price * 1.1).toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4" />
          <span>Free Shipping</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>3-5 Day Delivery</span>
        </div>
      </div>

      {paymentMethod === "card" && (
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Complete Purchase"}
        </Button>
      )}
    </form>
  );
} 