import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { exhibitionId, name, email, quantity, totalAmount } = await request.json();

    // Validate required fields
    if (!exhibitionId || !name || !email || !quantity || !totalAmount) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        exhibitionId,
        name,
        email,
        quantity,
        totalAmount,
      },
    });

    return NextResponse.json(
      { message: 'Booking successful', booking },
      { status: 200 }
    );

  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { message: 'Failed to create booking' },
      { status: 500 }
    );
  }
} 