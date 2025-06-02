'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

interface PurchaseInfoFormProps {
  artworkTitle: string;
  onComplete: (data: PurchaseInfo) => void;
  defaultValues?: PurchaseInfo;
}

export interface PurchaseInfo {
  name: string;
  email: string;
  address: string;
  recaptchaVerified: boolean;
}

export default function PurchaseInfoForm({ artworkTitle, onComplete, defaultValues }: PurchaseInfoFormProps) {
  const [name, setName] = useState(defaultValues?.name || '');
  const [email, setEmail] = useState(defaultValues?.email || '');
  const [address, setAddress] = useState(defaultValues?.address || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recaptchaVerified, setRecaptchaVerified] = useState(defaultValues?.recaptchaVerified || false);
  const { toast } = useToast();

  useEffect(() => {
    if (defaultValues) {
      setName(defaultValues.name || '');
      setEmail(defaultValues.email || '');
      setAddress(defaultValues.address || '');
      setRecaptchaVerified(defaultValues.recaptchaVerified || false);
    }
  }, [defaultValues]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!recaptchaVerified) {
      setError('Please verify that you are not a robot');
      setLoading(false);
      return;
    }

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate required fields
      if (!name || !email || !address) {
        throw new Error('Please fill in all required fields');
      }

      onComplete({
        name,
        email,
        address,
        recaptchaVerified
      });

    } catch (err) {
      console.error('Form validation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit form');
      toast({
        title: "Validation Error",
        description: err instanceof Error ? err.message : 'Please check your input and try again.',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0 space-y-4">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Purchase Information</h2>
          <p className="text-muted-foreground">Please provide your details to proceed with the purchase of "{artworkTitle}"</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Full Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address *</Label>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Your Complete Address"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="recaptcha"
              checked={recaptchaVerified}
              onCheckedChange={(checked) => setRecaptchaVerified(checked as boolean)}
              required
            />
            <Label htmlFor="recaptcha" className="text-sm">
              I confirm that I am not a robot and agree to the terms and conditions
            </Label>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 