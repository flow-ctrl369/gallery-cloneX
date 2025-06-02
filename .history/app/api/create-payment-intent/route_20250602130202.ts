import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const { exhibitionId, name, email, quantity, totalAmount } = await request.json();

    // Create a booking record
    const booking = await prisma.booking.create({
      data: {
        exhibitionId,
        name,
        email,
        quantity,
        totalAmount,
        status: 'pending',
      },
    });

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: booking.id.toString(),
        exhibitionId: exhibitionId.toString(),
      },
    });

    // Update booking with payment intent ID
    await prisma.booking.update({
      where: { id: booking.id },
      data: { paymentIntent: paymentIntent.id },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      bookingId: booking.id,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    );
  }
} 