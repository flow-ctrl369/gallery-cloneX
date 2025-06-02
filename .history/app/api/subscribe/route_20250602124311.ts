import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
    }

    // In a real application, you would integrate with a newsletter service here
    // For example, using Resend, Mailchimp, etc.
    console.log('Newsletter signup email received:', email);

    // Simulate a successful subscription
    return NextResponse.json({ message: 'Subscription successful' }, { status: 200 });

  } catch (error) {
    console.error('Newsletter signup error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 