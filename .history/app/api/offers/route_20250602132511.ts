import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Create offer
    const offer = await prisma.offer.create({
      data: {
        artworkId,
        artworkTitle,
        name,
        email,
        phone,
        offerAmount,
        message: message || '',
      },
    });

    return NextResponse.json(
      { message: 'Offer submitted successfully', offer },
      { status: 200 }
    );

  } catch (error) {
    console.error('Offer submission error:', error);
    return NextResponse.json(
      { message: 'Failed to submit offer' },
      { status: 500 }
    );
  }
} 