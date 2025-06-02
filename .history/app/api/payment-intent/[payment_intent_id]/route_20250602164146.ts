import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentIntentId = searchParams.get('payment_intent_id');

  if (!paymentIntentId) {
    return NextResponse.json({ error: 'Missing payment_intent_id' }, { status: 400 });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (!paymentIntent) {
      return NextResponse.json({ error: 'Payment Intent not found' }, { status: 404 });
    }

    // You can select specific details to return to the frontend
    const purchaseDetails = {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100, // Convert cents back to dollars
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      artworkTitle: paymentIntent.metadata.artworkTitle,
      customerName: paymentIntent.billing_details.name,
      customerEmail: paymentIntent.billing_details.email,
      customerAddress: paymentIntent.billing_details.address?.line1,
    };

    return NextResponse.json(purchaseDetails);

  } catch (error) {
    console.error('Error fetching payment intent:', error);
    return NextResponse.json({ error: 'Failed to fetch payment intent' }, { status: 500 });
  }
} 