import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOfferEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { artworkId, artworkTitle, name, email, phone, offerAmount, message } = await request.json();

    // Validate required fields
    if (!artworkId || !name || !email || !phone || !offerAmount) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate offer amount is a positive number
    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { message: 'Invalid offer amount' },
        { status: 400 }
      );
    }

    console.log('Creating offer with data:', {
      artworkId,
      artworkTitle,
      name,
      email,
      phone,
      offerAmount: amount,
      message: message || '',
    });

    // Create offer
    const offer = await prisma.offer.create({
      data: {
        artworkId,
        artworkTitle,
        name,
        email,
        phone,
        offerAmount: amount,
        message: message || '',
      },
    });

    console.log('Offer created successfully:', offer);

    // Send email notification
    try {
      await sendOfferEmail({
        artworkTitle,
        name,
        email,
        phone,
        offerAmount: amount,
        message: message || '',
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      { message: 'Offer submitted successfully', offer },
      { status: 200 }
    );

  } catch (error) {
    console.error('Offer submission error:', error);
    
    // Check if it's a Prisma error
    if (error instanceof Error) {
      return NextResponse.json(
        { message: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to submit offer' },
      { status: 500 }
    );
  }
} 