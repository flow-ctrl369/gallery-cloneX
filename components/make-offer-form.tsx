'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

interface MakeOfferFormProps {
  artworkId: number;
  artworkTitle: string;
}

export default function MakeOfferForm({ artworkId, artworkTitle }: MakeOfferFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artworkId,
          artworkTitle,
          name,
          email,
          phone,
          offerAmount: parseFloat(offerAmount),
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit offer');
      }

      toast({
        title: "Offer Submitted",
        description: "Your offer has been submitted successfully! We'll contact you soon.",
      });

      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setOfferAmount('');
      setMessage('');
      setTermsAccepted(false);
    } catch (err) {
      console.error('Offer submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit offer');
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-0 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your Phone Number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offerAmount">Offer Amount ($)</Label>
            <Input
              id="offerAmount"
              type="number"
              value={offerAmount}
              onChange={(e) => setOfferAmount(e.target.value)}
              placeholder="Enter your offer amount"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any additional information you'd like to share"
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              required
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the terms and conditions and confirm this is a genuine offer
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
                Submitting...
              </>
            ) : (
              'Submit Offer'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 