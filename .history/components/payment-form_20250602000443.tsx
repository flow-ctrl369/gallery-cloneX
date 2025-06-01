"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Wallet, Banknote } from "lucide-react";

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
    const cardNumber = form["card-number"].value;
    const expiry = form["expiry"].value;
    const cvc = form["cvc"].value;

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
      <Tabs defaultValue="card" value={paymentMethod} onValueChange={setPaymentMethod}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="card" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Card
          </TabsTrigger>
          <TabsTrigger value="paypal" className="flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            PayPal
          </TabsTrigger>
          <TabsTrigger value="bank" className="flex items-center gap-2">
            <Banknote className="h-4 w-4" />
            Bank Transfer
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

        <TabsContent value="paypal" className="space-y-4">
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">
              You will be redirected to PayPal to complete your purchase securely.
            </p>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Continue with PayPal"}
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