import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // Check if email already exists
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (existingSubscription) {
      return NextResponse.json({ message: 'Email already subscribed' }, { status: 400 });
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: { email }
    });

    return NextResponse.json({ message: 'Subscription successful' }, { status: 200 });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 