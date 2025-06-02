import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentIntentId = searchParams.get('payment_intent_id');

  if (!paymentIntentId) {
    return NextResponse.json(
      { message: 'Missing payment_intent_id' },
      { status: 400 }
    );
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
        return NextResponse.json(
            { message: 'Payment Intent not found' },
            { status: 404 }
          );
    }

    // Extract details, including metadata we added during creation
    const purchaseDetails = {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100, // Convert cents back to dollars
      currency: paymentIntent.currency.toUpperCase(),
      status: paymentIntent.status,
      artworkTitle: paymentIntent.metadata.artworkTitle || 'N/A',
      artworkId: paymentIntent.metadata.artworkId || 'N/A',
    };

    return NextResponse.json(purchaseDetails);

  } catch (error) {
    console.error('Error fetching payment intent:', error);
    return NextResponse.json(
      { message: 'Failed to fetch payment details' },
      { status: 500 }
    );
  }
} 